"use server";

import { normalizePhone } from "@/lib/auth/normalize-phone";
import { RefillingTokenBucket } from "@/lib/auth/rate-limit";
import { globalPOSTRateLimit } from "@/lib/auth/request";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth/session";
import { createUser, getUserFromphone, setOtpAsNotVerified } from "@/lib/auth/user";
import {
  createVerificationRequest,
  setVerificationRequestCookie,
} from "@/lib/auth/verification";
import { sendVerificationSMS } from "@/lib/auth/verification-sms";
import { loginSignupSchema } from "@/types/zod-schemas/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type FormState = {
  message: string;
  success?: boolean;
};

interface VerificationSetupParams {
  userId: number;
  phone: string;
}

const IP_REQUESTS_LIMIT = 3;
const IP_TIME_WINDOW = 60; // seconds
const ipBucket = new RefillingTokenBucket<string>(
  IP_REQUESTS_LIMIT,
  IP_TIME_WINDOW
);

async function checkRateLimits(): Promise<{ error: string | null }> {
  const globalLimitOk = await globalPOSTRateLimit();
  if (!globalLimitOk) {
    return { error: "تعداد درخواست های شما بیش از حد مجاز است" };
  }

  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP && !ipBucket.check(clientIP, 1)) {
    return { error: "تعداد درخواست های شما بیش از حد مجاز است" };
  }

  return { error: null };
}

async function setupVerificationAndSession({
  userId,
  phone,
}: VerificationSetupParams) {
  const verificationRequest = await createVerificationRequest(userId, phone);

  await Promise.all([
    // sendVerificationSMS(
    //   verificationRequest.phone_number,
    //   verificationRequest.otp
    // ),
    setVerificationRequestCookie(verificationRequest),
    setupUserSession(userId),
  ]);
}

async function setupUserSession(userId: number) {
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, userId);
  await setSessionTokenCookie(sessionToken, session.expires_at);
}

export async function loginSignupAction(
  _prevstate: FormState,
  formData: FormData
): Promise<FormState> {
  // Rate limiting check
  const { error: rateLimitError } = await checkRateLimits();
  if (rateLimitError) {
    return { message: rateLimitError, success: false };
  }

  // Phone validation
  const phone = formData.get("phone");
  const parsed = loginSignupSchema.safeParse({ phone });

  if (!parsed.success) {
    return { message: parsed.error.message, success: false };
  }

  const normalizedPhone = normalizePhone(parsed.data.phone);
  if (!normalizedPhone) {
    return { message: "تلفن نامعتبر است", success: false };
  }

  try {
    const existingUser = await getUserFromphone(normalizedPhone!);
    if (existingUser) {
      await setOtpAsNotVerified(existingUser.id)
      await setupVerificationAndSession({
        userId: existingUser.id,
        phone: existingUser.phone,
      });
    } else {
      const newUser = await createUser(normalizedPhone!);
      if (!newUser?.id) {
        return { message: "خطا در ثبت کاربر", success: false };
      }

      await setupVerificationAndSession({
        userId: newUser.id,
        phone: newUser.phone,
      });
    }
  } catch (error) {
    console.error(error);
    return {
      message: "خطا در پردازش درخواست",
      success: false,
    };
  }
  return redirect("/auth/verify");
}
