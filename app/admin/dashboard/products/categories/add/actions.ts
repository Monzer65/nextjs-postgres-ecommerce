"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/db";
import { newCategorySchema } from "@/types/zod-schemas/categories";
type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
};

export async function createNewCategoryAction(
  _prevstate: FormState,
  formData: FormData,
): Promise<FormState> {
  const data = Object.fromEntries(formData.entries());
  console.log("Form Data", data);

  const fields: Record<string, string> = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, value.toString()]),
  );
  const parsedData = newCategorySchema.safeParse(data);
  console.log("Parsed Data", parsedData);

  if (!parsedData.success) {
    return {
      message: "Missing Fields. Failed to Create Product.",
      fields,
      issues: parsedData.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  try {
    const { name, description, parent_id } = parsedData.data;
    await db
      .insertInto("category")
      .values({
        name,
        description: description ?? null,
        parent_id: parent_id ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date(),
        deleted_at: null,
      })
      .execute();
  } catch (error) {
    console.error("Error inserting category:", error);
    return { success: false, message: "something went wrong" };
  }

  revalidatePath("/admin/dashboard/products/categories");
  redirect("/admin/dashboard/products/categories");
}
