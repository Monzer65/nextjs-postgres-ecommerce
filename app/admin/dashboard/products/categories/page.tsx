import HeaderAdmin from "@/components/admin-header";

export default function CategoriesPage() {
  const items = [
    { href: "/admin", label: "خانه" },
    { href: "/admin/dashboard", label: "داشبورد" },
    { href: "/admin/dashboard/products", label: "محصولات" },
    { label: "دسته‌بندی‌ها" },
  ];
  return (
    <>
      <HeaderAdmin items={items} itemsToDisplay={4} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">دسته‌بندی‌ها</h1>
          {/* <ProductsTable query="" currentPage={1} /> */}
        </main>
      </div>
    </>
  );
}
