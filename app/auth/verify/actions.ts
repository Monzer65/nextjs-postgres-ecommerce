"use server";

import {
  createVerificationRequest,
  deleteVerificationRequestCookie,
  deleteUserVerificationRequest,
  getCurrentUserVerificationRequest,
} from "@/lib/auth/verification";
import { ExpiringTokenBucket } from "@/lib/auth/rate-limit";
import { globalPOSTRateLimit } from "@/lib/auth/request";
import { getCurrentSession } from "@/lib/auth/session";
import {
  setOtpAsVerified,
  updateUserphoneAndSetphoneAsVerified,
} from "@/lib/auth/user";
import { verifySchema } from "@/types/zod-schemas/auth";
import { redirect } from "next/navigation";
import { sendVerificationSMS } from "@/lib/auth/verification-sms";

interface FormState {
  message: string;
  success?: boolean;
}

const bucket = new ExpiringTokenBucket<number>(5, 60 * 30);

export async function verifyAction(_prevstate: FormState, formData: FormData) {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "تعداد درخواست‌های شما بیش از حد مجاز است",
      success: false,
    };
  }

  const code = formData.get("code");
  const parsed = verifySchema.safeParse({ code });
  if (!parsed.success) {
    return { message: parsed.error.message, success: false };
  }

  const { session, user } = await getCurrentSession();
  if (session === null) {
    return {
      message: "کاربر یافت نشد",
      success: false,
    };
  }

  if (!bucket.check(user.id, 1)) {
    return {
      message: "تعداد درخواست‌های شما بیش از حد مجاز است",
      success: false,
    };
  }

  let verificationRequest = await getCurrentUserVerificationRequest();
  if (verificationRequest === null) {
    return {
      message: "کاربر یافت نشد",
      success: false,
    };
  }

  if (!bucket.consume(user.id, 1)) {
    return {
      message: "تعداد درخواست‌های شما بیش از حد مجاز است",
      success: false,
    };
  }
  if (Date.now() >= verificationRequest.expires_at.getTime()) {
    const newRequest = await createVerificationRequest(
      verificationRequest.user_id,
      verificationRequest.phone_number
    );
    verificationRequest = newRequest;
    // await sendVerificationSMS(
    //   verificationRequest.phone_number,
    //   verificationRequest.otp
    // );
    return {
      message: "کد تایید منقضی شده است. یک کد دیگر برای شما ارسال شد",
      success: false,
    };
  }
  if (verificationRequest.otp !== code) {
    return {
      message: "کد اشتباه است",
      success: false,
    };
  }
  await deleteUserVerificationRequest(user.id);
  if (!user.phone_verified) {
    await updateUserphoneAndSetphoneAsVerified(
      user.id,
      verificationRequest.phone_number
    );
  }
  await setOtpAsVerified(user.id);
  await deleteVerificationRequestCookie();

  return redirect("/");
}
