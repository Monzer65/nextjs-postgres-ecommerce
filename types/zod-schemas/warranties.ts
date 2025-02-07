import { z } from "zod";

export const warrantySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "نام ضمانت  ضروری است"),
  description: z.string().nullable(),
  duration: z.number().int().nonnegative("مدت ضمانت باید یک عدد مثبت باشد"),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type WarrantySchemaType = z.infer<typeof warrantySchema>;
