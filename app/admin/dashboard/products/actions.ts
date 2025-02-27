"use server";

import { db } from "@/db/db";
import { revalidatePath } from "next/cache";

interface FormState {
    message?: string | null;
    error?: string | null;
}

export async function deleteProduct(id: number, _state: FormState) {
    const result = await db
        .deleteFrom("product")
        .where("id", "=", id)
        .executeTakeFirst();

    // Check if any rows were affected
    if (Number(result.numDeletedRows) === 0) {
        return {
            error: "محصول مورد نظر یافت نشد یا قبلاً حذف شده است",
            message: null,
        };
    }

    revalidatePath("/admin/dashboard/products");
    return {
        message: "محصول با موفقیت حذف شد",
        error: null,
    };
}
