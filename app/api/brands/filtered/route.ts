// app/api/brands/filtered/route.ts
import { NextResponse } from "next/server";
import { getFilteredBrands } from "@/lib/admin/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "";
  const brands = await getFilteredBrands(filter);
  return NextResponse.json(brands);
}
