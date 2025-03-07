// app/api/warranties/route.ts
import { getWarranties } from "@/lib/admin/data";

export async function GET() {
  const warranties = await getWarranties();
  return Response.json(warranties);
}
