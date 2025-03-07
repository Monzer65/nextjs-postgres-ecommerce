import type { Metadata } from "next";
import { getProductById } from "@/lib/admin/data";
import { notFound } from "next/navigation";
//import { ProductEditForm } from "./product-edit-form"
import HeaderAdmin from "@/components/admin-header";
import { ProductEditForm } from "./edit-form";

export const metadata: Metadata = {
  title: "ویرایش محصول",
  description: "ویرایش اطلاعات محصول",
};

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const product = await getProductById(Number(id));

  if (!product) {
    notFound();
  }

  return (
    <>
      <HeaderAdmin
        items={[
          { href: "/admin", label: "خانه" },
          { href: "/admin/dashboard", label: "داشبورد" },
          { href: "/admin/dashboard/products", label: "محصولات" },
          { label: "ویرایش محصول" },
        ]}
        itemsToDisplay={3}
      />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">ویرایش محصول</h1>
          <ProductEditForm product={product} />
        </main>
      </div>
    </>
  );
}
