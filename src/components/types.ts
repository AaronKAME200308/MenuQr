// ─────────────────────────────────────────────────────────────
// types.ts — Types partagés entre tous les composants Menu
// ─────────────────────────────────────────────────────────────

export type Colors = {
  bg: string;
  primary: string;
  accent: string;
  card: string;
};

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  address?: string;
  phone?: string;
  logo_url?: string;
  color_bg?: string;
  color_primary?: string;
  color_accent?: string;
  color_card?: string;
  font_display?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_whatsapp?: string;
  social_tiktok?: string;
  social_googlemaps?: string;
  social_website?: string;
};

export type Category = {
  id: string;
  restaurant_id: string;
  name: string;
  icon?: string;
  sort_order: number;
};

export type MenuItemVariant = {
  label: string;
  price: number;
  currency: string;
};

export type Ingredient = {
  name: string;
  icon?: string; // emoji ou URL image
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image_url?: string;
  is_bestseller?: boolean;
  is_popular?: boolean;
  is_new?: boolean;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  is_available?: boolean;
  sort_order?: number;
  variants?: MenuItemVariant[];
  ingredients?: Ingredient[];
  calories?: number;
  weight?: string;
};