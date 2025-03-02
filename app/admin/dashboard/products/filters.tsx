"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Brand, Category } from "@/db/schema";
import { getBrands, getFilteredBrands } from "@/lib/admin/data";

export default function ProductFiltersComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Get current filter values from URL
  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentBrandId = searchParams.get("brandId") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentMinRating = searchParams.get("minRating") || "";
  const currentHasReviews = searchParams.get("hasReviews") === "true";
  const currentSortBy = searchParams.get("sortBy") || "";
  const currentSortOrder = searchParams.get("sortOrder") || "";
  const currentInStock = searchParams.get("inStock") === "true";
  const currentHasDiscount = searchParams.get("hasDiscount") === "true";
  const currentIsFeatured = searchParams.get("isFeatured") === "true";
  const currentOnSale = searchParams.get("onSale") === "true";

  // Local state for form values
  const [filters, setFilters] = useState({
    categoryId: currentCategoryId,
    brandId: currentBrandId,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    minRating: currentMinRating,
    hasReviews: currentHasReviews,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
    inStock: currentInStock,
    hasDiscount: currentHasDiscount,
    isFeatured: currentIsFeatured,
    onSale: currentOnSale,
  });

  // Count active filters
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    // Handle boolean filters
    if (
      key === "hasReviews" ||
      key === "inStock" ||
      key === "hasDiscount" ||
      key === "isFeatured" ||
      key === "onSale"
    ) {
      return value === true;
    }
    // Handle string/number filters (non-empty)
    return value !== "" && value !== undefined;
  }).length;

  // Create query string from filters
  const createQueryString = useCallback(
    (params: Record<string, string | undefined | null | boolean>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      // Handle pagination reset when filters change
      newParams.delete("page");

      Object.entries(params).forEach(([name, value]) => {
        if (value === undefined || value === null || value === "") {
          newParams.delete(name);
        } else {
          newParams.set(name, String(value));
        }
      });

      return newParams.toString();
    },
    [searchParams],
  );

  // Apply filters
  const applyFilters = () => {
    const queryString = createQueryString({
      categoryId: filters.categoryId || null,
      brandId: filters.brandId || null,
      minPrice: filters.minPrice || null,
      maxPrice: filters.maxPrice || null,
      minRating: filters.minRating || null,
      hasReviews: filters.hasReviews || null,
      sortBy: filters.sortBy || null,
      sortOrder: filters.sortOrder || null,
      inStock: filters.inStock || null,
      hasDiscount: filters.hasDiscount || null,
      isFeatured: filters.isFeatured || null,
      onSale: filters.onSale || null,
    });

    router.push(`${pathname}?${queryString}`);
    setIsOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      categoryId: "",
      brandId: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      hasReviews: false,
      sortBy: "",
      sortOrder: "",
      inStock: false,
      hasDiscount: false,
      isFeatured: false,
      onSale: false,
    });
  };

  // Mock data for categories and brands - replace with actual data
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categoriesData", currentCategoryId],
    queryFn: async () => {
      const response = await fetch(`/api/categories`);
      return response.json();
    },
  });

  const { data: brands, isLoading: isBrandsLoading } = useQuery<Brand[]>({
    queryKey: ["noFilterbrandsData", currentBrandId],
    queryFn: async () => {
      const response = await fetch(`/api/brands`);
      return response.json();
    },
  });

  return (
    <div>
      {/* Mobile Filter Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="left-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(true)}
          >
            <Filter className="h-4 w-4" />
            فیلترها
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="mr-1 mt-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-auto">
          <SheetHeader>
            <SheetTitle>فیلترهای پیشرفته</SheetTitle>
          </SheetHeader>

          <div className="py-4 space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="category">
                <AccordionTrigger>دسته‌بندی</AccordionTrigger>
                <AccordionContent>
                  <Select
                    value={filters.categoryId}
                    onValueChange={(value) =>
                      setFilters({ ...filters, categoryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">همه دسته‌بندی‌ها</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="brand">
                <AccordionTrigger>برند</AccordionTrigger>
                <AccordionContent>
                  <Select
                    value={filters.brandId}
                    onValueChange={(value) =>
                      setFilters({ ...filters, brandId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب برند" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">همه برندها</SelectItem>
                      {brands?.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger>محدوده قیمت</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-price">حداقل قیمت</Label>
                        <Input
                          id="min-price"
                          type="number"
                          placeholder="0"
                          value={filters.minPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, minPrice: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-price">حداکثر قیمت</Label>
                        <Input
                          id="max-price"
                          type="number"
                          placeholder="1000000"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, maxPrice: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rating">
                <AccordionTrigger>امتیاز</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    value={filters.minRating}
                    onValueChange={(value) =>
                      setFilters({ ...filters, minRating: value })
                    }
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="" id="r0" />
                      <Label htmlFor="r0">همه امتیازها</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="4" id="r4" />
                      <Label htmlFor="r4">4 ستاره و بالاتر</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="3" id="r3" />
                      <Label htmlFor="r3">3 ستاره و بالاتر</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="2" id="r2" />
                      <Label htmlFor="r2">2 ستاره و بالاتر</Label>
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="other">
                <AccordionTrigger>سایر فیلترها</AccordionTrigger>
                <AccordionContent>
                  {/* Has Reviews */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="has-reviews"
                      checked={filters.hasReviews}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, hasReviews: checked === true })
                      }
                    />
                    <Label htmlFor="has-reviews">دارای نظر کاربران</Label>
                  </div>

                  {/* In Stock */}
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <Checkbox
                      id="in-stock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, inStock: checked === true })
                      }
                    />
                    <Label htmlFor="in-stock">موجود در انبار</Label>
                  </div>

                  {/* Has Discount */}
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <Checkbox
                      id="has-discount"
                      checked={filters.hasDiscount}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          hasDiscount: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="has-discount">دارای تخفیف</Label>
                  </div>

                  {/* Is Featured */}
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <Checkbox
                      id="is-featured"
                      checked={filters.isFeatured}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, isFeatured: checked === true })
                      }
                    />
                    <Label htmlFor="is-featured">محصولات ویژه</Label>
                  </div>

                  {/* On Sale */}
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <Checkbox
                      id="on-sale"
                      checked={filters.onSale}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, onSale: checked === true })
                      }
                    />
                    <Label htmlFor="on-sale">حراج</Label>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sort">
                <AccordionTrigger>مرتب‌سازی</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) =>
                        setFilters({ ...filters, sortBy: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="مرتب‌سازی بر اساس" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">پیش‌فرض</SelectItem>
                        <SelectItem value="price">قیمت</SelectItem>
                        <SelectItem value="rating">امتیاز</SelectItem>
                        <SelectItem value="created_at">تاریخ</SelectItem>
                        <SelectItem value="name">نام</SelectItem>
                      </SelectContent>
                    </Select>

                    {filters.sortBy && (
                      <Select
                        value={filters.sortOrder}
                        onValueChange={(value) =>
                          setFilters({ ...filters, sortOrder: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="ترتیب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">صعودی</SelectItem>
                          <SelectItem value="desc">نزولی</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <SheetFooter className="flex flex-row gap-2 mt-4">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              پاک کردن
            </Button>
            <Button onClick={applyFilters} className="flex-1">
              اعمال فیلترها
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 my-2">
          {filters.categoryId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              دسته‌بندی:{" "}
              {isCategoriesLoading ? (
                <span>
                  <Loader2 className="animate-spin w-2 h-2" />
                </span>
              ) : (
                categories?.find(
                  (c) => String(c?.id) === String(filters.categoryId),
                )?.name || "نامعلوم"
              )}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, categoryId: "" });
                  const queryString = createQueryString({
                    ...filters,
                    categoryId: null,
                  });
                  router.push(`${pathname}?${queryString}`);
                }}
              />
            </Badge>
          )}
          {filters.brandId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              برند:{" "}
              {isBrandsLoading ? (
                <span>
                  <Loader2 className="animate-spin w-2 h-2" />
                </span>
              ) : (
                brands?.find((c) => String(c?.id) === String(filters.brandId))
                  ?.name || "نامعلوم"
              )}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, brandId: "" });
                  const queryString = createQueryString({
                    ...filters,
                    brandId: null,
                  });
                  router.push(`${pathname}?${queryString}`);
                }}
              />
            </Badge>
          )}

          {filters.minPrice && (
            <Badge variant="secondary" className="flex items-center gap-1">
              حداقل قیمت: {filters.minPrice}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, minPrice: "" });
                  const queryString = createQueryString({
                    ...filters,
                    minPrice: null,
                  });
                  router.push(`${pathname}?${queryString}`);
                }}
              />
            </Badge>
          )}

          {filters.maxPrice && (
            <Badge variant="secondary" className="flex items-center gap-1">
              حداکثر قیمت: {filters.maxPrice}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, maxPrice: "" });
                  const queryString = createQueryString({
                    ...filters,
                    maxPrice: null,
                  });
                  router.push(`${pathname}?${queryString}`);
                }}
              />
            </Badge>
          )}

          {filters.minRating && (
            <Badge variant="secondary" className="flex items-center gap-1">
              حداقل امتیاز: {filters.minRating}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, minRating: "" });
                  const queryString = createQueryString({
                    ...filters,
                    minRating: null,
                  });
                  router.push(`${pathname}?${queryString}`);
                }}
              />
            </Badge>
          )}

          {filters.hasReviews && (
            <Badge variant="secondary" className="flex items-center gap-1">
              دارای نظر
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, hasReviews: false });
                  const queryString = createQueryString({
                    ...filters,
                    hasReviews: null,
                  });
                  router.push(`${pathname}?${queryString}`);
                }}
              />
            </Badge>
          )}
          {filters.inStock && (
            <Badge variant="secondary" className="flex items-center gap-1">
              موجود در انبار
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, inStock: false });
                  const queryString = createQueryString({
                    ...filters,
                    inStock: null,
                  });
                  router.push(`${pathname}?${queryString}`);
                }}
              />
            </Badge>
          )}

          {filters.hasDiscount && (
            <Badge variant="secondary" className="flex items-center gap-1">
              دارای تخفیف
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, hasDiscount: false });
                  const queryString = createQueryString({
                    ...filters,
                    hasDiscount: null,
                  });
                  router.push(`${pathname}?${queryString}`);
                }}
              />
            </Badge>
          )}

          {filters.isFeatured && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ویژه
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, isFeatured: false });
                  const queryString = createQueryString({
                    ...filters,
                    isFeatured: null,
                  });
                  router.push(`${pathname}?${queryString}`);
                }}
              />
            </Badge>
          )}

          {filters.onSale && (
            <Badge variant="secondary" className="flex items-center gap-1">
              حراج
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, onSale: false });
                  const queryString = createQueryString({
                    ...filters,
                    onSale: null,
                  });
                  router.push(`${pathname}?${queryString}`);
                }}
              />
            </Badge>
          )}
          {filters.sortBy && filters.sortOrder && (
            <Badge variant="secondary" className="flex items-center gap-1">
              مرتب‌سازی:{" "}
              {filters.sortBy === "price"
                ? "قیمت"
                : filters.sortBy === "rating"
                  ? "امتیاز"
                  : filters.sortBy === "created_at"
                    ? "تاریخ"
                    : "نام"}
              ({filters.sortOrder === "asc" ? "صعودی" : "نزولی"})
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, sortBy: "", sortOrder: "" });
                  const queryString = createQueryString({
                    ...filters,
                    sortBy: null,
                    sortOrder: null,
                  });
                  router.push(`${pathname}?${queryString}`);
                }}
              />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              resetFilters();
              router.push(pathname);
            }}
          >
            پاک کردن همه
          </Button>
        </div>
      )}
    </div>
  );
}
