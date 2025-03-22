import { unstable_cache } from "next/cache";
import { db } from "@/db/db";
import { Category } from "@/types/categories-types";

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
