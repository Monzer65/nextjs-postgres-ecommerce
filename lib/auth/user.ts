import { db } from "@/db/db";
import { NewUser, User } from "@/db/schema";
import { generateRandomUsername } from "./random-username";

export async function createUser(phone: string): Promise<NewUser> {
    const username = generateRandomUsername();
    const row = await db
        .insertInto("user")
        .values({
            phone,
            phone_verified: false,
            email_verified: false,
            otp_verified: false,
            username,
            updated_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

    if (!row) {
        throw new Error("Unexpected error");
    }

    const user = {
        ...row,
        created_at: row.created_at.toISOString(),
    };
    return user;
}

export async function updateUserphoneAndSetphoneAsVerified(
    userId: number,
    phone: string
): Promise<void> {
    await db
        .updateTable("user")
        .set({ phone, phone_verified: true })
        .where("id", "=", userId)
        .execute();
}

export async function setOtpAsVerified(userId: number): Promise<void> {
    await db
        .updateTable("user")
        .set({ otp_verified: true })
        .where("id", "=", userId)
        .execute();
}

export async function setOtpAsNotVerified(userId: number): Promise<void> {
    await db
        .updateTable("user")
        .set({ otp_verified: false })
        .where("id", "=", userId)
        .execute();
}

export async function setUserAsphoneVerifiedIfphoneMatches(
    userId: number,
    phone: string
): Promise<boolean> {
    const result = await db
        .updateTable("user")
        .set({ phone_verified: true })
        .where("id", "=", userId)
        .where("phone", "=", phone)
        .executeTakeFirst();
    return result.numUpdatedRows > 0;
}

export async function getUserFromphone(
    phone: string
): Promise<Pick<
    User,
    | "id"
    | "avatar"
    | "email"
    | "email_verified"
    | "first_name"
    | "last_name"
    | "phone"
    | "phone_verified"
    | "otp_verified"
    | "username"
> | null> {
    const row = await db
        .selectFrom("user")
        .select([
            "id",
            "avatar",
            "email",
            "email_verified",
            "first_name",
            "last_name",
            "phone",
            "phone_verified",
            "otp_verified",
            "username",
        ])
        .where("phone", "=", phone)
        .executeTakeFirst();
    if (!row) {
        return null;
    }
    const user: Pick<
        User,
        | "id"
        | "avatar"
        | "email"
        | "email_verified"
        | "first_name"
        | "last_name"
        | "phone"
        | "phone_verified"
        | "otp_verified"
        | "username"
    > = {
        id: row.id,
        avatar: row.avatar,
        email: row.email,
        email_verified: row.email_verified,
        first_name: row.first_name,
        last_name: row.last_name,
        phone: row.phone,
        phone_verified: row.phone_verified,
        otp_verified: row.otp_verified,
        username: row.username,
    };

    return user;
}

export async function checkPhoneAvailability(phone: string): Promise<boolean> {
    const row = await db
        .selectFrom("user")
        .where("phone", "=", phone)
        .limit(1)
        .executeTakeFirst();

    return row == null;
}
