// types.ts — v6 (i18n complet : name + tagline + address + hero)

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
  // i18n
  name_translations?:        Record<SupportedLang, string>;
  description_translations?: Record<SupportedLang, string>;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  icon?: string;
  sort_order: number;
  created_at: string;
  // i18n
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
  currency?: string;
  // i18n
  supported_languages?:   SupportedLang[];
  default_language?:      SupportedLang;
  name_translations?:     Record<SupportedLang, string>;   // ← nouveau
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
  gradient?: { angle?: number; stops: { color: string; pos: number }[] };
  imageUrl?: string;
  imageOverlay?: string;
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
  /** Fallback statique quand i18n.heroTitleLines est absent */
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
  /** Override statique. Si absent : utilise le name traduit depuis la BD. */
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
  /** Override statique. Si absent : utilise tagline traduit depuis la BD. */
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
  /** Texte statique fallback */
  badgeText?: string;
  /**
   * Traductions du badge par langue — prioritaire sur badgeText.
   * { fr: "Ouvert maintenant", en: "Open now", de: "Jetzt geöffnet" }
   */
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
  /** Langue par défaut (override de restaurant.default_language) */
  defaultLanguage: SupportedLang;
  /** Langues du sélecteur (override de restaurant.supported_languages) */
  supportedLanguages?: SupportedLang[];

  /**
   * Traductions des lignes du titre hero (mode "stacked").
   * {
   *   fr: ["Street Food", "Camerounaise"],
   *   en: ["Cameroonian", "Street Food"],
   *   de: ["Kamerunisches", "Streetfood"],
   * }
   */
  heroTitleLines?: Record<SupportedLang, string[]>;

  /**
   * Traductions du label section socials.
   * { fr: "🌍 Rejoins la communauté", en: "🌍 Join us", de: "🌍 Mach mit" }
   */
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