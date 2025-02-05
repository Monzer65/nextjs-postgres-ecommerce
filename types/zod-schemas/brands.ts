import { z } from "zod";

export const brandSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "نام برند ضروری است"),
  description: z.string().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type BrandSchemaType = z.infer<typeof brandSchema>;
