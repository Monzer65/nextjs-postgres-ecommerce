import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export const productSchema = z.object({
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
  manufacturer_id: z.number().int().nonnegative().nullable(),
  category_id: z.number().int().nonnegative("دسته بندی محصول را انتخاب کنید"),
  discount_id: z.number().int().nonnegative().nullable(),
  warranty_id: z.number().int().nonnegative().nullable(),
  created_at: z.date().optional(), // Optional for new products
  updated_at: z.date().optional(), // Optional for new products
  deleted_at: z.date().nullable().optional(), // Optional for new products
  images: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          `حجم فایل باید کمتر از 5MB باشد.`,
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "فقط فرمت‌های .jpg, .jpeg, .png, .webp و .svg پذیرفته می‌شوند.",
        ),
    )
    .refine(
      (files) => files?.length > 0,
      "حداقل یک تصویر برای محصول الزامی است.",
    )
    .refine(
      (files) => files?.length <= 5,
      "حداکثر 5 تصویر می‌توانید آپلود کنید.",
    ),
});

export type ProductFormData = z.infer<typeof productSchema>;
