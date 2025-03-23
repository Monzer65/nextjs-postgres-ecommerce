"use client";

import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface SearchResultsProps {
  results: SearchResult[];
  onFavorite?: (id: string) => void;
  favorites?: string[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onFavorite,
  favorites = [],
}) => {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {results.map((item) => (
        <Card key={item.id} className="overflow-hidden group">
          <div className="relative">
            <div className="aspect-[4/3] relative overflow-hidden">
              <Image
                fill
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {item.onSale && (
              <Badge className="absolute top-2 right-2" variant="destructive">
                تخفیف
              </Badge>
            )}

            {item.isFeatured && (
              <Badge className="absolute top-2 left-2" variant="secondary">
                ویژه
              </Badge>
            )}

            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 left-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onFavorite?.(item.id)}
              aria-label={
                favorites.includes(item.id)
                  ? "حذف از علاقه‌مندی‌ها"
                  : "افزودن به علاقه‌مندی‌ها"
              }
            >
              <Heart
                className={`h-4 w-4 ${favorites.includes(item.id) ? "fill-destructive text-destructive" : ""}`}
              />
            </Button>
          </div>

          <CardContent className="p-4">
            <Link href={`/product/${item.id}`} className="block">
              <h3 className="font-medium text-base line-clamp-1 mb-1">
                {item.name}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
                {item.brand && (
                  <Badge variant="secondary" className="text-xs">
                    {item.brand}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{item.averageRating || ""}</span>
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
                          getDiscountedPrice(item.price, item.discount),
                        )}
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold">{formatPrice(item.price)}</span>
                  )}
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
