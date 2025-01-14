"use server";

import { db } from "@/db/db";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { cookies } from "next/headers";
import { getCurrentSession } from "./session";
import { cache } from "react";
import { NewVerificationRequest, VerificationRequest } from "@/db/schema";
import { normalizePhone } from "./normalize-phone";

export async function getUserVerificationRequest(
  userId: number,
  id: string
): Promise<VerificationRequest | null> {
  const row = await db
    .selectFrom("verification_request")
    .selectAll()
    .where("id", "=", id)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!row) {
    return null;
  }

  const request: VerificationRequest = {
    id: row.id,
    user_id: row.user_id,
    otp: row.otp,
    phone_number: row.phone_number,
    expires_at: row.expires_at,
  };
  return request;
}

export async function createVerificationRequest(
  userId: number,
  phone: string
): Promise<NewVerificationRequest> {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    throw new Error("تلفن نامعتبر است");
  }
  await deleteUserVerificationRequest(userId);
  const idBytes = new Uint8Array(20);
  crypto.getRandomValues(idBytes);
  const id = encodeBase32LowerCaseNoPadding(idBytes);

  // const code = generateRandomOTP();
  const code = Math.floor(100000 + Math.random() * 900000); //  6-digit code
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes
  const row = await db
    .insertInto("verification_request")
    .values({
      id,
      user_id: userId,
      phone_number: normalizedPhone,
      otp: code.toString(),
      expires_at: expiresAt,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  const request: NewVerificationRequest = {
    id: row.id,
    user_id: row.user_id,
    otp: row.otp,
    phone_number: row.phone_number,
    expires_at: row.expires_at,
  };
  return request;
}

export async function deleteUserVerificationRequest(
  userId: number
): Promise<void> {
  await db
    .deleteFrom("verification_request")
    .where("user_id", "=", userId)
    .execute();
}

export async function setVerificationRequestCookie(
  request: VerificationRequest
): Promise<void> {
  (await cookies()).set("verification_request", request.id, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: request.expires_at,
  });
}

export async function deleteVerificationRequestCookie(): Promise<void> {
  (await cookies()).set("verification_request", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export const getCurrentUserVerificationRequest = cache(async () => {
  const { user } = await getCurrentSession();
  if (user === null) {
    return null;
  }

  const id = (await cookies()).get("verification_request")?.value ?? null;
  if (id === null) {
    return null;
  }
  const request = await getUserVerificationRequest(user.id, id);
  if (request === null) {
    await deleteVerificationRequestCookie();
  }
  return request;
});
