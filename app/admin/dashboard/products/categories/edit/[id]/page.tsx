import { notFound } from "next/navigation";
import { Metadata } from "next";
import EditCategoryForm from "./edit-form";
import { getCategories, getCategoryById } from "@/lib/admin/data";
import HeaderAdmin from "@/components/admin-header";

export const metadata: Metadata = {
  title: "Edit Invoice",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [category, categories] = await Promise.all([
    getCategoryById(id),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const items = [
    { href: "/admin", label: "خانه" },
    { href: "/admin/dashboard", label: "داشبورد" },
    { href: "/admin/dashboard/products", label: "محصولات" },
    { href: "/admin/dashboard/products/categories", label: "دسته‌بندی‌ها" },
    { label: `ویرایش دسته بندی ${category.id}` },
  ];

  return (
    <main>
      <HeaderAdmin items={items} itemsToDisplay={4} />
      <EditCategoryForm category={category} categories={categories} />
    </main>
  );
}
