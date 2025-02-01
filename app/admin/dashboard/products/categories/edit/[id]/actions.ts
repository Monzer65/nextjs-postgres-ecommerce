"use server";

import { db } from "@/db/db";
import { updateCategorySchema } from "@/types/zod-schemas/categories";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
};

export async function updateCategoryAction(
  id: string,
  _prevstate: FormState,
  formData: FormData,
): Promise<FormState> {
  //const data = Object.fromEntries(formData.entries());
  //console.log("Form Data", data);

  const name = formData.get("name")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? null;
  const parent_id = formData.get("parent_id")
    ? parseInt(formData.get("parent_id") as string, 10)
    : undefined;

  const fields: Record<string, string> = {
    name,
    description: description ?? "",
    parent_id: parent_id?.toString() ?? "",
  };

  const parsedData = updateCategorySchema.safeParse({
    id: Number(id),
    name,
    description,
    parent_id,
  });
  console.log("Parsed Data", parsedData);

  if (!parsedData.success) {
    return {
      message: "unexpected data types",
      fields,
      issues: parsedData.error.issues.map((issue) => issue.message),
      success: false,
    };
  }
  try {
    const { name, description, parent_id } = parsedData.data;
    await db
      .updateTable("category")
      .set({
        name,
        description,
        parent_id: parent_id ?? null,
        updated_at: new Date(),
      })
      .where("id", "=", Number(id))
      .executeTakeFirst();
  } catch (error) {
    console.error("Error inserting category:", error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  revalidatePath("/admin/dashboard/products/categories");
  redirect("/admin/dashboard/products/categories");
}
