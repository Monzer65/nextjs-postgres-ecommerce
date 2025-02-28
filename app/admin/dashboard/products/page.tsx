// page.tsx
import HeaderAdmin from "@/components/admin-header";
import ProductsTable from "./table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Search from "@/components/search";

export default async function ProductsPage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const items = [
    { href: "/admin", label: "خانه" },
    { href: "/admin/dashboard", label: "داشبورد" },
    { label: "محصولات" },
  ];

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderAdmin items={items} itemsToDisplay={4} />

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                مدیریت محصولات
              </h1>
              <p className="mt-1 text-muted-foreground">
                مشاهده، ویرایش و مدیریت محصولات فروشگاه
              </p>
            </div>

            <Link
              href="/admin/dashboard/products/add"
              className="sm:w-auto w-full"
            >
              <Button className="w-full sm:w-auto gap-1">
                <Plus className="h-4 w-4" />
                افزودن محصول جدید
              </Button>
            </Link>
          </div>
          <Search placeholder="جستجوی محصولات..." />
          <Suspense
            key={query + currentPage}
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-lg" />
                <Skeleton className="mx-auto h-10 w-[300px] rounded-lg" />
              </div>
            }
          >
            <ProductsTable query={query} currentPage={currentPage} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
