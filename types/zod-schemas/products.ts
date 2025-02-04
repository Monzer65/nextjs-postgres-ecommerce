import { nullable, z } from "zod";

// Define a Zod schema for the Product type
export const productSchema = z
  .object({
    id: z.number().optional(), // Optional for new products
    name: z.string().min(1, "نام محصول ضروری است"),
    description: z.string().min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد"),
    price: z.number().positive("قیمت محصول باید یک عدد مثبت باشد"),
    SKU: z.string().min(1, "کد کالا را  وارد کنید"),
    stock: z
      .number()
      .int()
      .nonnegative("موجودی این محصول در انبار باید یک عدد غیر منفی باشد"),
    min_order_quantity: z.number().int().nonnegative().nullable(),
    max_order_quantity: z.number().int().nonnegative().nullable(),
    weight: z.number().nonnegative().nullable(),
    length: z.number().nonnegative().nullable(),
    width: z.number().nonnegative().nullable(),
    height: z.number().nonnegative().nullable(),
    brand_id: z.number().int().nonnegative().nullable(),
    newBrand: z.string().optional(),
    manufacturer_id: z.number().int().nonnegative().nullable(),
    category_id: z.number().int().nonnegative("دسته بندی محصول را انتخاب کنید"),
    discount_id: z.number().int().nonnegative().nullable(),
    warranty_id: z.number().int().nonnegative().nullable(),
    created_at: z.date().optional(), // Optional for new products
    updated_at: z.date().optional(), // Optional for new products
    deleted_at: z.date().nullable().optional(), // Optional for new products
  })
  .refine((data) => !!data.brand_id || !!data.newBrand, {
    message: "Either select a brand or create a new one",
    path: ["brand_id"],
  });

// Infer the type from the Zod schema
export type ProductSchemaType = z.infer<typeof productSchema>;

export const brandSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "نام برند ضروری است"),
  description: z.string().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type BrandSchemaType = z.infer<typeof brandSchema>;
