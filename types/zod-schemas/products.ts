import { z } from "zod";

export const productSchema = z.object({
  id: z.number().optional(), // Optional for new products
  name: z.string().min(1, "نام محصول ضروری است"),
  description: z.string().min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد"),
  thumbnail: z.string().nullable(),
  price: z.number().positive("قیمت محصول باید یک عدد مثبت باشد"),
  sku: z.string().min(1, "کد کالا را  وارد کنید"),
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
  manufacturer_id: z.number().int().nonnegative().nullable(),
  category_id: z
    .number({ message: "دسته بندی محصول را انتخاب کنید" })
    .int()
    .nonnegative("دسته بندی محصول انتخاب شده نباید منفی باشد"),

  discount_id: z.number().int().nonnegative().nullable(),
  warranty_id: z.number().int().nonnegative().nullable(),
  created_at: z.date().optional(), // Optional for new products
  updated_at: z.date().optional(), // Optional for new products
  deleted_at: z.date().nullable().optional(), // Optional for new products

  images: z
    .array(z.string().url("آدرس تصویر معتبر نیست"))
    .min(1, "حداقل یک تصویر الزامی است"),
});

export type ProductFormData = z.infer<typeof productSchema>;
