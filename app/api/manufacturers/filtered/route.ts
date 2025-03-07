// app/api/manufacturers/filtered/route.ts
import { type NextRequest } from "next/server";
//import { NextResponse } from "next/server";
import { getFilteredManufacturers } from "@/lib/admin/data";

export async function GET(request: NextRequest) {
  //const { searchParams } = new URL(request.url);
  const searchParams = request.nextUrl.searchParams;
  const filter = searchParams.get("filter") || "";
  if (typeof filter !== "string") {
    return Response.json([]);
  }

  const manufacturers = await getFilteredManufacturers(filter);
  return Response.json(manufacturers);
}
