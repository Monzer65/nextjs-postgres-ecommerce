// app/api/categories/route.ts
import { getBrands } from "@/lib/admin/data";

export async function GET() {
  const brands = await getBrands();
  return Response.json(brands);
}
