"use server";

import { db } from "@/db/db";
import { brandSchema } from "@/types/zod-schemas/products";
import { revalidatePath } from "next/cache";

type FormState = {
  message?: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
  data?: any;
};

export async function createNewBrand(
  _prevstate: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get("name");
  const description = formData.get("description");

  const parsedData = brandSchema.safeParse({ name, description });

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
    // Check for an existing brand with the sanitized name
    const existingBrand = await db
      .selectFrom("brand")
      .select("name")
      .where("name", "=", sanitizedName) // Case-insensitive check
      .executeTakeFirst();

    if (existingBrand) {
      return { message: "این برند قبلا ذخیره شده است", success: false };
    }

    // Insert sanitized values
    const result = await db
      .insertInto("brand")
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
      message: "برند با موفقیت ذخیره شد",
      success: true,
      data: result[0],
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "خطای دیتابیس. برند در دیتابیس ذخیره نشد",
      success: false,
      issues: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}
