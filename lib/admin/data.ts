import { db } from "@/db/db";

const ITEMS_PER_PAGE = 10;

export async function getProducts(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await db
      .selectFrom("product")
      .leftJoin("category", "category.id", "product.category_id") // Optional relationship
      .innerJoin("product_image", "product_image.product_id", "product.id") // Mandatory relationship
      .innerJoin("brand", "brand.id", "product.brand_id") // Mandatory relationship
      .innerJoin("manufacturer", "manufacturer.id", "product.manufacturer_id") // Mandatory relationship
      .select([
        "product.id",
        "product.name",
        "product.price",
        "product.description",
        "product.stock",
        "category.name as category_name",
        "product_image.url as image_url",
        "brand.name as brand_name",
        "manufacturer.name as manufacturer_name",
      ])
      .where((eb) =>
        eb.or([
          eb("product.name", "like", `%${query}%`),
          eb("category.name", "like", `%${query}%`),
          eb("product_image.url", "like", `%${query}%`),
          eb("brand.name", "like", `%${query}%`),
          eb("manufacturer.name", "like", `%${query}%`),
        ]),
      )
      .limit(ITEMS_PER_PAGE)
      .offset(offset)
      .execute();

    const totalProducts = await db
      .selectFrom("product")
      .where("name", "like", `%${query}%`)
      .select((eb) => eb.fn.countAll().as("products_count"))
      .execute();

    return {
      products,
      totalProducts: totalProducts[0].products_count,
      currentPage,
      totalPages: Math.ceil(
        Number(totalProducts[0].products_count) / ITEMS_PER_PAGE,
      ),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch products.");
  }
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

  const tables = ["brand", "manufacturer", "category", "discount", "warranty"];
  const [brands, manufacturers, categories, discounts, warranties] =
    await Promise.all(
      tables.map((table) =>
        db
          .selectFrom(table as any)
          .selectAll()
          .execute(),
      ),
    );

  const data = { brands, manufacturers, categories, discounts, warranties };
  dropdownDataCache = { data, timestamp: Date.now() };
  return data;
}

export async function getCategories() {
  const data = await db
    .selectFrom("category")
    .select(["id", "name", "description", "parent_id"])
    .execute();
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
