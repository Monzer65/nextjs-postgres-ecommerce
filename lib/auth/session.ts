import { db } from "@/db/db";
import {
    encodeBase32LowerCaseNoPadding,
    encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { cache } from "react";
import { NewUserSession, Permission, Role, User, UserSession } from "@/db/schema";
import { setOtpAsNotVerified } from "./user";

export async function validateSessionToken(
    token: string
): Promise<SessionValidationResult & { roles?: Role[]; permissions?: Permission[] }> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const result = await db
        .selectFrom("user_session as s")
        .innerJoin("user as p", "s.user_id", "p.id")
        .leftJoin("user_role as ur", "p.id", "ur.user_id")
        .leftJoin("role as r", "ur.role_id", "r.id")
        .leftJoin("role_permission as rp", "r.id", "rp.role_id")
        .leftJoin("permission as perm", "rp.permission_id", "perm.id")
        .where("s.id", "=", sessionId)
        .select([
            // Session fields
            "s.id as s_id",
            "s.user_id as s_userId",
            "s.expires_at as s_expiresAt",
            "s.created_at as s_createdAt",
            // User fields
            "p.id as user_id",
            "p.avatar",
            "p.email",
            "p.email_verified",
            "p.first_name",
            "p.last_name",
            "p.phone",
            "p.phone_verified",
            "p.otp_verified",
            "p.username",
            "p.created_at as user_createdAt",
            "p.updated_at as user_updatedAt",
            // Role fields
            "r.id as role_id",
            "r.name as role_name",
            "r.description as role_description",
            "r.created_at as role_createdAt",
            "r.updated_at as role_updatedAt",
            // Permission fields
            "perm.id as permission_id",
            "perm.name as permission_name",
            "perm.description as permission_description",
            "perm.created_at as permission_createdAt",
            "perm.updated_at as permission_updatedAt",
        ])
        .execute();

    if (!result || result.length === 0) {
        return { session: null, user: null, roles: [], permissions: [] };
    }

    // Extract session and user
    const firstRow = result[0];
    const session: UserSession = {
        id: firstRow.s_id,
        user_id: firstRow.s_userId,
        expires_at: firstRow.s_expiresAt,
        created_at: firstRow.s_createdAt,
    };

    const user: User = {
        id: firstRow.user_id,
        avatar: firstRow.avatar,
        email: firstRow.email,
        email_verified: firstRow.email_verified,
        first_name: firstRow.first_name,
        last_name: firstRow.last_name,
        phone: firstRow.phone,
        phone_verified: firstRow.phone_verified,
        otp_verified: firstRow.otp_verified,
        username: firstRow.username,
        created_at: firstRow.user_createdAt,
        updated_at: firstRow.user_updatedAt,
    };

    if (Date.now() >= session.expires_at.getTime()) {
        await db.deleteFrom("user_session").where("id", "=", sessionId).execute();
        return { session: null, user: null, roles: [], permissions: [] };
    }

    if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db
            .updateTable("user_session")
            .set("expires_at", session.expires_at)
            .where("id", "=", sessionId)
            .execute();
    }

    // Process roles and permissions
    const roles = new Map<number, Role>();
    const permissions = new Map<number, Permission>();

    for (const row of result) {
        if (row.role_id && !roles.has(row.role_id)) {
            roles.set(row.role_id, {
                id: row.role_id,
                name: row.role_name ?? "",
                description: row.role_description,
                created_at: row.role_createdAt ?? new Date(),
                updated_at: row.role_updatedAt ?? new Date(),
            });
        }
        if (row.permission_id && !permissions.has(row.permission_id)) {
            permissions.set(row.permission_id, {
                id: row.permission_id,
                name: row.permission_name ?? "",
                description: row.permission_description,
                created_at: row.permission_createdAt ?? new Date(),
                updated_at: row.permission_updatedAt ?? new Date(),
            });
        }
    }

    return {
        session,
        user,
        roles: Array.from(roles.values()),
        permissions: Array.from(permissions.values()),
    };
}

export const getCurrentSession = cache(
    async (): Promise<SessionValidationResult> => {
        const token = (await cookies()).get("session")?.value ?? null;
        if (token === null) {
            return { session: null, user: null, roles: [], permissions: [] };
        }
        const result = validateSessionToken(token);
        return result;
    }
);

export async function invalidateSession(sessionId: string): Promise<void> {
    // delete all rows with the given user_id
    await db.deleteFrom("user_session").where("id", "=", sessionId).execute();
}

export async function invalidateUserSessions(userId: number): Promise<void> {
    await setOtpAsNotVerified(userId);
    await db.deleteFrom("user_session").where("user_id", "=", userId).execute();
}

export async function setSessionTokenCookie(
    token: string,
    expiresAt: Date
): Promise<void> {
    (await cookies()).set("session", token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
    });
}

export async function deleteSessionTokenCookie(): Promise<void> {
    (await cookies()).set("session", "", {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
    });
}

export function generateSessionToken(): string {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes);
    return token;
}

export async function createSession(
    token: string,
    userId: number
): Promise<NewUserSession> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: NewUserSession = {
        id: sessionId,
        user_id: userId,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        created_at: new Date().toISOString(),
    };

    await db.insertInto("user_session").values(session).execute();

    return session;
}

type SessionValidationResult =
    | {
        session: UserSession;
        user: User;
        roles: any;
        permissions: any
    }
    | { session: null; user: null, roles: [], permissions: [] };


