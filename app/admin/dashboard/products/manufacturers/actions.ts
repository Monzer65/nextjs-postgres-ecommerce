"use server";

import { db } from "@/db/db";
import { manufacturerSchema } from "@/types/zod-schemas/manufacturers";
import { revalidatePath } from "next/cache";

type FormState = {
  message?: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
  data?: any;
};

export async function createNewManufacturer(
  _prevstate: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get("name");
  const description = formData.get("description");

  const parsedData = manufacturerSchema.safeParse({ name, description });

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
    // Check for an existing manufacturer with the sanitized name
    const existingManufacturer = await db
      .selectFrom("manufacturer")
      .select("name")
      .where("name", "=", sanitizedName) // Case-insensitive check
      .executeTakeFirst();

    if (existingManufacturer) {
      return { message: "این  تولیدکننده قبلا ذخیره شده است", success: false };
    }

    // Insert sanitized values
    const result = await db
      .insertInto("manufacturer")
      .values({
        name: sanitizedName,
        description: sanitizedDescription,
        updated_at: new Date(),
        created_at: new Date().toISOString(),
      })
      .returningAll()
      .execute();
    revalidatePath("/admin/dashboard/products/add");
    return {
      message: "تولیدکننده با موفقیت ذخیره شد",
      success: true,
      data: result[0],
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "خطای دیتابیس.  تولیدکننده در دیتابیس ذخیره نشد",
      success: false,
      issues: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}
