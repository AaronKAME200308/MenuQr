// types.ts — v8 (N-à-N categories)
// Changement : category_id: string → category_ids: string[]

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
  main: string;
}

/** Labels UI déjà traduits, construits dans MenuPage via t() */
export interface TextConfig {
  prix:        string;
  variants:    string;
  ingredients: string;
  description: string;
  disponible:  string;
  spicy:       string;
  vegetarian:   string;
}

// ─────────────────────────────────────────────────────────────
// i18n
// ─────────────────────────────────────────────────────────────

export type SupportedLang = "fr" | "en" | "de" | "ar" | string;

export interface LangMeta {
  code:  SupportedLang;
  label: string;
  flag:  string;
  dir?:  "ltr" | "rtl";
}

export type UITranslations   = Record<string, string>;
export type UITranslationMap = Record<SupportedLang, UITranslations>;

// ─────────────────────────────────────────────────────────────
// Supabase rows
// ─────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  restaurant_id: string;
  /**
   * Tableau des IDs de catégories auxquelles appartient cet item.
   * Remplace l'ancien champ scalaire category_id (relation 1-N).
   * Peuplé depuis menu_item_categories via la requête Supabase.
   */
  category_ids: string[];
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
  name_translations?:        Record<SupportedLang, string>;
  description_translations?: Record<SupportedLang, string>;
  /** Promotion active ou non */
  promotion_active?:              boolean;
  /** Pourcentage de réduction (ex : 20 → -20%) */
  promotion?:                     number;
  /** Nom de la promotion dans la langue par défaut */
  promotion_name?:                string;
  /** Traductions du nom de la promotion */
  promotion_name_translations?:   Record<SupportedLang, string>;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  icon?: string;
  sort_order: number;
  created_at: string;
  name_translations?: Record<SupportedLang, string>;
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
  color_main: string;
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
  mail?: string;
  created_at: string;
  currency?: string;
  supported_languages?:   SupportedLang[];
  default_language?:      SupportedLang;
  name_translations?:     Record<SupportedLang, string>;
  tagline_translations?:  Record<SupportedLang, string>;
  address_translations?:  Record<SupportedLang, string>;
}

// ─────────────────────────────────────────────────────────────
// RestaurantConfig — Hero
// ─────────────────────────────────────────────────────────────

export interface BackgroundConfig {
  patternTop: "diamonds" | "grid" | "dots" | "none";
  patternBottom: "diamonds" | "grid" | "dots" | "none";
  patternTopOpacity: number;
  patternBottomOpacity: number;
  blobTopLeft: boolean;
  blobBottomRight: boolean;
}

export interface HeroBackground {
  color: string;
  type: "solid" | "gradient" | "image";
  /** Active le fond image (priorité sur type) */
  useImage?: boolean;
  imageUrl?: string;
  /** Overlay semi-transparent sur l'image ex: "rgba(0,0,0,0.45)" */
  imageOverlay?: string;
  /** Position de l'image — défaut "center" */
  imagePosition?: string;
  gradient?: { angle?: number; stops: { color: string; pos: number }[] };
  pattern?: "dots" | "lines" | "diamonds" | "none";
  patternColor?: string;
  patternOpacity?: number;
  shape?: "arc" | "diagonal" | "wave" | "full" | "none";
  shapeColor?: string;
  shapeCoverage?: number;
}

export interface HeroLogo {
  show: boolean;
  size?: number;
  shape?: "circle" | "square" | "none";
  borderColor?: string;
  background?: string;
  pulse?: boolean;
  pulseColor?: string;
  position?: "top-center" | "top-left" | "inline-left";
  src?: string;
  fallbackEmoji?: string;
}

export interface HeroTitle {
  show: boolean;
  mode?: "big-editorial" | "restaurant-name" | "custom" | "stacked";
  customText?: string;
  stackedLines?: string[];
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  color?: string;
  letterSpacing?: string;
  lineHeight?: number;
  textShadow?: string;
  uppercase?: boolean;
  align?: "left" | "center" | "right";
}

export interface HeroSubtitle {
  show: boolean;
  text?: string;
  fontSize?: string;
  fontFamily?: string;
  color?: string;
  letterSpacing?: string;
  fontStyle?: "normal" | "italic";
}

export interface HeroDivider {
  show: boolean;
  style?: "line" | "dots" | "ornament" | "wave";
  color?: string;
  width?: number;
  thickness?: number;
  ornamentChar?: string;
}

export interface HeroTagline {
  show: boolean;
  text?: string;
  fontSize?: string;
  color?: string;
  letterSpacing?: string;
  fontFamily?: string;
  fontStyle?: "normal" | "italic";
}

export interface HeroFooterBand {
  show: boolean;
  background?: string;
  paddingY?: number;
  showAddress?: boolean;
  addressColor?: string;
  addressIcon?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  badgeTextTranslations?: Record<SupportedLang, string>;
  badgeBackground?: string;
  badgeColor?: string;
}

export interface HeaderConfig {
  layout?: "vertical" | "banner";
  minHeight?: string;
  paddingX?: string;
  align?: "left" | "center" | "right";
  parallax?: boolean;
  background: HeroBackground;
  logo: HeroLogo;
  title: HeroTitle;
  subtitle: HeroSubtitle;
  divider: HeroDivider;
  tagline: HeroTagline;
  footer: HeroFooterBand;
  showBigMenu?: boolean;
}

// ─────────────────────────────────────────────────────────────
// RestaurantConfig — reste
// ─────────────────────────────────────────────────────────────

export interface CardConfig {
  layout: "grid" | "list";
  gridMinWidth: number;
  borderRadius: number;
  showFloatingImage: boolean;
  imageFloat: boolean;
  showIndex: boolean;
  showBadges: boolean;
  showDescription: boolean;
  showDietIcons: boolean;
}

export interface ModalConfig {
  heroEmojis: [string, string];
  showHeroTexture: boolean;
  heroShape: "blob" | "straight";
  labelIngredients: string;
  labelDescription: string;
  labelVariants: string;
  showIngredients: boolean;
  showVariants: boolean;
}

export interface SocialsConfig {
  sectionLabel: string;
  layout: "grid" | "row";
  gridMinWidth: number;
}

// ─────────────────────────────────────────────────────────────
// I18nConfig
// ─────────────────────────────────────────────────────────────

export interface I18nConfig {
  defaultLanguage: SupportedLang;
  supportedLanguages?: SupportedLang[];
  heroTitleLines?: Record<SupportedLang, string[]>;
  socialsLabel?: Record<SupportedLang, string>;
}

// ─────────────────────────────────────────────────────────────
// RestaurantConfig complète
// ─────────────────────────────────────────────────────────────

export interface RestaurantConfig {
  slug: string;
  background: BackgroundConfig;
  header: HeaderConfig;
  card: CardConfig;
  modal: ModalConfig;
  socials: SocialsConfig;
  i18n?: I18nConfig;
}

export type PartialRestaurantConfig = {
  slug: string;
  background?: Partial<BackgroundConfig>;
  header?: Partial<HeaderConfig>;
  card?: Partial<CardConfig>;
  modal?: Partial<ModalConfig>;
  socials?: Partial<SocialsConfig>;
  i18n?: Partial<I18nConfig>;
};