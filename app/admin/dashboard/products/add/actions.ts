"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/db";
import { productSchema } from "@/types/zod-schemas/products";

type FormState = {
  message?: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
  data?: any;
};

export async function createNewProduct(
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
    name: formData.get("name"),
    description: formData.get("description"),
    price: convertToNumberOrNull(formData.get("price")),
    SKU: formData.get("SKU"),
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
  };
  // Parse with Zod schema (ensure coercion is enabled)
  const parsedData = productSchema.safeParse(data);
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
    name,
    description,
    price,
    SKU,
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
  } = parsedData.data;
  return { message: "successfull" };
  //try {
  //  await db
  //    .insertInto("product")
  //    .values({
  //      name,
  //      description,
  //      price,
  //      SKU,
  //      stock,
  //      min_order_quantity,
  //      max_order_quantity,
  //      weight,
  //      length,
  //      width,
  //      height,
  //      brand_id: brand_id ?? null,
  //      manufacturer_id: manufacturer_id ?? null,
  //      category_id,
  //      discount_id: discount_id ?? null,
  //      warranty_id: warranty_id ?? null,
  //      updated_at: new Date(),
  //      created_at: new Date().toISOString(),
  //      deleted_at: null,
  //    })
  //    .execute();
  //} catch (error) {
  //  return {
  //    message: "Database Error: Failed to Create Product.",
  //    success: false,
  //  };
  //}
  //
  //revalidatePath("/admin/dashboard/products");
  //redirect("/admin/dashboard/products");
}

// export type State = {
//   errors?: {
//     customerId?: string[];
//     amount?: string[];
//     status?: string[];
//   };
//   message?: string | null;
// };

// export async function createProduct(prevState: State, formData: FormData) {
//   // Validate form fields using Zod
//   const validatedFields = CreateProduct.safeParse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

//   // If form validation fails, return errors early. Otherwise, continue.
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create Product.',
//     };
//   }

//   // Prepare data for insertion into the database
//   const { customerId, amount, status } = validatedFields.data;
//   const amountInCents = amount * 100;
//   const date = new Date().toISOString().split('T')[0];

//   // Insert data into the database
//   try {
//     await sql`
//       INSERT INTO products (customer_id, amount, status, date)
//       VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
//     `;
//   } catch (error) {
//     // If a database error occurs, return a more specific error.
//     return {
//       message: 'Database Error: Failed to Create Product.',
//     };
//   }

//   // Revalidate the cache for the products page and redirect the user.
//   revalidatePath('/dashboard/products');
//   redirect('/dashboard/products');
// }

// export async function updateProduct(
//   id: string,
//   prevState: State,
//   formData: FormData,
// ) {
//   const validatedFields = UpdateProduct.safeParse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Update Product.',
//     };
//   }

//   const { customerId, amount, status } = validatedFields.data;
//   const amountInCents = amount * 100;

//   try {
//     await sql`
//       UPDATE products
//       SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
//       WHERE id = ${id}
//     `;
//   } catch (error) {
//     return { message: 'Database Error: Failed to Update Product.' };
//   }

//   revalidatePath('/dashboard/products');
//   redirect('/dashboard/products');
// }

// export async function deleteProduct(id: string) {
//   await sql`DELETE FROM products WHERE id = ${id}`;
//   revalidatePath('/dashboard/products');
// }
