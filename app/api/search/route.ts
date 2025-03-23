// pages/api/search.ts

import { getSearchResults } from "@/lib/shop/data";
import { type NextRequest } from "next/server";
//
//const mockData = [
//  { id: "1", name: "Smartphone", category: "Electronics", image: "/phone.svg" },
//  {
//    id: "2",
//    name: "Headphones",
//    category: "Accessories",
//    image: "/headphone.svg",
//  },
//  // Add more mock items here...
//];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");

  if (typeof q !== "string") {
    return Response.json([]);
  }

  const results = await getSearchResults({ q });

  return Response.json(results);
}
