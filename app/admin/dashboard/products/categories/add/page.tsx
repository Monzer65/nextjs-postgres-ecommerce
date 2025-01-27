import HeaderAdmin from "@/components/admin-header";
import CategoryForm from "./form";

export default async function AddNewCategoryPage() {
  const items = [
    { href: "/admin", label: "خانه" },
    { href: "/admin/dashboard", label: "داشبورد" },
    { href: "/admin/dashboard/products", label: "محصولات" },
    { href: "/admin/dashboard/products/categories", label: "دسته‌بندی‌ها" },
    { label: "دسته‌بندی جدید" },
  ];

  //   const dropdownData = await fetchDropdownData();
  const dropdownData = { name: "sample data" };
  return (
    <>
      <HeaderAdmin items={items} itemsToDisplay={4} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">افزودن دسته بندی جدید</h1>
          <CategoryForm dropdownData={dropdownData} />
        </main>
      </div>
    </>
  );
}
