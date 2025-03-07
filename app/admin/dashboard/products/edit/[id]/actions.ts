"use server";

import { db } from "@/db/db";
import { productEditSchema } from "@/types/zod-schemas/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
};

export async function updateProductAction(
  _prevstate: FormState,
  formData: FormData,
): Promise<FormState> {
  const convertToNumberOrNull = (
    value: FormDataEntryValue | null,
  ): number | null => {
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  const data = {
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    thumbnail: formData.get("thumbnail"),
    price: convertToNumberOrNull(formData.get("price")),
    sku: formData.get("sku"),
    stock: convertToNumberOrNull(formData.get("stock")),
    min_order_quantity: convertToNumberOrNull(
      formData.get("min_order_quantity"),
    ),
    max_order_quantity: convertToNumberOrNull(
      formData.get("max_order_quantity"),
    ),
    weight: convertToNumberOrNull(formData.get("weight")),
    length: convertToNumberOrNull(formData.get("length")),
    width: convertToNumberOrNull(formData.get("width")),
    height: convertToNumberOrNull(formData.get("height")),
    brand_id: convertToNumberOrNull(formData.get("brand_id")),
    manufacturer_id: convertToNumberOrNull(formData.get("manufacturer_id")),
    category_id: convertToNumberOrNull(formData.get("category_id")),
    discount_id: convertToNumberOrNull(formData.get("discount_id")),
    warranty_id: convertToNumberOrNull(formData.get("warranty_id")),
    images: formData.getAll("images"),
    featured: formData.get("featured"),
    on_sale: formData.get("on_sale"),
  };
  // Parse with Zod schema (ensure coercion is enabled)
  const parsedData = productEditSchema.safeParse(data);
  console.log("server parsed data", parsedData.data);
  if (!parsedData.success) {
    console.error("Validation errors:", parsedData.error.flatten().fieldErrors);
    return {
      message: "Validation failed",
      issues: parsedData.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const {
    id,
    name,
    description,
    thumbnail,
    price,
    sku,
    stock,
    min_order_quantity,
    max_order_quantity,
    weight,
    length,
    width,
    height,
    brand_id,
    manufacturer_id,
    category_id,
    discount_id,
    warranty_id,
    images: parsedImages,
    featured,
    on_sale,
  } = parsedData.data;

  try {
    const product = await db
      .updateTable("product")
      .set({
        name,
        description,
        thumbnail,
        price,
        sku,
        stock,
        min_order_quantity,
        max_order_quantity,
        weight,
        length,
        width,
        height,
        featured: featured ?? false,
        on_sale: on_sale ?? false,
        brand_id,
        manufacturer_id,
        category_id,
        discount_id,
        warranty_id,
        updated_at: new Date(),
      })
      .where("id", "=", Number(id))
      .executeTakeFirst();

    if (product) {
      for (const [index, image] of parsedImages.entries()) {
        await db
          .updateTable("product_image")
          .set({
            url: image,
            alt_text: `Image of ${name}`,
            is_primary: index === 0,
            order: index,
            updated_at: new Date(),
          })
          .where("product_id", "=", id) // Assuming `product_id` is the foreign key
          .where("order", "=", index) // Update the row with the matching `order`
          .execute();
      }
    }
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Product.",
      success: false,
    };
  }

  revalidatePath("/admin/dashboard/products");
  redirect("/admin/dashboard/products");
}
