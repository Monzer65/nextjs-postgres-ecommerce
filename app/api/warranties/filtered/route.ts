// app/api/manufacturers/filtered/route.ts
import { getFilteredWarranties } from "@/lib/admin/data";
import { type NextRequest } from "next/server";
//import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  //const { searchParams } = new URL(request.url);
  const searchParams = request.nextUrl.searchParams;
  const filter = searchParams.get("filter") || "";

  if (typeof filter !== "string") {
    return Response.json([]);
  }

  const warranties = await getFilteredWarranties(filter);
  return Response.json(warranties);
}
