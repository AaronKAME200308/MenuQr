// hooks/useLanguage.ts — v5
// Fix définitif langue BD :
//   - useState initialisé à null (langue inconnue avant fetch)
//   - useEffect applique restaurant.default_language dès qu'il arrive
//   - lang affiché = lang ?? "fr" (jamais null vers les enfants)
//   - userOverride empêche la BD de ré-écraser le choix manuel

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
// Chaînes UI
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
    label_prix:            "Prix",
    label_disponible:      "Disponible",
    label_voir:            "voir →",
    label_appeler:         "Appeler",
    label_email:           "Email",
    label_tailles:         "taille",
    label_vegetarian:      "Végétarien",
    label_spicy:           "Épicé",
    label_bestseller:      "Best Seller",
    label_popular:         "Populaire",
    label_new:             "Nouveau",
    all_categories:        "Tout",
    label_offert:          "Offert",
    label_allergenes:      "Allergènes",
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
    label_prix:            "Price",
    label_disponible:      "Available",
    label_voir:            "view →",
    label_appeler:         "Call",
    label_email:           "Email",
    label_tailles:         "size",
    label_vegetarian:      "Vegetarian",
    label_spicy:           "Spicy",
    label_bestseller:      "Best Seller",
    label_popular:         "Popular",
    label_new:             "New",
    all_categories:        "All",
    label_offert:          "Free",
    label_allergenes:      "Allergens",
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
    label_prix:            "Preis",
    label_disponible:      "Verfügbar",
    label_voir:            "ansehen →",
    label_appeler:         "Anrufen",
    label_email:           "E-Mail",
    label_tailles:         "Größe",
    label_vegetarian:      "Vegetarisch",
    label_spicy:           "Scharf",
    label_bestseller:      "Bestseller",
    label_popular:         "Beliebt",
    label_new:             "Neu",
    all_categories:        "Alle",
    label_offert:          "Gratis",
    label_allergenes:      "Allergene",
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
    label_prix:            "السعر",
    label_disponible:      "متاح",
    label_voir:            "عرض →",
    label_appeler:         "اتصال",
    label_email:           "البريد",
    label_tailles:         "حجم",
    label_vegetarian:      "نباتي",
    label_spicy:           "حار",
    label_bestseller:      "الأكثر مبيعاً",
    label_popular:         "شائع",
    label_new:             "جديد",
    all_categories:        "الكل",
    label_offert:          "مجاني",
    label_allergenes:      "مسببات الحساسية",
  },
};

function getUIString(lang: SupportedLang, key: string): string {
  return UI_STRINGS[lang]?.[key] ?? UI_STRINGS["fr"]?.[key] ?? key;
}

function resolveField(
  translations: Record<string, string> | undefined,
  fallback: string,
  lang: SupportedLang,
  // defaultLang: SupportedLang,
): string {

  // Le français est toujours la valeur de base en BD
  // donc on retourne directement fallback
  if (lang === "fr") {
    return fallback;
  }

  // Si pas de traductions → fallback
  if (!translations) {
    return fallback;
  }

  // Traduction demandée
  const translated = translations[lang];

  // Si absente → fallback FR
  return translated ?? fallback;
}


function applyLangToDOM(lang: SupportedLang): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  document.documentElement.dir  = LANG_META[lang]?.dir ?? "ltr";
}

// ─────────────────────────────────────────────────────────────
// Type de retour
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

  // ── État interne ─────────────────────────────────────────────
  // null = langue pas encore résolue (restaurant pas encore chargé).
  // On n'expose jamais null vers l'extérieur (voir `resolvedLang` plus bas).
  const [lang, setLangState]         = useState<SupportedLang | null>(null);
  const [userOverride, setUserOverride] = useState<boolean>(false);

  // ── Résolution de la langue initiale ─────────────────────────
  // Ordre de priorité :
  //   1. config.i18n.defaultLanguage  → statique, dispo dès le 1er render
  //   2. restaurant.default_language  → dynamique, arrive après le fetch Supabase
  //   3. "fr"                         → fallback ultime
  //
  // On écoute les deux sources séparément pour réagir dès que l'une change.
  useEffect(() => {
    if (userOverride) return; // l'utilisateur a choisi — on ne touche plus à rien

    // Source 1 : config locale (dispo immédiatement, pas de fetch)
    if (config?.i18n?.defaultLanguage) {
      const target = config.i18n.defaultLanguage;
      setLangState(prev => (prev === target ? prev : target));
      applyLangToDOM(target);
      return;
    }

    // Source 2 : BD Supabase (arrive après le fetch)
    if (restaurant?.default_language) {
      const target = restaurant.default_language as SupportedLang;
      setLangState(prev => (prev === target ? prev : target));
      applyLangToDOM(target);
      return;
    }

    // Source 3 : fallback "fr" si rien d'autre n'est dispo
    setLangState(prev => (prev === null ? "fr" : prev));
  }, [
    config?.i18n?.defaultLanguage,
    restaurant?.default_language,
    userOverride,
  ]);

  // ── Changement manuel ─────────────────────────────────────────
  const setLang = useCallback((l: SupportedLang): void => {
    setUserOverride(true);
    setLangState(l);
    applyLangToDOM(l);
  }, []);

  // ── Langue résolue (jamais null vers les enfants) ─────────────
  // Pendant le bref instant avant que le useEffect ci-dessus tourne,
  // on affiche "fr" pour éviter un flash de contenu vide.
  const resolvedLang: SupportedLang = lang ?? "fr";

  // ── defaultLang pour les fallbacks tField ─────────────────────
  const defaultLang: SupportedLang = useMemo(() =>
    config?.i18n?.defaultLanguage ??
    (restaurant?.default_language as SupportedLang | undefined) ??
    "fr",
  [config?.i18n?.defaultLanguage, restaurant?.default_language]);

  // ── Langues disponibles ───────────────────────────────────────
  // Ordre depuis la BD : reflect l'ordre voulu par le gérant du restaurant.
  const supportedCodes: SupportedLang[] = useMemo(() =>
    config?.i18n?.supportedLanguages ??
    restaurant?.supported_languages  ??
    ["fr"],
  [config?.i18n?.supportedLanguages, restaurant?.supported_languages]);

  // ─────────────────────────────────────────────────────────────
  // Helpers traduction
  // ─────────────────────────────────────────────────────────────

  const t = useCallback(
    (key: string): string => getUIString(resolvedLang, key),
    [resolvedLang],
  );

  const tField = useCallback(
    (translations: Record<string, string> | undefined, fallback: string): string =>
      resolveField(translations, fallback, resolvedLang),
    [resolvedLang, defaultLang],
  );

  const tHeroLines = useCallback(
    (cfg: RestaurantConfig): string[] => {
      const map = cfg.i18n?.heroTitleLines;
      if (!map) return cfg.header.title.stackedLines ?? [];
      return (
        map[resolvedLang]  ??
        map[defaultLang]   ??
        map["fr"]          ??
        cfg.header.title.stackedLines ??
        []
      );
    },
    [resolvedLang, defaultLang],
  );

  const tBadge = useCallback(
    (footer: RestaurantConfig["header"]["footer"]): string => {
      const map = footer.badgeTextTranslations;
      if (!map) return footer.badgeText ?? "";
      return (
        map[resolvedLang] ??
        map[defaultLang]  ??
        map["fr"]         ??
        footer.badgeText  ??
        ""
      );
    },
    [resolvedLang, defaultLang],
  );

  const tSocialsLabel = useCallback(
    (cfg: RestaurantConfig): string => {
      const map = cfg.i18n?.socialsLabel;
      if (!map) return cfg.socials.sectionLabel;
      return (
        map[resolvedLang] ??
        map[defaultLang]  ??
        map["fr"]         ??
        cfg.socials.sectionLabel
      );
    },
    [resolvedLang, defaultLang],
  );

  // ─────────────────────────────────────────────────────────────
  // Méta
  // ─────────────────────────────────────────────────────────────

  const langMeta = useMemo<LangMeta>(
    () => LANG_META[resolvedLang] ?? { code: resolvedLang, label: resolvedLang, flag: "🌐", dir: "ltr" },
    [resolvedLang],
  );

  const availableLangs = useMemo<LangMeta[]>(
    () => supportedCodes.map(
      c => LANG_META[c] ?? { code: c, label: c, flag: "🌐", dir: "ltr" },
    ),
    [supportedCodes],
  );

  return {
    lang:           resolvedLang,
    setLang,
    t,
    tField,
    tHeroLines,
    tBadge,
    tSocialsLabel,
    langMeta,
    availableLangs,
    isRTL:          langMeta.dir === "rtl",
  };
}