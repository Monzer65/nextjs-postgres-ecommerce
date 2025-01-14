'use server';

import { object, z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/db/db';

type FormState = {
    message: string;
    success?: boolean;
};

export const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "name should not be less than 3 characters").max(255, "name is too long"),
    description: z.string().min(3,
        "too short"
    ).max(255, "too long"),
    price: z.number().positive("price should be positive"),
    SKU: z.string().min(3, "this field is required; it is too short").max(255, "too long"),
    stock: z.number().positive("stock should be positive"),
    min_order_quantity: z.number().positive("must be positive").optional(),
    max_order_quantity: z.number().positive("must be positive").optional(),
    weight: z.number().positive("must be positive").optional(),
    length: z.number().positive("must be positive").optional(),
    width: z.number().positive("must be positive").optional(),
    height: z.number().positive("must be positive").optional(),
    brand_id: z.number().optional(),
    manufacturer_id: z.number().optional(),
    category_id: z.number({ message: "category id is required" }),
    discount_id: z.number().optional(),
    warranty_id: z.number().optional(),
    created_at: z.string().optional(),
    updated_at: z.string(),
    deleted_at: z.string().optional(),
});

export type FormSchema = z.infer<typeof productSchema>;

const newProductSchema = productSchema.omit({ id: true, brand_id: true, manufacturer_id: true, category_id: true, warranty_id: true, discount_id: true, created_at: true, deleted_at: true });

export type NewProductSchema = z.infer<typeof newProductSchema>;

export async function createNewProduct(
    brandId: number,
    manufacturerId: number,
    categoryId: number,
    discountId: number,
    warrantyId: number,
    _prevstate: FormState,
    formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    console.log("data", data);

    const parsedData = newProductSchema.safeParse(data);
    if (!parsedData.success) {
        return {
            message: 'Missing Fields. Failed to Create Product.',
            success: false,
        };
    }

    const { name, description, price, SKU, stock, min_order_quantity, max_order_quantity, weight, length, width, height } = parsedData.data;


    try {
        await db.insertInto('product').values(
            {
                name, description, price, SKU, stock, min_order_quantity, max_order_quantity, weight, length, width, height, brand_id: brandId, manufacturer_id: manufacturerId, category_id: categoryId, discount_id: discountId, warranty_id: warrantyId, updated_at: new Date()
            }
        ).execute();

    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Product.',
            success: false,
        };
    }

    revalidatePath('/admin/dashboard/products');
    redirect('/admin/dashboard/products');
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

