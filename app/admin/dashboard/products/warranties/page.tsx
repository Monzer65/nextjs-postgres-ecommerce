import HeaderAdmin from "@/components/admin-header";
import { WarrantyForm } from "./form";

export default async function AddNewWarrantyPage() {
  const items = [
    { href: "/admin", label: "خانه" },
    { href: "/admin/dashboard", label: "داشبورد" },
    { href: "/admin/dashboard/products", label: "محصولات" },
    { label: "ضمانت جدید" },
  ];

  return (
    <>
      <HeaderAdmin items={items} itemsToDisplay={4} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">افزودن ضمانت جدید</h1>
          <WarrantyForm />
        </main>
      </div>
    </>
  );
}
