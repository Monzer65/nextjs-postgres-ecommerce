import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "name should not be less than 3 characters").max(255, "name is too long"),
  description: z.string().optional(),
  parent_id: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string(),
  deleted_at: z.string().optional(),
});

export type CategorySchema = z.infer<typeof categorySchema>;

export const newCategorySchema = categorySchema.omit({ id: true });

export type NewCategorySchema = z.infer<typeof newCategorySchema>;
