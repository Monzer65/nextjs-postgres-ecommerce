// app/api/images/[id]route.ts

import { getImagesByProductId } from "@/lib/admin/data";
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    if (!id) {
        return new Response(JSON.stringify({ error: "Product ID is required" }), {
            status: 400,
        });
    }

    const images = await getImagesByProductId(Number(id));
    return Response.json(images);
}
