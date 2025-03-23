"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, ArrowDown, X, Star } from "lucide-react";
import Link from "next/link";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSearchModal } from "@/hooks/search-modal-context";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResult {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  manufacturer: string;
  discount: number | null;
  isFeatured: boolean;
  onSale: boolean;
  averageRating: number;
  reviewCount: number;
}

export const SearchModal = () => {
  const { isOpen, closeModal } = useSearchModal();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchParams = useSearchParams();
  const { replace, push } = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get("query") || "";

  // Fetch data using TanStack Query
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query) return [];
      const response = await fetch(`/api/search?q=${query}`);
      if (!response.ok) throw new Error("Failed to fetch results");
      const data = await response.json();
      return data;
    },
    enabled: !!query && isOpen,
  });

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
    setSelectedIndex(-1);
  }, 300);

  const handleClearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    replace(`${pathname}?${params.toString()}`);
    setSelectedIndex(-1);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev,
        );
        // Scroll to the selected item
        if (selectedIndex >= 0 && resultsRef.current) {
          const selectedElement = resultsRef.current.children[
            selectedIndex + 1
          ] as HTMLElement;
          if (selectedElement) {
            selectedElement.scrollIntoView({ block: "nearest" });
          }
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        // Scroll to the selected item
        if (selectedIndex > 0 && resultsRef.current) {
          const selectedElement = resultsRef.current.children[
            selectedIndex - 1
          ] as HTMLElement;
          if (selectedElement) {
            selectedElement.scrollIntoView({ block: "nearest" });
          }
        }
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && results[selectedIndex]) {
          push(`/product/${results[selectedIndex].id}`);
          closeModal();
        } else if (query) {
          push(`/search?query=${query}`);
          closeModal();
        }
      } else if (e.key === "Escape") {
        closeModal();
      }
    },
    [results, selectedIndex, query, push, closeModal, isOpen],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate discounted price
  const getDiscountedPrice = (price: number, discount: number | null) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[650px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-xl font-bold">
            جستجوی محصولات
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            در این قسمت می‌توانید به جستجوی محصولات و دسته‌بندی‌ها بپردازید
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="نام محصول، برند یا دسته‌بندی را وارد کنید..."
              onChange={(e) => handleSearch(e.target.value)}
              defaultValue={searchParams.get("query")?.toString()}
              className="pr-10 text-right h-12 text-base"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={handleClearSearch}
                aria-label="پاک کردن جستجو"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <div
          ref={resultsRef}
          className="space-y-2 max-h-[60vh] overflow-y-auto p-4 pt-2"
        >
          {isLoading
            ? // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-3">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            : results.length > 0
              ? results.map((item: SearchResult, index: number) => (
                  <Card
                    key={item.id}
                    className={`transition-colors hover:bg-accent ${index === selectedIndex ? "bg-accent" : ""}`}
                  >
                    <CardContent className="p-3">
                      <Link
                        href={`/product/${item.id}`}
                        className="flex items-center gap-4"
                        onClick={closeModal}
                      >
                        <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                          <Image
                            fill
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="object-cover"
                            sizes="64px"
                          />
                          {item.onSale && (
                            <Badge
                              className="absolute top-0 right-0 text-[10px]"
                              variant="destructive"
                            >
                              تخفیف
                            </Badge>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-base line-clamp-1">
                            {item.name}
                          </h3>

                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            {item.brand && (
                              <Badge variant="secondary" className="text-xs">
                                {item.brand}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{5}</span>
                              <span className="text-xs text-muted-foreground">
                                ({item.reviewCount})
                              </span>
                            </div>

                            <div className="text-left">
                              {item.discount ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-sm line-through text-muted-foreground">
                                    {formatPrice(item.price)}
                                  </span>
                                  <span className="font-bold text-destructive">
                                    {formatPrice(
                                      getDiscountedPrice(
                                        item.price,
                                        item.discount,
                                      ),
                                    )}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-bold">
                                  {formatPrice(item.price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {index === selectedIndex && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                            <span>Enter</span>
                          </div>
                        )}
                      </Link>
                    </CardContent>
                  </Card>
                ))
              : query && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="mb-2">
                      <Search className="h-10 w-10 mx-auto text-muted-foreground/50" />
                    </div>
                    <p className="text-lg font-medium">نتیجه‌ای یافت نشد</p>
                    <p className="text-sm">
                      لطفا با کلمات کلیدی دیگری جستجو کنید
                    </p>
                  </div>
                )}

          {!query && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-2">
                <Search className="h-10 w-10 mx-auto text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium">جستجوی محصولات</p>
              <p className="text-sm">
                نام محصول، برند یا دسته‌بندی مورد نظر خود را وارد کنید
              </p>
            </div>
          )}
        </div>

        {query && results.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t">
            <div className="text-sm text-muted-foreground">
              {results.length} نتیجه یافت شد
            </div>
            <Button
              onClick={() => {
                push(`/search?query=${searchParams.get("query")}`);
                closeModal();
              }}
              className="gap-2"
            >
              مشاهده همه نتایج
              <ArrowDown className="h-4 w-4 rotate-[-90deg] rtl:rotate-90" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
