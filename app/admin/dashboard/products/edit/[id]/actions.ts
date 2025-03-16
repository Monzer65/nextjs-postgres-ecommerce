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
    if (value === null || value === "") return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  // Parse images data
  const rawImages = formData.get("images");
  let parsedImages = [];

  try {
    parsedImages = rawImages ? JSON.parse(rawImages.toString()) : [];
  } catch (error) {
    console.error("Failed to parse images:", error);
    return {
      message: "Invalid image data format",
      success: false,
    };
  }

  // Prepare data for validation
  const data = {
    id: Number(formData.get("id")),
    name: formData.get("name")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    thumbnail: formData.get("thumbnail")?.toString() || "",
    price: convertToNumberOrNull(formData.get("price")),
    sku: formData.get("sku")?.toString() || "",
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
    images: parsedImages,
    featured: formData.get("featured") === "true",
    on_sale: formData.get("on_sale") === "true",
  };

  // Validate with Zod schema
  const parsedData = productEditSchema.safeParse(data);

  if (!parsedData.success) {
    console.error("Validation errors:", parsedData.error.flatten().fieldErrors);
    return {
      message: "Validation failed",
      issues: parsedData.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  // Extract validated data
  const validatedData = parsedData.data;
  const productId = validatedData.id;

  try {
    // Start a transaction for atomicity
    await db.transaction().execute(async (trx) => {
      // 1. Update the product
      await trx
        .updateTable("product")
        .set({
          name: validatedData.name,
          description: validatedData.description,
          thumbnail: validatedData.thumbnail,
          price: validatedData.price,
          sku: validatedData.sku,
          stock: validatedData.stock,
          min_order_quantity: validatedData.min_order_quantity,
          max_order_quantity: validatedData.max_order_quantity,
          weight: validatedData.weight,
          length: validatedData.length,
          width: validatedData.width,
          height: validatedData.height,
          featured: validatedData.featured as boolean,
          on_sale: validatedData.on_sale as boolean,
          brand_id: validatedData.brand_id,
          manufacturer_id: validatedData.manufacturer_id,
          category_id: validatedData.category_id,
          discount_id: validatedData.discount_id,
          warranty_id: validatedData.warranty_id,
          updated_at: new Date(),
        })
        .where("id", "=", productId)
        .execute();

      // 2. Handle images - more complex logic needed

      // First, get existing images to compare
      const existingImages = await trx
        .selectFrom("product_image")
        .select(["id", "order", "is_primary"])
        .where("product_id", "=", productId)
        .execute();

      // Process each image from the form
      for (const [index, image] of validatedData.images.entries()) {
        if (image.type === "existing") {
          // Update existing image
          if (image.id) {
            await trx
              .updateTable("product_image")
              .set({
                url: image.url,
                alt_text: image.alt_text || `Image of ${validatedData.name}`,
                is_primary: image.is_primary,
                order: index,
                updated_at: new Date(),
              })
              .where("id", "=", image.id)
              .execute();
          }
        } else if (image.type === "upload") {
          // Insert new image
          await trx
            .insertInto("product_image")
            .values({
              product_id: productId,
              url: image.url,
              alt_text: image.alt_text || `Image of ${validatedData.name}`,
              is_primary: image.is_primary,
              order: index,
              created_at: new Date().toISOString(),
              updated_at: new Date(),
            })
            .execute();
        }
      }

      // Find images to delete (images in DB but not in the form submission)
      const formImageIds = validatedData.images
        .filter((img) => img.type === "existing" && img.id)
        .map((img) => img.id);

      const imagesToDelete = existingImages.filter(
        (img) => !formImageIds.includes(img.id),
      );

      // Delete removed images
      if (imagesToDelete.length > 0) {
        await trx
          .deleteFrom("product_image")
          .where(
            "id",
            "in",
            imagesToDelete.map((img) => img.id),
          )
          .execute();

        // Here you might want to add code to delete the actual image files
        // from your storage service (Cloudinary, S3, etc.)
      }
    });
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: `Database Error: Failed to Update Product. ${error instanceof Error ? error.message : ""}`,
      success: false,
    };
  }

  // Success! Revalidate and redirect
  revalidatePath("/admin/dashboard/products");
  redirect("/admin/dashboard/products");
}

//"use server";
//
//import { db } from "@/db/db";
//import { productEditSchema } from "@/types/zod-schemas/products";
//import { revalidatePath } from "next/cache";
//import { redirect } from "next/navigation";
//
//type FormState = {
//  message: string;
//  fields?: Record<string, string>;
//  issues?: string[];
//  success?: boolean;
//};
//
//export async function updateProductAction(
//  _prevstate: FormState,
//  formData: FormData,
//): Promise<FormState> {
//  const convertToNumberOrNull = (
//    value: FormDataEntryValue | null,
//  ): number | null => {
//    const num = Number(value);
//    return isNaN(num) ? null : num;
//  };
//  const rawImages = formData.get("images");
//  let parsedImages = [];
//
//  try {
//    parsedImages = rawImages ? JSON.parse(rawImages.toString()) : [];
//  } catch (error) {
//    console.error("Failed to parse images:", error);
//    return {
//      message: "Invalid image data format",
//      success: false,
//    };
//  }
//  const data = {
//    id: Number(formData.get("id")),
//    name: formData.get("name"),
//    description: formData.get("description"),
//    thumbnail: formData.get("thumbnail"),
//    price: convertToNumberOrNull(formData.get("price")),
//    sku: formData.get("sku"),
//    stock: convertToNumberOrNull(formData.get("stock")),
//    min_order_quantity: convertToNumberOrNull(
//      formData.get("min_order_quantity"),
//    ),
//    max_order_quantity: convertToNumberOrNull(
//      formData.get("max_order_quantity"),
//    ),
//    weight: convertToNumberOrNull(formData.get("weight")),
//    length: convertToNumberOrNull(formData.get("length")),
//    width: convertToNumberOrNull(formData.get("width")),
//    height: convertToNumberOrNull(formData.get("height")),
//    brand_id: convertToNumberOrNull(formData.get("brand_id")),
//    manufacturer_id: convertToNumberOrNull(formData.get("manufacturer_id")),
//    category_id: convertToNumberOrNull(formData.get("category_id")),
//    discount_id: convertToNumberOrNull(formData.get("discount_id")),
//    warranty_id: convertToNumberOrNull(formData.get("warranty_id")),
//    images: parsedImages, // Use safely parsed images
//    featured: formData.get("featured") === "true",
//    on_sale: formData.get("on_sale") === "true",
//  };
//
//  // Parse with Zod schema (ensure coercion is enabled)
//  const parsedData = productEditSchema.safeParse(data);
//  console.log("server parsed data", parsedData.data);
//  if (!parsedData.success) {
//    console.error("Validation errors:", parsedData.error.flatten().fieldErrors);
//    return {
//      message: "Validation failed",
//      issues: parsedData.error.issues.map((issue) => issue.message),
//      success: false,
//    };
//  }
//
//  try {
//    const product = await db
//      .updateTable("product")
//      .set({
//        name,
//        description,
//        thumbnail,
//        price,
//        sku,
//        stock,
//        min_order_quantity,
//        max_order_quantity,
//        weight,
//        length,
//        width,
//        height,
//        featured: featured ?? false,
//        on_sale: on_sale ?? false,
//        brand_id,
//        manufacturer_id,
//        category_id,
//        discount_id,
//        warranty_id,
//        updated_at: new Date(),
//      })
//      .where("id", "=", Number(id))
//      .executeTakeFirst();
//
//    if (product) {
//      for (const [index, image] of parsedImages.entries()) {
//        await db
//          .updateTable("product_image")
//          .set({
//            url: image,
//            alt_text: `Image of ${name}`,
//            is_primary: index === 0,
//            order: index,
//            updated_at: new Date(),
//          })
//          .where("product_id", "=", id) // Assuming `product_id` is the foreign key
//          .where("order", "=", index) // Update the row with the matching `order`
//          .execute();
//      }
//    }
//  } catch (error) {
//    console.error("Database Error:", error);
//    return {
//      message: "Database Error: Failed to Create Product.",
//      success: false,
//    };
//  }
//
//  revalidatePath("/admin/dashboard/products");
//  redirect("/admin/dashboard/products");
//}
