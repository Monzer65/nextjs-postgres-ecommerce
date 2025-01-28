import HeaderAdmin from "@/components/admin-header";
import { getCategories } from "@/lib/admin/data";
import { CategoriesTable } from "./categories-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CategoriesPage() {
  const items = [
    { href: "/admin", label: "خانه" },
    { href: "/admin/dashboard", label: "داشبورد" },
    { href: "/admin/dashboard/products", label: "محصولات" },
    { label: "دسته‌بندی‌ها" },
  ];

  const categories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderAdmin items={items} itemsToDisplay={4} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">دسته‌بندی‌ها</h1>
            <Link href="/admin/dashboard/products/categories/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> افزودن دسته‌بندی جدید
              </Button>
            </Link>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <CategoriesTable categories={categories} />
          </div>
        </main>
      </div>
    </div>
  );
}
