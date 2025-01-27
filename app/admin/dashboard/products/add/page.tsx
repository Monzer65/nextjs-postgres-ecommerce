import HeaderAdmin from "@/components/admin-header";
import ProductForm from "./form";
import { fetchDropdownData } from "@/lib/admin/data";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AddNewProductPage() {
  const items = [
    { href: "/admin", label: "خانه" },
    { href: "/admin/dashboard", label: "داشبورد" },
    { href: "/admin/dashboard/products", label: "محصولات" },
    { label: "محصول جدید" },
  ];

  const dropdownData = await fetchDropdownData();

  return (
    <>
      <HeaderAdmin items={items} itemsToDisplay={3} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">افزودن محصول جدید</h1>
          <Suspense fallback={<Skeleton />}>
            <ProductForm dropdownData={dropdownData} />
          </Suspense>
        </main>
      </div>
    </>
  );
}
