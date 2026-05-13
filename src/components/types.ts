// types.ts

// ─────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────

export interface Ingredient {
  name: string;
  icon?: string;
}

export interface Variant {
  label: string;
  price: number;
  currency: string;
}

export interface Colors {
  bg: string;
  primary: string;
  accent: string;
  card: string;
}

// ─────────────────────────────────────────────────────────────
// Supabase rows
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
  ingredients?: Ingredient[];
  variants?: Variant[];
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  icon?: string;
  sort_order: number;
  created_at: string;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  logo_url?: string;
  color_bg: string;
  color_primary: string;
  color_accent: string;
  color_card: string;
  font_display?: string;
  font_body?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_whatsapp?: string;
  social_tiktok?: string;
  social_googlemaps?: string;
  social_website?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────
// RestaurantConfig — personnalisation par restaurant
// ─────────────────────────────────────────────────────────────

/** FOND DE PAGE */
export interface BackgroundConfig {
  /** Pattern SVG haut : "diamonds" | "grid" | "dots" | "none" */
  patternTop: "diamonds" | "grid" | "dots" | "none";
  /** Pattern SVG bas */
  patternBottom: "diamonds" | "grid" | "dots" | "none";
  patternTopOpacity: number;
  patternBottomOpacity: number;
  blobTopLeft: boolean;
  blobBottomRight: boolean;
}

/** HEADER / HERO */
export interface HeaderConfig {
  /** Afficher le grand "ME\nNU" éditorial */
  showBigMenu: boolean;
  /** Texte alternatif si showBigMenu = false */
  heroTitle?: string;
  /** Texture sur l'arc coloré */
  arcTexture: "dots" | "none";
  /** Forme du bas de l'arc */
  arcShape: "round" | "straight";
  /** Anneau pulsant autour du logo */
  logoPulse: boolean;
  /** Séparateur animé sous le nom */
  showDivider: boolean;
  /** Parallax au scroll */
  parallax: boolean;
}

/** CARTES (ItemCard + CategorySection) */
export interface CardConfig {
  /** Disposition des cartes dans la grille */
  layout: "grid" | "list";
  /** Largeur minimale des colonnes (grille) */
  gridMinWidth: number;
  /** Rayon des coins */
  borderRadius: number;
  /** Image circulaire flottante en haut de la carte */
  showFloatingImage: boolean;
  /** Animation lévitation de l'image */
  imageFloat: boolean;
  /** Numéro de l'item */
  showIndex: boolean;
  /** Badges bestseller / populaire / nouveau */
  showBadges: boolean;
  /** Description courte */
  showDescription: boolean;
  /** Icônes végétarien / épicé */
  showDietIcons: boolean;
}

/** MODAL (ItemModal) */
export interface ModalConfig {
  /** Emojis décoratifs [gauche, droite] dans le header */
  heroEmojis: [string, string];
  /** Texture feuilles SVG dans le header */
  showHeroTexture: boolean;
  /** Forme du bas du header coloré */
  heroShape: "blob" | "straight";
  /** Labels texte */
  labelIngredients: string;
  labelDescription: string;
  labelVariants: string;
  /** Sections visibles */
  showIngredients: boolean;
  showVariants: boolean;
}

/** SOCIALS */
export interface SocialsConfig {
  /** Texte affiché entre les deux lignes séparatrices */
  sectionLabel: string;
  /** Disposition */
  layout: "grid" | "row";
  /** Largeur min colonnes */
  gridMinWidth: number;
}

/** Config complète — seul slug est requis, tout merge avec default */
export interface RestaurantConfig {
  slug: string;
  background: BackgroundConfig;
  header: HeaderConfig;
  card: CardConfig;
  modal: ModalConfig;
  socials: SocialsConfig;
}

/** Version partielle pour les overrides par resto */
export type PartialRestaurantConfig = {
  slug: string;
  background?: Partial<BackgroundConfig>;
  header?: Partial<HeaderConfig>;
  card?: Partial<CardConfig>;
  modal?: Partial<ModalConfig>;
  socials?: Partial<SocialsConfig>;
};