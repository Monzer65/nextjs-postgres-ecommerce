"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/db";
import { brandSchema } from "@/types/zod-schemas/products";

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

  const { name: validatedName, description: validatedDescription } =
    parsedData.data;

  try {
    const result = await db
      .insertInto("brand")
      .values({
        name: validatedName,
        description: validatedDescription,
        updated_at: new Date(),
        created_at: new Date().toISOString(),
      })
      .returningAll()
      .execute();

    return {
      message: "برند با موفقیت ذخیره شد",
      success: true,
      data: result[0],
    };
  } catch (error) {
    console.error("Database Error:", error); // Logs the actual error
    return {
      message: "خطای دیتابیس. برند در دیتابیس ذخیره نشد",
      success: false,
      issues: [error instanceof Error ? error.message : "Unknown error"], // More informative error message
    };
  }
}
