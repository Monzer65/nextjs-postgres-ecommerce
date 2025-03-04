"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, Loader2, X, SlidersHorizontal } from "lucide-react";
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
import type { Brand, Category } from "@/db/schema";

interface ProductFiltersComponentProps {
  variant?: "mobile" | "sidebar";
}

export default function ProductFiltersComponent({
  variant = "mobile",
}: ProductFiltersComponentProps) {
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

  // Update local state when URL params change
  useEffect(() => {
    setFilters({
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
  }, [
    currentCategoryId,
    currentBrandId,
    currentMinPrice,
    currentMaxPrice,
    currentMinRating,
    currentHasReviews,
    currentSortBy,
    currentSortOrder,
    currentInStock,
    currentHasDiscount,
    currentIsFeatured,
    currentOnSale,
  ]);

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
        } else if (typeof value === "boolean" && value === false) {
          // Exclude boolean values that are false
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

  // Apply a single filter immediately
  const applySingleFilter = (key: string, value: string | boolean | null) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const queryString = createQueryString({
      ...filters,
      [key]: value,
    });

    router.push(`${pathname}?${queryString}`);
  };

  // Fetch categories and brands data
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categoriesData"],
    queryFn: async () => {
      const response = await fetch(`/api/categories`);
      return response.json();
    },
  });

  const { data: brands, isLoading: isBrandsLoading } = useQuery<Brand[]>({
    queryKey: ["brandsData"],
    queryFn: async () => {
      const response = await fetch(`/api/brands`);
      return response.json();
    },
  });

  // Filter content that's shared between mobile and sidebar variants
  const filterContent = (
    <div className="space-y-4">
      {/* Categories */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">دسته‌بندی</h3>
        <Select
          value={filters.categoryId}
          onValueChange={(value) =>
            variant === "sidebar"
              ? applySingleFilter("categoryId", value || "")
              : setFilters({ ...filters, categoryId: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="انتخاب دسته‌بندی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">همه دسته‌بندی‌ها</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brands */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">برند</h3>
        <Select
          value={filters.brandId}
          onValueChange={(value) =>
            variant === "sidebar"
              ? applySingleFilter("brandId", value || "")
              : setFilters({ ...filters, brandId: value })
          }
        >
          <SelectTrigger className="w-full">
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
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">محدوده قیمت</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="min-price" className="text-xs">
              حداقل
            </Label>
            <Input
              id="min-price"
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) =>
                variant === "sidebar"
                  ? applySingleFilter("minPrice", e.target.value || "")
                  : setFilters({ ...filters, minPrice: e.target.value })
              }
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="max-price" className="text-xs">
              حداکثر
            </Label>
            <Input
              id="max-price"
              type="number"
              placeholder="1000000"
              value={filters.maxPrice}
              onChange={(e) =>
                variant === "sidebar"
                  ? applySingleFilter("maxPrice", e.target.value || "")
                  : setFilters({ ...filters, maxPrice: e.target.value })
              }
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">امتیاز</h3>
        <RadioGroup
          value={filters.minRating}
          onValueChange={(value) =>
            variant === "sidebar"
              ? applySingleFilter("minRating", value || "")
              : setFilters({ ...filters, minRating: value })
          }
          className="space-y-1 text-right"
        >
          <div className="flex items-center space-x-2 justify-end">
            <Label htmlFor="r0" className="text-sm">
              همه امتیازها
            </Label>
            <RadioGroupItem value="" id="r0" />
          </div>
          <div className="flex items-center space-x-2 justify-end">
            <Label htmlFor="r4" className="text-sm">
              ۴ ستاره و بالاتر
            </Label>
            <RadioGroupItem value="4" id="r4" />
          </div>
          <div className="flex items-center space-x-2 justify-end">
            <Label htmlFor="r3" className="text-sm">
              ۳ ستاره و بالاتر
            </Label>
            <RadioGroupItem value="3" id="r3" />
          </div>
          <div className="flex items-center space-x-2 justify-end">
            <Label htmlFor="r2" className="text-sm text-right">
              ۲ ستاره و بالاتر
            </Label>
            <RadioGroupItem value="2" id="r2" />
          </div>
        </RadioGroup>
      </div>

      {/* Other Filters */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">سایر فیلترها</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="has-reviews"
              checked={filters.hasReviews}
              onCheckedChange={(checked) =>
                variant === "sidebar"
                  ? applySingleFilter("hasReviews", checked === true)
                  : setFilters({ ...filters, hasReviews: checked === true })
              }
            />
            <Label htmlFor="has-reviews" className="text-sm">
              دارای نظر کاربران
            </Label>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={(checked) =>
                variant === "sidebar"
                  ? applySingleFilter("inStock", checked === true)
                  : setFilters({ ...filters, inStock: checked === true })
              }
            />
            <Label htmlFor="in-stock" className="text-sm">
              موجود در انبار
            </Label>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="has-discount"
              checked={filters.hasDiscount}
              onCheckedChange={(checked) =>
                variant === "sidebar"
                  ? applySingleFilter("hasDiscount", checked === true)
                  : setFilters({ ...filters, hasDiscount: checked === true })
              }
            />
            <Label htmlFor="has-discount" className="text-sm">
              دارای تخفیف
            </Label>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="is-featured"
              checked={filters.isFeatured}
              onCheckedChange={(checked) =>
                variant === "sidebar"
                  ? applySingleFilter("isFeatured", checked === true)
                  : setFilters({ ...filters, isFeatured: checked === true })
              }
            />
            <Label htmlFor="is-featured" className="text-sm">
              محصولات ویژه
            </Label>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="on-sale"
              checked={filters.onSale}
              onCheckedChange={(checked) =>
                variant === "sidebar"
                  ? applySingleFilter("onSale", checked === true)
                  : setFilters({ ...filters, onSale: checked === true })
              }
            />
            <Label htmlFor="on-sale" className="text-sm">
              حراج
            </Label>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">مرتب‌سازی</h3>
        <div className="space-y-2">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => {
              if (variant === "sidebar") {
                applySingleFilter("sortBy", value || "");
                if (value && !filters.sortOrder) {
                  applySingleFilter("sortOrder", "desc");
                }
              } else {
                setFilters({
                  ...filters,
                  sortBy: value,
                  sortOrder:
                    value && !filters.sortOrder ? "desc" : filters.sortOrder,
                });
              }
            }}
          >
            <SelectTrigger className="w-full">
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
                variant === "sidebar"
                  ? applySingleFilter("sortOrder", value || "")
                  : setFilters({ ...filters, sortOrder: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="ترتیب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">صعودی</SelectItem>
                <SelectItem value="desc">نزولی</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );

  // Render active filters badges
  const renderActiveFilters = () => {
    if (activeFilterCount === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-4">
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
              onClick={() => applySingleFilter("categoryId", "")}
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
              onClick={() => applySingleFilter("brandId", "")}
            />
          </Badge>
        )}

        {filters.minPrice && (
          <Badge variant="secondary" className="flex items-center gap-1">
            حداقل قیمت: {filters.minPrice}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => applySingleFilter("minPrice", "")}
            />
          </Badge>
        )}

        {filters.maxPrice && (
          <Badge variant="secondary" className="flex items-center gap-1">
            حداکثر قیمت: {filters.maxPrice}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => applySingleFilter("maxPrice", "")}
            />
          </Badge>
        )}

        {filters.minRating && (
          <Badge variant="secondary" className="flex items-center gap-1">
            حداقل امتیاز: {filters.minRating}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => applySingleFilter("minRating", "")}
            />
          </Badge>
        )}

        {filters.hasReviews && (
          <Badge variant="secondary" className="flex items-center gap-1">
            دارای نظر
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => applySingleFilter("hasReviews", false)}
            />
          </Badge>
        )}

        {filters.inStock && (
          <Badge variant="secondary" className="flex items-center gap-1">
            موجود در انبار
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => applySingleFilter("inStock", false)}
            />
          </Badge>
        )}

        {filters.hasDiscount && (
          <Badge variant="secondary" className="flex items-center gap-1">
            دارای تخفیف
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => applySingleFilter("hasDiscount", false)}
            />
          </Badge>
        )}

        {filters.isFeatured && (
          <Badge variant="secondary" className="flex items-center gap-1">
            ویژه
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => applySingleFilter("isFeatured", false)}
            />
          </Badge>
        )}

        {filters.onSale && (
          <Badge variant="secondary" className="flex items-center gap-1">
            حراج
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => applySingleFilter("onSale", false)}
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
                applySingleFilter("sortBy", "");
                applySingleFilter("sortOrder", "");
              }}
            />
          </Badge>
        )}

        {activeFilterCount > 0 && (
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
        )}
      </div>
    );
  };

  // Render based on variant
  if (variant === "sidebar") {
    return (
      <div className="space-y-6">
        {filterContent}
        {renderActiveFilters()}
      </div>
    );
  }

  // Mobile variant with sheet
  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 h-10"
            onClick={() => setIsOpen(true)}
          >
            <Filter className="h-4 w-4" />
            فیلترها
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="mr-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-auto">
          <SheetHeader className="my-4">
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              فیلترهای پیشرفته
            </SheetTitle>
          </SheetHeader>

          <div className="py-2">
            <Accordion
              type="multiple"
              defaultValue={["category", "brand"]}
              className="w-full"
            >
              <AccordionItem value="category">
                <AccordionTrigger className="py-3">دسته‌بندی</AccordionTrigger>
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
                <AccordionTrigger className="py-3">برند</AccordionTrigger>
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
                <AccordionTrigger className="py-3">
                  محدوده قیمت
                </AccordionTrigger>
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
                <AccordionTrigger className="py-3">امتیاز</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    value={filters.minRating}
                    onValueChange={(value) =>
                      variant === "mobile"
                        ? applySingleFilter("minRating", value || "")
                        : setFilters({ ...filters, minRating: value })
                    }
                    className="space-y-1 text-right"
                  >
                    <div className="flex items-center space-x-2 justify-end">
                      <Label htmlFor="r0" className="text-sm">
                        همه امتیازها
                      </Label>
                      <RadioGroupItem value="" id="r0" />
                    </div>
                    <div className="flex items-center space-x-2 justify-end">
                      <Label htmlFor="r4" className="text-sm">
                        ۴ ستاره و بالاتر
                      </Label>
                      <RadioGroupItem value="4" id="r4" />
                    </div>
                    <div className="flex items-center space-x-2 justify-end">
                      <Label htmlFor="r3" className="text-sm">
                        ۳ ستاره و بالاتر
                      </Label>
                      <RadioGroupItem value="3" id="r3" />
                    </div>
                    <div className="flex items-center space-x-2 justify-end">
                      <Label htmlFor="r2" className="text-sm text-right">
                        ۲ ستاره و بالاتر
                      </Label>
                      <RadioGroupItem value="2" id="r2" />
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="other">
                <AccordionTrigger className="py-3">
                  سایر فیلترها
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  {/* Has Reviews */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="has-reviews-mobile"
                      checked={filters.hasReviews}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, hasReviews: checked === true })
                      }
                    />
                    <Label htmlFor="has-reviews-mobile">
                      دارای نظر کاربران
                    </Label>
                  </div>

                  {/* In Stock */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="in-stock-mobile"
                      checked={filters.inStock}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, inStock: checked === true })
                      }
                    />
                    <Label htmlFor="in-stock-mobile">موجود در انبار</Label>
                  </div>

                  {/* Has Discount */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="has-discount-mobile"
                      checked={filters.hasDiscount}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          hasDiscount: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="has-discount-mobile">دارای تخفیف</Label>
                  </div>

                  {/* Is Featured */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="is-featured-mobile"
                      checked={filters.isFeatured}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, isFeatured: checked === true })
                      }
                    />
                    <Label htmlFor="is-featured-mobile">محصولات ویژه</Label>
                  </div>

                  {/* On Sale */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="on-sale-mobile"
                      checked={filters.onSale}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, onSale: checked === true })
                      }
                    />
                    <Label htmlFor="on-sale-mobile">حراج</Label>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sort">
                <AccordionTrigger className="py-3">مرتب‌سازی</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) =>
                        setFilters({
                          ...filters,
                          sortBy: value,
                          sortOrder:
                            value && !filters.sortOrder
                              ? "desc"
                              : filters.sortOrder,
                        })
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

          <SheetFooter className="flex flex-row gap-2 mt-6">
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
      {renderActiveFilters()}
    </div>
  );
}
