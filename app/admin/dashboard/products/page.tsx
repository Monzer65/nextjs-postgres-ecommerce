import HeaderAdmin from "@/components/admin-header";
import ProductsTable from "./table";

export default function ProductsPage() {
  const items = [
    { href: "/admin", label: "خانه" },
    { href: "/admin/dashboard", label: "داشبورد" },
    { label: "محصولات" },
  ]
  return (
    <>
      <HeaderAdmin items={items} itemsToDisplay={3} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">محصولات</h1>
          <ProductsTable query="" currentPage={1} />
        </main>
      </div>
    </>
  );
}
