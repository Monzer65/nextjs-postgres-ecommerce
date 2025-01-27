import { z } from "zod";

export const productSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, "name should not be less than 3 characters")
    .max(255, "name is too long"),
  description: z.string().min(3, "too short").max(255, "too long"),
  price: z.number().positive("price should be positive"),
  SKU: z
    .string()
    .min(3, "this field is required; it is too short")
    .max(255, "too long"),
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

export type ProductSchema = z.infer<typeof productSchema>;

export const newProductSchema = productSchema.omit({ id: true });

export type NewProductSchema = z.infer<typeof newProductSchema>;
