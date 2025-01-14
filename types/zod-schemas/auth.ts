import { z } from "zod";
import { normalizePhone } from "@/lib/auth/normalize-phone";

export const loginSignupSchema = z.object({
  phone: z.string().refine(normalizePhone, {
    message: "تلفن نامعتبر است",
  }),
});

export type LoginSignupSchema = z.infer<typeof loginSignupSchema>;

export const verifySchema = z.object({
  code: z
    .string()
    .min(6, "کد تایید باید 6 رقم باشد")
    .max(6, "کد تایید باید 6 رقم باشد"),
});

export type VerifySchema = z.infer<typeof verifySchema>;
