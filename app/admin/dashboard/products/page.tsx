import { Suspense } from "react";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";

import HeaderAdmin from "@/components/admin-header";
import ProductsTable from "./table";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductFilter } from "@/types/product-types";
import { Separator } from "@/components/ui/separator";
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
    sortBy?: string;
    sortOrder?: string;
    inStock?: string;
    hasDiscount?: string;
    isFeatured?: string;
    onSale?: string;
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
    sortBy: searchParams.sortBy as
      | "price"
      | "rating"
      | "created_at"
      | "name"
      | undefined,
    sortOrder: searchParams.sortOrder as "asc" | "desc" | undefined,
    inStock: searchParams.inStock === "true",
    hasDiscount: searchParams.hasDiscount === "true",
    isFeatured: searchParams.isFeatured === "true",
    onSale: searchParams.onSale === "true",
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <HeaderAdmin items={items} itemsToDisplay={4} />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

          <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end md:items-center">
                {/* Mobile filters */}
                <div className="md:hidden">
                  <ProductFiltersComponent variant="mobile" />
                </div>

                <div className="w-full">
                  <Search placeholder="جستجوی محصولات..." className="w-full" />
                </div>
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
            {/* Sidebar filters for desktop */}
            <div className="hidden md:block">
              <div className="bg-card rounded-lg border shadow-sm p-4 sticky top-6">
                <h2 className="font-medium mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  فیلترهای پیشرفته
                </h2>
                <Separator className="mb-4" />
                <ProductFiltersComponent variant="sidebar" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
