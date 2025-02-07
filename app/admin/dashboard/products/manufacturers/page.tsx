import HeaderAdmin from "@/components/admin-header";
import { ManufacturerForm } from "./form";

export default async function AddNewCategoryPage() {
  const items = [
    { href: "/admin", label: "خانه" },
    { href: "/admin/dashboard", label: "داشبورد" },
    { href: "/admin/dashboard/products", label: "محصولات" },
    { label: "تولیدکننده جدید" },
  ];

  return (
    <>
      <HeaderAdmin items={items} itemsToDisplay={4} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">افزودن تولیدکنند جدید</h1>
          <ManufacturerForm />
        </main>
      </div>
    </>
  );
}
