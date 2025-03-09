import { db } from "@/db/db";
import { ProductImage } from "@/db/schema";
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
    pageSize: number,
  ): Promise<FilteredProducts> => {
    const offset = (currentPage - 1) * pageSize;

    try {
      console.log("filters:", filter);
      let filteredProducts = db
        .selectFrom("product")
        .leftJoin("brand", "brand.id", "product.brand_id")
        .leftJoin("category", "category.id", "product.category_id")
        .leftJoin("manufacturer", "manufacturer.id", "product.manufacturer_id")
        .leftJoin("product_review", "product_review.product_id", "product.id")
        .leftJoin("discount", "product.discount_id", "discount.id")
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
          "discount.discount_value",
          "product.featured as is_featured",
          "product.on_sale",
          //sql<number>`COALESCE(AVG(product_review.rating), 0)`.as(
          //  "average_rating",
          //),
          //sql<number>`COUNT(product_review.id)`.as("review_count"),
        ])
        .groupBy([
          "product.id",
          "category.name",
          "brand.name",
          "manufacturer.name",
          "discount.discount_value",
          "product.featured",
          "product.on_sale",
        ]);

      // Apply filters
      if (filter.categoryId !== undefined) {
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

      if (filter.brandId !== undefined) {
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

      if (filter.minRating !== undefined) {
        filteredProducts = filteredProducts.having(
          (eb) => eb.fn.coalesce(eb.fn.avg("product_review.rating"), eb.val(0)),
          ">=",
          filter.minRating,
        );
      }

      if (filter.hasReviews) {
        filteredProducts = filteredProducts.having(
          (eb) => eb.fn.count("product_review.id"),
          ">",
          0,
        );
      }

      if (filter.inStock) {
        filteredProducts = filteredProducts.where("product.stock", ">", 0);
      }

      if (filter.lowStockThreshold) {
        filteredProducts = filteredProducts.where(
          "product.stock",
          "<=",
          filter.lowStockThreshold,
        );
      }

      if (filter.outOfStock) {
        filteredProducts = filteredProducts.where("product.stock", "=", 0);
      }

      if (filter.hasDiscount) {
        filteredProducts = filteredProducts.where(
          "discount.discount_value",
          ">",
          0,
        );
      }

      if (filter.isFeatured) {
        filteredProducts = filteredProducts.where(
          "product.featured",
          "=",
          filter.isFeatured,
        );
      }

      if (filter.onSale) {
        filteredProducts = filteredProducts.where(
          "product.on_sale",
          "=",
          filter.onSale,
        );
      }

      // Apply sorting
      if (filter.sortBy) {
        const sortOrder = filter.sortOrder || "asc";
        if (filter.sortBy === "rating") {
          filteredProducts = filteredProducts.orderBy(
            sql`COALESCE(AVG(product_review.rating), 0)`,
            sortOrder,
          );
        } else {
          filteredProducts = filteredProducts.orderBy(
            `product.${filter.sortBy}`,
            sortOrder,
          );
        }
      } else {
        // Default sorting by crea:tion date if no sortBy is provided
        filteredProducts = filteredProducts.orderBy(
          "product.created_at",
          "desc",
        );
      }

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
  { revalidate: 360, tags: ["products"] }, //6 minutes
);

export async function getProductById(id: number) {
  const data = await db
    .selectFrom("product")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
  return data;
}

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

export async function getFilteredCategories(filter: string) {
  const lowerFilter = filter.toLocaleLowerCase();
  const data = await db.selectFrom("category").selectAll().execute();

  return data
    .filter(({ name }) => name.toLocaleLowerCase().includes(lowerFilter))
    .slice(0, 20)
    .map(({ id, name }) => ({
      value: id.toString(),
      label: name,
    }));
}

export async function getCategoryById(id: string) {
  const data = await db
    .selectFrom("category")
    .select(["id", "name", "description", "parent_id"])
    .where("id", "=", Number(id))
    .executeTakeFirst();
  return data;
}

export async function getBrands() {
  const data = await db.selectFrom("brand").selectAll().execute();
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

export async function getManufacturers() {
  const data = await db.selectFrom("manufacturer").selectAll().execute();
  return data;
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

export async function getWarranties() {
  const data = await db.selectFrom("warranty").selectAll().execute();
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

export async function getImagesByProductId(
  id: number,
): Promise<ProductImage[]> {
  const data = await db
    .selectFrom("product_image")
    .selectAll()
    .where("product_id", "=", id)
    .execute();
  return data;
}
