import { z } from "zod";

export const manufacturerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "نام  تولید کننده ضروری است"),
  description: z.string().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type ManufacturerSchemaType = z.infer<typeof manufacturerSchema>;
