import { unstable_cache } from "next/cache";
import { db } from "@/db/db";
import { Category } from "@/types/categories-types";
import { sql } from "kysely";

export async function getCategories() {
  const data = await db.selectFrom("category").selectAll().execute();
  return data;
}

// Cache the categories for better performance
export const getCachedCategories = unstable_cache(
  async () => {
    const categories = await getCategories();

    // Generate href for each category
    const categoriesWithHref = categories.map((category) => ({
      ...category,
      href: `/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`,
    }));

    // Create a hierarchical structure
    const categoryMap = new Map();
    const rootCategories: Category[] = [];

    // First, add all categories to a map
    categoriesWithHref.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Then, build the hierarchy
    categoriesWithHref.forEach((category) => {
      if (category.parent_id === null) {
        rootCategories.push(categoryMap.get(category.id));
      } else {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(categoryMap.get(category.id));
        }
      }
    });

    return rootCategories;
  },
  ["categories"],
  { revalidate: 3600 }, // Cache for 1 hour
);

export async function getSearchResults({ q }: { q: string }) {
  try {
    // Fetch products from the database that match the search term
    const products = await db
      .selectFrom("product")
      .leftJoin("brand", "brand.id", "product.brand_id")
      .leftJoin("category", "category.id", "product.category_id")
      .leftJoin("manufacturer", "manufacturer.id", "product.manufacturer_id")
      .leftJoin("product_review", "product_review.product_id", "product.id")
      .leftJoin("discount", "product.discount_id", "discount.id")
      .leftJoin(
        "product_image",
        (join) =>
          join
            .onRef("product_image.product_id", "=", "product.id")
            .on("product_image.order", "=", 0), // Fetch the first image (order = 0)
      )
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
        "product_image.url as firstImageUrl",
        sql<number>`COALESCE(AVG(product_review.rating), 0)`.as(
          "average_rating",
        ),
        sql<number>`COUNT(product_review.id)`.as("review_count"),
      ])
      .groupBy([
        "product.id",
        "category.name",
        "brand.name",
        "manufacturer.name",
        "discount.discount_value",
        "product.featured",
        "product.on_sale",
        "product_image.url",
      ])
      .where((eb) =>
        eb.or([
          eb("product.name", "ilike", `%${q}%`), // Search by product name
          eb("product.description", "ilike", `%${q}%`), // Search by product description
          eb("product.sku", "ilike", `%${q}%`), // Search by SKU
          eb("category.name", "ilike", `%${q}%`), // Search by category name
          eb("brand.name", "ilike", `%${q}%`), // Search by brand name
          eb("manufacturer.name", "ilike", `%${q}%`), // Search by manufacturer name
        ]),
      )
      .limit(5) // Limit results to top 5
      .execute();

    // Format the results to match the expected structure
    const results = products.map((product) => ({
      id: product.id.toString(),
      name: product.name,
      category: product.category,
      image: product.thumbnail, // Fallback image if no image is available
      price: product.price,
      brand: product.brand,
      manufacturer: product.manufacturer,
      discount: product.discount_value,
      isFeatured: product.is_featured,
      onSale: product.on_sale,
      averageRating: product.average_rating,
      reviewCount: product.review_count,
    }));

    return results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return []; // Return an empty array in case of error
  }
}
