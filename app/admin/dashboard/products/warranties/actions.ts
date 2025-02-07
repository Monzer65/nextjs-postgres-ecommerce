"use server";

import { db } from "@/db/db";
import { warrantySchema } from "@/types/zod-schemas/warranties";
import { revalidatePath } from "next/cache";

type FormState = {
  message?: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
  data?: any;
};

export async function createNewWarranty(
  _prevstate: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get("name");
  const description = formData.get("description");
  const durationRaw = formData.get("duration");

  // Convert duration to a number
  const duration = Number(durationRaw);

  const parsedData = warrantySchema.safeParse({ name, description, duration });

  if (!parsedData.success) {
    return {
      message: "داده‌ها نامعتبر هستند",
      issues: parsedData.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  // **Sanitize the name** (trim, lowercase, remove extra spaces)
  const sanitizedName = parsedData.data.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  const sanitizedDescription = parsedData.data.description?.trim() || null;

  try {
    // Check for an existing warranty with the sanitized name
    const existingWarranty = await db
      .selectFrom("warranty")
      .select("name")
      .where("name", "=", sanitizedName) // Case-insensitive check
      .executeTakeFirst();

    if (existingWarranty) {
      return { message: "این  ضمانت قبلا ذخیره شده است", success: false };
    }

    // Insert sanitized values
    const result = await db
      .insertInto("warranty")
      .values({
        name: sanitizedName,
        description: sanitizedDescription,
        duration,
        updated_at: new Date(),
        created_at: new Date().toISOString(),
      })
      .returningAll()
      .execute();
    revalidatePath("/admin/dashboard/products/add");
    return {
      message: "ضمانت با موفقیت ذخیره شد",
      success: true,
      data: result[0],
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "خطای دیتابیس.  ضمانت در دیتابیس ذخیره نشد",
      success: false,
      issues: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}
