import { z } from "zod";
export const categorySchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(3, "نام باید بیش از 3 کاراکتر باشد")
    .max(255, "نام طولانی است"),
  description: z.string().optional(),
  parent_id: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CategorySchema = z.infer<typeof categorySchema>;

export const newCategorySchema = categorySchema.omit({ id: true });

export type NewCategorySchema = z.infer<typeof newCategorySchema>;

// New schema for updating a category (all fields optional except `id`)
export const updateCategorySchema = categorySchema
  .partial()
  .required({ id: true });

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
