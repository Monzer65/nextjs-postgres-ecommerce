// app/api/categories/route.ts
import { getCategories } from "@/lib/admin/data";

export async function GET() {
  const categories = await getCategories();
  return Response.json(categories);
}
