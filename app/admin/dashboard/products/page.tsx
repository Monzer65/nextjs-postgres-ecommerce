// page.tsx
import HeaderAdmin from "@/components/admin-header";
import ProductsTable from "./table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Search from "@/components/search";
import { ProductFilter } from "@/types/product-types";
import ProductFiltersComponent from "./filters";

export default async function ProductsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    categoryId?: string;
    brandId?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    hasReviews?: string;
    isFeatured?: string;
    onSale?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const items = [
    { href: "/admin", label: "خانه" },
    { href: "/admin/dashboard", label: "داشبورد" },
    { label: "محصولات" },
  ];

  const searchParams = (await props.searchParams) || {};
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 10;
  const filter: ProductFilter = {
    query: searchParams.query,
    categoryId: searchParams.categoryId
      ? Number(searchParams.categoryId)
      : undefined,
    brandId: searchParams.brandId ? Number(searchParams.brandId) : undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    minRating: searchParams.minRating
      ? Number(searchParams.minRating)
      : undefined,
    hasReviews: searchParams.hasReviews === "true",
    //isFeatured: searchParams.isFeatured === "true",
    //onSale: searchParams.onSale === "true",
    sortBy: searchParams.sortBy as
      | "price"
      | "rating"
      | "created_at"
      | "name"
      | undefined,
    sortOrder: searchParams.sortOrder as "asc" | "desc" | undefined,
  };

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
          <div className="flex gap-4 last:flex-1">
            <ProductFiltersComponent />

            <Search placeholder="جستجوی محصولات..." />
          </div>
          <Suspense
            key={searchParams?.query || "" + currentPage}
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-lg" />
                <Skeleton className="mx-auto h-10 w-[300px] rounded-lg" />
              </div>
            }
          >
            <ProductsTable
              filter={filter}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
