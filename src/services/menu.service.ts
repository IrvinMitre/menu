import { findPublishedMenuBySlug } from "../repositories/menu.repository";
import type { Menu, MenuCategory, MenuItem } from "../types/menu";

function sortItems(items: MenuItem[]): MenuItem[] {
  return [...items].sort((first, second) => first.order - second.order);
}

function sortCategories(categories: MenuCategory[]): MenuCategory[] {
  return [...categories]
    .sort((first, second) => first.order - second.order)
    .map((category) => ({
      ...category,
      items: sortItems(category.items)
    }));
}

export async function getPublishedMenu(slug: string): Promise<Menu | null> {
  const document = await findPublishedMenuBySlug(slug);

  if (!document) {
    return null;
  }

  const { _id: unusedId, ...menu } = document;
  void unusedId;

  return {
    ...menu,
    categories: sortCategories(menu.categories)
  };
}
