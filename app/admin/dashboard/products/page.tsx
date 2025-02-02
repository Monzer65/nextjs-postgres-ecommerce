import HeaderAdmin from "@/components/admin-header";
import ProductsTable from "./table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductsPage() {
  const items = [
    { href: "/admin", label: "خانه" },
    { href: "/admin/dashboard", label: "داشبورد" },
    { label: "محصولات" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderAdmin items={items} itemsToDisplay={4} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">محصولات</h1>
            <Link href="/admin/dashboard/products/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> افزودن محصول جدید{" "}
              </Button>
            </Link>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <ProductsTable query={""} currentPage={1} />
          </div>
        </main>
      </div>
    </div>
  );
}
