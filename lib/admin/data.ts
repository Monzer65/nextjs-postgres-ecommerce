import { db } from "@/db/db";
import { sql } from "kysely";
import { unstable_cache as nextCache } from "next/cache"; // Next.js cache for persistent caching

const ITEMS_PER_PAGE = 1; // Number of items per page

// Helper function to generate a cache key
const getCacheKey = (query: string, currentPage: number) => {
  return `products-${query}-${currentPage}`;
};

// Cached function to fetch products
export const getProducts = nextCache(
  async (query: string, currentPage: number) => {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
      // Fetch products with pagination
      const products = await db
        .with("product_images", (eb) =>
          eb
            .selectFrom("product_image")
            .select([
              "product_image.product_id",
              sql<string[]>`array_agg(product_image.url)`.as("image_urls"),
            ])
            .groupBy("product_image.product_id"),
        )
        .selectFrom("product")
        .leftJoin("category", "category.id", "product.category_id")
        .innerJoin("brand", "brand.id", "product.brand_id")
        .innerJoin("manufacturer", "manufacturer.id", "product.manufacturer_id")
        .innerJoin("product_images", "product_images.product_id", "product.id")
        .select([
          "product.id",
          "product.name",
          "product.price",
          "product.description",
          "product.stock",
          "category.name as category_name",
          "product_images.image_urls",
          "brand.name as brand_name",
          "manufacturer.name as manufacturer_name",
        ])
        .where((eb) =>
          eb.or([
            eb("product.name", "ilike", `%${query}%`), // Case-insensitive search
            eb("category.name", "ilike", `%${query}%`),
            eb.exists(
              eb
                .selectFrom("product_image")
                .whereRef("product_image.product_id", "=", "product.id")
                .where("product_image.url", "ilike", `%${query}%`)
                .select("product_image.id"),
            ),
            eb("brand.name", "ilike", `%${query}%`),
            eb("manufacturer.name", "ilike", `%${query}%`),
          ]),
        )
        .limit(ITEMS_PER_PAGE)
        .offset(offset)
        .execute();

      // Fetch total count of products matching the query
      const totalProducts = await db
        .selectFrom("product")
        .leftJoin("category", "category.id", "product.category_id")
        .innerJoin("brand", "brand.id", "product.brand_id")
        .innerJoin("manufacturer", "manufacturer.id", "product.manufacturer_id")
        .where((eb) =>
          eb.or([
            eb("product.name", "ilike", `%${query}%`),
            eb("category.name", "ilike", `%${query}%`),
            eb.exists(
              eb
                .selectFrom("product_image")
                .whereRef("product_image.product_id", "=", "product.id")
                .where("product_image.url", "ilike", `%${query}%`)
                .select("product_image.id"),
            ),
            eb("brand.name", "ilike", `%${query}%`),
            eb("manufacturer.name", "ilike", `%${query}%`),
          ]),
        )
        .select((eb) =>
          eb.fn.count<number>("product.id").distinct().as("products_count"),
        )
        .execute();

      return {
        products,
        totalProducts: Number(totalProducts[0].products_count),
        currentPage,
        totalPages: Math.ceil(
          Number(totalProducts[0].products_count) / ITEMS_PER_PAGE,
        ),
      };
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch products.");
    }
  },
  ["getProducts"], // Cache tag
  { revalidate: 60 * 5 }, // Revalidate cache every 5 minutes
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
