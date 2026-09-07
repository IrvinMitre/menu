export type SinglePriceMenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  prices?: never;
  available: boolean;
  order: number;
};

export type SizedPriceMenuItem = {
  id: string;
  name: string;
  description?: string;
  price?: never;
  prices: {
    large: number;
    small: number;
  };
  available: boolean;
  order: number;
};

export type MenuItem = SinglePriceMenuItem | SizedPriceMenuItem;

export type MenuCategory = {
  id: string;
  name: string;
  order: number;
  items: MenuItem[];
};

export type Menu = {
  slug: string;
  businessName: string;
  subtitle?: string;
  currency: "MXN";
  published: boolean;
  categories: MenuCategory[];
};

export type MenuDocument = Menu & {
  _id?: unknown;
};
