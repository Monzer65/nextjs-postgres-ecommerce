"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/db";
import { newProductSchema } from "@/types/zod-schemas/products";

type FormState = {
  message?: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
};

export async function createNewProduct(
  _prevstate: FormState,
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData.entries());
  console.log("Form Data", data);

  const fields: Record<string, string> = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, value.toString()])
  );

  const parsedData = newProductSchema.safeParse(data);
  console.log("Parsed Data", parsedData);

  if (!parsedData.success) {
    return {
      message: "Missing Fields. Failed to Create Product.",
      fields,
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
  } = parsedData.data;

  try {
    await db
      .insertInto("product")
      .values({
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
        brand_id: brand_id ?? null,
        manufacturer_id: manufacturer_id ?? null,
        category_id,
        discount_id: discount_id ?? null,
        warranty_id: warranty_id ?? null,
        updated_at: new Date(),
        created_at: new Date().toISOString(),
        deleted_at: null,
      })
      .execute();
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Product.",
      success: false,
    };
  }

  revalidatePath("/admin/dashboard/products");
  redirect("/admin/dashboard/products");
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
