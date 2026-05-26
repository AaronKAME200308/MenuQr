// hooks/useLanguage.ts — v3
// Expose tField() pour la BD + tHeroLines() + tBadge() + tSocialsLabel()
// + tRestaurantName() pour le name traduit du restaurant.

import { useState, useCallback, useMemo } from "react";
import type {
  Restaurant,
  RestaurantConfig,
  SupportedLang,
  LangMeta,
  UITranslations,
} from "../components/types";

// ─────────────────────────────────────────────────────────────
// Métadonnées des langues
// ─────────────────────────────────────────────────────────────

export const LANG_META: Record<string, LangMeta> = {
  fr: { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  en: { code: "en", label: "English",  flag: "🇬🇧", dir: "ltr" },
  de: { code: "de", label: "Deutsch",  flag: "🇩🇪", dir: "ltr" },
  ar: { code: "ar", label: "العربية",  flag: "🇸🇦", dir: "rtl" },
  es: { code: "es", label: "Español",  flag: "🇪🇸", dir: "ltr" },
};

// ─────────────────────────────────────────────────────────────
// Chaînes UI par langue
// ─────────────────────────────────────────────────────────────

const UI_STRINGS: Record<string, UITranslations> = {
  fr: {
    search_placeholder:    "Rechercher un plat…",
    search_results:        "résultat",
    search_results_plural: "résultats",
    search_empty:          "Aucun plat trouvé pour",
    loading:               "CHARGEMENT…",
    restaurant_not_found:  "Restaurant introuvable.",
    digital_menu:          "Menu numérique",
    powered_by:            "Propulsé par MenuQR",
    badge_bestseller:      "Best Seller",
    badge_popular:         "Populaire",
    badge_new:             "Nouveau",
    label_sizes:           "tailles",
    label_ingredients:     "Ingrédients",
    label_description:     "Description",
    label_variants:        "Taille",
    all_categories:        "Tout",
  },
  en: {
    search_placeholder:    "Search a dish…",
    search_results:        "result",
    search_results_plural: "results",
    search_empty:          "No dish found for",
    loading:               "LOADING…",
    restaurant_not_found:  "Restaurant not found.",
    digital_menu:          "Digital menu",
    powered_by:            "Powered by MenuQR",
    badge_bestseller:      "Best Seller",
    badge_popular:         "Popular",
    badge_new:             "New",
    label_sizes:           "sizes",
    label_ingredients:     "Ingredients",
    label_description:     "Description",
    label_variants:        "Size",
    all_categories:        "All",
  },
  de: {
    search_placeholder:    "Gericht suchen…",
    search_results:        "Ergebnis",
    search_results_plural: "Ergebnisse",
    search_empty:          "Kein Gericht gefunden für",
    loading:               "LADEN…",
    restaurant_not_found:  "Restaurant nicht gefunden.",
    digital_menu:          "Digitale Speisekarte",
    powered_by:            "Bereitgestellt von MenuQR",
    badge_bestseller:      "Bestseller",
    badge_popular:         "Beliebt",
    badge_new:             "Neu",
    label_sizes:           "Größen",
    label_ingredients:     "Zutaten",
    label_description:     "Beschreibung",
    label_variants:        "Größe",
    all_categories:        "Alle",
  },
  ar: {
    search_placeholder:    "ابحث عن طبق…",
    search_results:        "نتيجة",
    search_results_plural: "نتائج",
    search_empty:          "لم يتم العثور على طبق لـ",
    loading:               "جاري التحميل…",
    restaurant_not_found:  "المطعم غير موجود.",
    digital_menu:          "قائمة رقمية",
    powered_by:            "مدعوم من MenuQR",
    badge_bestseller:      "الأكثر مبيعاً",
    badge_popular:         "شائع",
    badge_new:             "جديد",
    label_sizes:           "أحجام",
    label_ingredients:     "المكونات",
    label_description:     "الوصف",
    label_variants:        "الحجم",
    all_categories:        "الكل",
  },
};

function getUIString(lang: SupportedLang, key: string): string {
  return UI_STRINGS[lang]?.[key] ?? UI_STRINGS["fr"]?.[key] ?? key;
}

// ─────────────────────────────────────────────────────────────
// Résolution générique d'un champ JSONB avec chaîne de fallback
// ─────────────────────────────────────────────────────────────

function resolveField(
  translations: Record<string, string> | undefined,
  fallback:     string,
  lang:         SupportedLang,
  defaultLang:  SupportedLang,
): string {
  if (!translations) return fallback;
  return (
    translations[lang]        ??
    translations[defaultLang] ??
    translations["fr"]        ??
    fallback
  );
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export type UseLanguageResult = {
  lang:           SupportedLang;
  setLang:        (l: SupportedLang) => void;
  /** Traduit une clé UI (loading, search_placeholder, etc.) */
  t:              (key: string) => string;
  /**
   * Résout n'importe quel champ JSONB de la BD.
   *   tField(item.name_translations, item.name)
   *   tField(restaurant.tagline_translations, restaurant.tagline ?? "")
   *   tField(restaurant.name_translations, restaurant.name)   ← nouveau
   */
  tField:         (translations: Record<string, string> | undefined, fallback: string) => string;
  /**
   * Résout les lignes du titre hero (mode "stacked").
   * Priorité : i18n.heroTitleLines[lang] → title.stackedLines → []
   */
  tHeroLines:     (config: RestaurantConfig) => string[];
  /**
   * Résout le badgeText du footer hero.
   * Priorité : footer.badgeTextTranslations[lang] → footer.badgeText → ""
   */
  tBadge:         (footer: RestaurantConfig["header"]["footer"]) => string;
  /**
   * Résout le sectionLabel des socials.
   * Priorité : i18n.socialsLabel[lang] → socials.sectionLabel
   */
  tSocialsLabel:  (config: RestaurantConfig) => string;
  langMeta:       LangMeta;
  availableLangs: LangMeta[];
  isRTL:          boolean;
};

export function useLanguage(
  restaurant: Pick<Restaurant, "supported_languages" | "default_language"> | null,
  config?:    RestaurantConfig,
): UseLanguageResult {

  const defaultLang: SupportedLang =
    config?.i18n?.defaultLanguage ??
    restaurant?.default_language  ??
    "fr";

  const supportedCodes: SupportedLang[] =
    config?.i18n?.supportedLanguages ??
    restaurant?.supported_languages  ??
    ["fr"];

  const [lang, setLangState] = useState<SupportedLang>(defaultLang);

  const setLang = useCallback((l: SupportedLang) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.documentElement.dir  = LANG_META[l]?.dir ?? "ltr";
      document.documentElement.lang = l;
    }
  }, []);

  // ── Helpers mémoïsés ────────────────────────────────────────

  const t = useCallback(
    (key: string) => getUIString(lang, key),
    [lang],
  );

  const tField = useCallback(
    (translations: Record<string, string> | undefined, fallback: string) =>
      resolveField(translations, fallback, lang, defaultLang),
    [lang, defaultLang],
  );

  const tHeroLines = useCallback(
    (cfg: RestaurantConfig): string[] => {
      const map = cfg.i18n?.heroTitleLines;
      if (map) {
        return (
          map[lang]        ??
          map[defaultLang] ??
          map["fr"]        ??
          cfg.header.title.stackedLines ??
          []
        );
      }
      return cfg.header.title.stackedLines ?? [];
    },
    [lang, defaultLang],
  );

  const tBadge = useCallback(
    (footer: RestaurantConfig["header"]["footer"]): string => {
      const map = footer.badgeTextTranslations;
      if (map) {
        return (
          map[lang]        ??
          map[defaultLang] ??
          map["fr"]        ??
          footer.badgeText ??
          ""
        );
      }
      return footer.badgeText ?? "";
    },
    [lang, defaultLang],
  );

  const tSocialsLabel = useCallback(
    (cfg: RestaurantConfig): string => {
      const map = cfg.i18n?.socialsLabel;
      if (map) {
        return (
          map[lang]        ??
          map[defaultLang] ??
          map["fr"]        ??
          cfg.socials.sectionLabel
        );
      }
      return cfg.socials.sectionLabel;
    },
    [lang, defaultLang],
  );

  // ── Méta ────────────────────────────────────────────────────

  const langMeta = useMemo<LangMeta>(
    () => LANG_META[lang] ?? { code: lang, label: lang, flag: "🌐", dir: "ltr" },
    [lang],
  );

  const availableLangs = useMemo<LangMeta[]>(
    () => supportedCodes.map(c => LANG_META[c] ?? { code: c, label: c, flag: "🌐", dir: "ltr" }),
    [supportedCodes],
  );

  const isRTL = langMeta.dir === "rtl";

  return {
    lang, setLang,
    t, tField,
    tHeroLines, tBadge, tSocialsLabel,
    langMeta, availableLangs, isRTL,
  };
}