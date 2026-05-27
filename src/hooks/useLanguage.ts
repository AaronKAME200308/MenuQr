// hooks/useLanguage.ts — v4
// Fix : la langue par défaut issue de la BD (restaurant.default_language)
// est appliquée via useEffect dès que restaurant est chargé,
// car useState(initialValue) ne se re-exécute pas après le premier render.

import { useState, useEffect, useCallback, useMemo } from "react";
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
// Résolution d'un champ JSONB avec chaîne de fallback
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
// Type de retour du hook
// ─────────────────────────────────────────────────────────────

export interface UseLanguageResult {
  lang:           SupportedLang;
  setLang:        (l: SupportedLang) => void;
  t:              (key: string) => string;
  tField:         (translations: Record<string, string> | undefined, fallback: string) => string;
  tHeroLines:     (config: RestaurantConfig) => string[];
  tBadge:         (footer: RestaurantConfig["header"]["footer"]) => string;
  tSocialsLabel:  (config: RestaurantConfig) => string;
  langMeta:       LangMeta;
  availableLangs: LangMeta[];
  isRTL:          boolean;
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useLanguage(
  restaurant: Pick<Restaurant, "supported_languages" | "default_language"> | null,
  config?:    RestaurantConfig,
): UseLanguageResult {

  // ── Priorité de la langue par défaut ──────────────────────────
  // 1. config.i18n.defaultLanguage  (fichier resto .ts)  — statique, dispo dès le 1er render
  // 2. restaurant.default_language  (Supabase)           — arrive après le fetch
  // 3. "fr"                                              — fallback ultime
  //
  // On initialise avec ce qu'on a au 1er render (config ou "fr"),
  // puis on synchronise dès que restaurant arrive via useEffect.
  const configDefaultLang: SupportedLang =
    config?.i18n?.defaultLanguage ?? "fr";

  const [lang, setLangState] = useState<SupportedLang>(configDefaultLang);

  // ── Marqueur : l'utilisateur a-t-il changé manuellement la langue ? ──
  // Si oui, on ne réinitialise plus au chargement de restaurant.
  const [userOverride, setUserOverride] = useState<boolean>(false);

  // ── Synchronisation avec restaurant.default_language ─────────
  // S'exécute une fois dès que restaurant est non-null.
  // Ignoré si :
  //   - config.i18n.defaultLanguage est défini (la config locale a priorité)
  //   - l'utilisateur a déjà changé manuellement la langue
  useEffect(() => {
    if (userOverride)                        return; // choix utilisateur prioritaire
    if (config?.i18n?.defaultLanguage)       return; // config locale prioritaire
    if (!restaurant?.default_language)       return; // pas encore chargé

    const dbLang = restaurant.default_language as SupportedLang;

    // Ne rien faire si la langue est déjà la bonne
    setLangState(prev => prev === dbLang ? prev : dbLang);

    // Appliquer la direction RTL si nécessaire
    if (typeof document !== "undefined") {
      document.documentElement.dir  = LANG_META[dbLang]?.dir ?? "ltr";
      document.documentElement.lang = dbLang;
    }
  }, [restaurant?.default_language, config?.i18n?.defaultLanguage, userOverride]);

  // ── Changement manuel de langue ───────────────────────────────
  const setLang = useCallback((l: SupportedLang): void => {
    setUserOverride(true);
    setLangState(l);
    if (typeof document !== "undefined") {
      document.documentElement.dir  = LANG_META[l]?.dir ?? "ltr";
      document.documentElement.lang = l;
    }
  }, []);

  // ── defaultLang pour les fallbacks tField ─────────────────────
  // Priorité : config > BD > "fr"
  const defaultLang: SupportedLang = useMemo(() =>
    config?.i18n?.defaultLanguage ??
    restaurant?.default_language  ??
    "fr",
  [config?.i18n?.defaultLanguage, restaurant?.default_language]);

  // ── Langues disponibles ───────────────────────────────────────
  const supportedCodes: SupportedLang[] = useMemo(() =>
    config?.i18n?.supportedLanguages ??
    restaurant?.supported_languages  ??
    ["fr"],
  [config?.i18n?.supportedLanguages, restaurant?.supported_languages]);

  // ─────────────────────────────────────────────────────────────
  // Helpers mémoïsés
  // ─────────────────────────────────────────────────────────────

  const t = useCallback(
    (key: string): string => getUIString(lang, key),
    [lang],
  );

  const tField = useCallback(
    (
      translations: Record<string, string> | undefined,
      fallback:     string,
    ): string => resolveField(translations, fallback, lang, defaultLang),
    [lang, defaultLang],
  );

  const tHeroLines = useCallback(
    (cfg: RestaurantConfig): string[] => {
      const map = cfg.i18n?.heroTitleLines;
      if (!map) return cfg.header.title.stackedLines ?? [];
      return (
        map[lang]        ??
        map[defaultLang] ??
        map["fr"]        ??
        cfg.header.title.stackedLines ??
        []
      );
    },
    [lang, defaultLang],
  );

  const tBadge = useCallback(
    (footer: RestaurantConfig["header"]["footer"]): string => {
      const map = footer.badgeTextTranslations;
      if (!map) return footer.badgeText ?? "";
      return (
        map[lang]        ??
        map[defaultLang] ??
        map["fr"]        ??
        footer.badgeText ??
        ""
      );
    },
    [lang, defaultLang],
  );

  const tSocialsLabel = useCallback(
    (cfg: RestaurantConfig): string => {
      const map = cfg.i18n?.socialsLabel;
      if (!map) return cfg.socials.sectionLabel;
      return (
        map[lang]        ??
        map[defaultLang] ??
        map["fr"]        ??
        cfg.socials.sectionLabel
      );
    },
    [lang, defaultLang],
  );

  // ─────────────────────────────────────────────────────────────
  // Méta
  // ─────────────────────────────────────────────────────────────

  const langMeta = useMemo<LangMeta>(
    () => LANG_META[lang] ?? { code: lang, label: lang, flag: "🌐", dir: "ltr" },
    [lang],
  );

  const availableLangs = useMemo<LangMeta[]>(
    () => supportedCodes.map(
      c => LANG_META[c] ?? { code: c, label: c, flag: "🌐", dir: "ltr" },
    ),
    [supportedCodes],
  );

  const isRTL = langMeta.dir === "rtl";

  return {
    lang,
    setLang,
    t,
    tField,
    tHeroLines,
    tBadge,
    tSocialsLabel,
    langMeta,
    availableLangs,
    isRTL,
  };
}