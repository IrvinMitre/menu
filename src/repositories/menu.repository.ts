import { getMenuCollection } from "../lib/mongodb";
import type { MenuDocument } from "../types/menu";

export async function findPublishedMenuBySlug(slug: string): Promise<MenuDocument | null> {
  const collection = await getMenuCollection();
  const menu = await collection.findOne<MenuDocument>({
    slug,
    published: true
  });

  return menu;
}
