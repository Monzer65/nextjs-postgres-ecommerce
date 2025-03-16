// Type for filter parameters
export interface ProductFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  brandId?: number;
  inStock?: boolean;
  minRating?: number;
  hasReviews?: boolean;
  hasDiscount?: boolean;
  discountType?: "percentage" | "fixed_amount";
  lowStockThreshold?: number;
  outOfStock?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  parentCategoryId?: number;
  excludeCategoryId?: number;
  brandIds?: number[];
  excludeBrandId?: number;
  minWeight?: number;
  maxWeight?: number;
  minLength?: number;
  maxLength?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  tagIds?: number[];
  excludeTagIds?: number[];
  hasWarranty?: boolean;
  minWarrantyDuration?: number;
  maxWarrantyDuration?: number;
  hasVariations?: boolean;
  variationName?: string;
  variationValue?: string;
  sortBy?: "price" | "rating" | "created_at" | "name";
  sortOrder?: "asc" | "desc";
  isFeatured?: boolean;
  onSale?: boolean;
}

// Type for paginated result
export interface FilteredProducts {
  products: ProductResult[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

// Combined result type with joined relations
export interface ProductResult {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  brand: string | null;
  manufacturer: string | null;
  thumbnail: string | null;
  created_at: Date;
  average_rating: number | null;
  review_count: number | null;
  discount_value: number | null;
  is_featured: boolean | null;
  on_sale: boolean | null;
  firstImageUrl?: string;
}
