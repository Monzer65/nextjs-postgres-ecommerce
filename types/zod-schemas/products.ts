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
  featured: z.boolean().nullable(),
  on_sale: z.boolean().nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const productEditSchema = z.object({
  // ID is required for editing
  id: z.number(),

  // Basic product information
  name: z.string().min(1, "نام محصول ضروری است"),
  description: z.string().min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد"),
  thumbnail: z.string().nullable(),

  // Pricing and inventory
  price: z.number().positive("قیمت محصول باید یک عدد مثبت باشد"),
  sku: z.string().min(1, "کد کالا را وارد کنید"),
  stock: z
    .number()
    .int()
    .nonnegative("موجودی این محصول در انبار باید یک عدد غیر منفی باشد"),

  // Order limits
  min_order_quantity: z.number().int().nonnegative().nullable().optional(),
  max_order_quantity: z.number().int().nonnegative().nullable().optional(),

  // Physical dimensions
  weight: z.number().nonnegative().nullable().optional(),
  length: z.number().nonnegative().nullable().optional(),
  width: z.number().nonnegative().nullable().optional(),
  height: z.number().nonnegative().nullable().optional(),

  // Relationships
  brand_id: z.number().int().nonnegative().nullable().optional(),
  manufacturer_id: z.number().int().nonnegative().nullable().optional(),
  category_id: z
    .number({ message: "دسته بندی محصول را انتخاب کنید" })
    .int()
    .nonnegative("دسته بندی محصول انتخاب شده نباید منفی باشد"),
  discount_id: z.number().int().nonnegative().nullable().optional(),
  warranty_id: z.number().int().nonnegative().nullable().optional(),

  // Timestamps are handled automatically on the server
  updated_at: z.date().optional(),

  // Product images
  images: z
    .array(z.string().url("آدرس تصویر معتبر نیست"))
    .min(1, "حداقل یک تصویر الزامی است"),

  // Product flags
  featured: z.boolean().nullable().optional().default(false),
  on_sale: z.boolean().nullable().optional().default(false),
});

export type ProductEditFormData = z.infer<typeof productEditSchema>;

// Helper function to prepare form data from API response
export function prepareProductEditData(product: any): ProductEditFormData {
  return {
    id: product.id,
    name: product.name || "",
    description: product.description || "",
    thumbnail: product.thumbnail || null,
    price: product.price || 0,
    sku: product.sku || "",
    stock: product.stock || 0,
    min_order_quantity: product.min_order_quantity || null,
    max_order_quantity: product.max_order_quantity || null,
    weight: product.weight || null,
    length: product.length || null,
    width: product.width || null,
    height: product.height || null,
    brand_id: product.brand_id || null,
    manufacturer_id: product.manufacturer_id || null,
    category_id: product.category_id || 0,
    discount_id: product.discount_id || null,
    warranty_id: product.warranty_id || null,
    updated_at: product.updated_at ? new Date(product.updated_at) : undefined,
    images: product.images || [],
    featured: product.featured || false,
    on_sale: product.on_sale || false,
  };
}
