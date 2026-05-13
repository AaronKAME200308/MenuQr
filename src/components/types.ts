// types.ts
// Types TypeScript complets alignés sur le schéma Supabase

// ─────────────────────────────────────────────────────────────
// Ingrédient (stocké en JSONB dans menu_items.ingredients)
// ─────────────────────────────────────────────────────────────

export interface Ingredient {
  name: string;
  icon?: string; // emoji, ex: "🍅"
}

// ─────────────────────────────────────────────────────────────
// Variante de taille / prix (stockée en JSONB dans menu_items.variants)
// ─────────────────────────────────────────────────────────────

export interface Variant {
  label: string;    // ex: "S", "M", "L", "Simple", "Double"
  price: number;
  currency: string; // ex: "EUR", "XAF"
}

// ─────────────────────────────────────────────────────────────
// Menu item — correspond à public.menu_items
// ─────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image_url?: string;
  is_available: boolean;
  is_bestseller: boolean;
  is_popular: boolean;
  is_new: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  sort_order: number;
  created_at: string;
  // colonnes JSONB ajoutées par la migration
  ingredients?: Ingredient[];
  variants?: Variant[];
}

// ─────────────────────────────────────────────────────────────
// Catégorie — correspond à public.categories
// ─────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  icon?: string;
  sort_order: number;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────
// Restaurant — correspond à public.restaurants
// ─────────────────────────────────────────────────────────────

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  logo_url?: string;
  // Palette couleurs
  color_bg: string;
  color_primary: string;
  color_accent: string;
  color_card: string;
  // Typographie
  font_display?: string;
  font_body?: string;
  // Réseaux sociaux
  social_facebook?: string;
  social_instagram?: string;
  social_whatsapp?: string;
  social_tiktok?: string;
  social_googlemaps?: string;
  social_website?: string;
  // Contact
  phone?: string;
  address?: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────
// Palette de couleurs dérivée (utilisée dans tous les composants)
// ─────────────────────────────────────────────────────────────

export interface Colors {
  bg: string;
  primary: string;
  accent: string;
  card: string;
}