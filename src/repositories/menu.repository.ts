import { getMenuCollection } from "../lib/mongodb";
import type { MenuDocument } from "../types/menu";

export async function findPublishedMenuBySlug(slug: string): Promise<MenuDocument | null> {
  const menu = await getMenuCollection().findOne<MenuDocument>({
    slug,
    published: true
  });

  return menu;
}
