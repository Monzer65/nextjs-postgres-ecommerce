import { db } from "@/db/db";
import {
  FilteredProducts,
  ProductFilter,
  ProductResult,
} from "@/types/product-types";
import { sql } from "kysely";
import { unstable_cache } from "next/cache";

export const getFilteredProducts = unstable_cache(
  async (
    filter: ProductFilter,
    currentPage: number,
    pageSize: number = 10,
  ): Promise<FilteredProducts> => {
    const offset = (currentPage - 1) * pageSize;

    try {
      let filteredProducts = db
        .selectFrom("product")
        .leftJoin("brand", "brand.id", "product.brand_id")
        .leftJoin("category", "category.id", "product.category_id")
        .leftJoin("manufacturer", "manufacturer.id", "product.manufacturer_id")
        .select([
          "product.id",
          "product.name",
          "product.description",
          "product.price",
          "product.sku",
          "product.stock",
          "product.thumbnail",
          "product.created_at",
          "category.name as category",
          "brand.name as brand",
          "manufacturer.name as manufacturer",
        ])
        .groupBy([
          "product.id",
          "category.name",
          "brand.name",
          "manufacturer.name",
        ]);

      // Apply filters
      if (filter.categoryId) {
        filteredProducts = filteredProducts.where(
          "category.id",
          "=",
          filter.categoryId,
        );
      }

      if (filter.query) {
        filteredProducts = filteredProducts.where(
          "product.name",
          "like",
          `%${filter.query}%`,
        );
      }

      if (filter.brandId) {
        filteredProducts = filteredProducts.where(
          "brand.id",
          "=",
          filter.brandId,
        );
      }

      if (filter.minPrice !== undefined) {
        filteredProducts = filteredProducts.where(
          "product.price",
          ">=",
          filter.minPrice,
        );
      }

      if (filter.maxPrice !== undefined) {
        filteredProducts = filteredProducts.where(
          "product.price",
          "<=",
          filter.maxPrice,
        );
      }

      if (filter.createdAfter) {
        filteredProducts = filteredProducts.where(
          "product.created_at",
          ">=",
          filter.createdAfter,
        );
      }

      if (filter.createdBefore) {
        filteredProducts = filteredProducts.where(
          "product.created_at",
          "<=",
          filter.createdBefore,
        );
      }

      if (filter.inStock !== undefined) {
        filteredProducts = filteredProducts.where("product.stock", ">", 0);
      }

      if (filter.outOfStock !== undefined) {
        filteredProducts = filteredProducts.where("product.stock", "=", 0);
      }

      //if (filter.minRating !== undefined) {
      //  filteredProducts = filteredProducts.where(
      //    "product.rating",
      //    ">=",
      //    filter.minRating,
      //  );
      //}
      //
      //if (filter.hasReviews !== undefined) {
      //  filteredProducts = filteredProducts.where(
      //    "product.review_count",
      //    ">",
      //    0,
      //  );
      //}
      //
      //if (filter.hasDiscount !== undefined) {
      //  filteredProducts = filteredProducts.where(
      //    "product.discount",
      //    "is not",
      //    null,
      //  );
      //}
      //
      if (filter.lowStockThreshold !== undefined) {
        filteredProducts = filteredProducts.where(
          "product.stock",
          "<=",
          filter.lowStockThreshold,
        );
      }

      //if (filter.isFeatured !== undefined) {
      //  filteredProducts = filteredProducts.where(
      //    "product.is_featured",
      //    "=",
      //    filter.isFeatured,
      //  );
      //}
      //
      //if (filter.onSale !== undefined) {
      //  filteredProducts = filteredProducts.where(
      //    "product.on_sale",
      //    "=",
      //    filter.onSale,
      //  );
      //}

      // Apply sorting
      //if (filter.sortBy) {
      //  const sortOrder = filter.sortOrder || "asc";
      //  filteredProducts = filteredProducts.orderBy(
      //    `product.${filter.sortBy}`,
      //    sortOrder,
      //  );
      //} else {
      //  // Default sorting by creation date if no sortBy is provided
      //  filteredProducts = filteredProducts.orderBy(
      //    "product.created_at",
      //    "desc",
      //  );
      //}
      //
      // Count total products
      const totalProducts = filteredProducts
        .select(sql<number>`count(product.id)`.as("total"))
        .executeTakeFirst();

      // Fetch paginated products
      const dataQuery = filteredProducts
        .limit(pageSize)
        .offset(offset)
        .execute();

      const [products, totalCount] = await Promise.all([
        dataQuery,
        totalProducts,
      ]);

      const totalItems = totalCount?.total ?? 0;
      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        products: products as ProductResult[],
        totalPages,
        currentPage,
        pageSize,
        totalItems,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch products.");
    }
  },
  ["products"],
  { revalidate: 3600, tags: ["products"] },
);

let dropdownDataCache: any = null;
const cacheExpiry = 60 * 60 * 1000; // 1 hour

export async function fetchDropdownData() {
  if (
    dropdownDataCache &&
    Date.now() - dropdownDataCache.timestamp < cacheExpiry
  ) {
    return dropdownDataCache.data;
  }

  const tables = ["category"];
  const [categories] = await Promise.all(
    tables.map((table) =>
      db
        .selectFrom(table as any)
        .selectAll()
        .execute(),
    ),
  );

  const data = { categories };
  dropdownDataCache = { data, timestamp: Date.now() };
  return data;
}

export async function getCategories() {
  const data = await db.selectFrom("category").selectAll().execute();
  return data;
}

export async function getCategoryById(id: string) {
  const data = await db
    .selectFrom("category")
    .select(["id", "name", "description", "parent_id"])
    .where("id", "=", Number(id))
    .executeTakeFirst();
  return data;
}

export async function getFilteredBrands(filter: string) {
  const lowerFilter = filter.toLocaleLowerCase();
  const data = await db.selectFrom("brand").selectAll().execute();

  return data
    .filter(({ name }) => name.toLocaleLowerCase().includes(lowerFilter))
    .slice(0, 20)
    .map(({ id, name }) => ({
      value: id.toString(), // Convert ID to string if needed
      label: name,
    }));
}

export async function getFilteredManufacturers(filter: string) {
  const lowerFilter = filter.toLocaleLowerCase();
  const data = await db.selectFrom("manufacturer").selectAll().execute();

  return data
    .filter(({ name }) => name.toLocaleLowerCase().includes(lowerFilter))
    .slice(0, 20)
    .map(({ id, name }) => ({
      value: id.toString(),
      label: name,
    }));
}

export async function getDiscounts() {
  const data = await db.selectFrom("discount").selectAll().execute();
  return data;
}

export async function getFilteredWarranties(filter: string) {
  const lowerFilter = filter.toLocaleLowerCase();
  const data = await db.selectFrom("warranty").selectAll().execute();

  return data
    .filter(({ name }) => name.toLocaleLowerCase().includes(lowerFilter))
    .slice(0, 20)
    .map(({ id, name }) => ({
      value: id.toString(),
      label: name,
    }));
}
