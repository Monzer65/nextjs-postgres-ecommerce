// app/api/manufacturers/route.ts
import { getManufacturers } from "@/lib/admin/data";

export async function GET() {
  const manufacturers = await getManufacturers();
  return Response.json(manufacturers);
}
