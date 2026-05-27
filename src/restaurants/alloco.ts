// alloco.ts — v2 (i18n complet)
// Langue par défaut : fr. Langues disponibles : fr, en, de.
// Les traductions BD (items/categories) sont dans alloco_translations_de.sql.
// Les textes du hero et des socials sont ici dans i18n.

import type { PartialRestaurantConfig } from "../components/types";

const allocoConfig: PartialRestaurantConfig = {
  slug: "alloco",

  background: {
    patternTop:           "diamonds",
    patternBottom:        "grid",
    patternTopOpacity:    0.06,
    patternBottomOpacity: 0.04,
    blobTopLeft:          true,
    blobBottomRight:      true,
  },

  header: {
    layout:   "banner",
    minHeight: "260px",
    paddingX:  "32px",
    parallax:  false,

    background: {
      type:           "solid",
      color:          "#2E7D32",
      pattern:        "dots",
      patternColor:   "#F5C518",
      patternOpacity: 0.07,
      shape:          "none",
    },

    logo: {
      show:          true,
      size:          180,
      shape:         "circle",
      borderColor:   "#F5C51860",
      background:    "rgba(255,255,255,0.10)",
      pulse:         false,
      position:      "top-center",
      fallbackEmoji: "🍌",
    },

    title: {
      show:          true,
      mode:          "stacked",
      // Fallback statique (si i18n.heroTitleLines est absent)
      stackedLines:  ["Street Food", "Camerounaise"],
      fontSize:      "clamp(36px, 8vw, 64px)",
      fontFamily:    "'Bebas Neue', sans-serif",
      fontWeight:    400,
      color:         "#FFFFFF",
      letterSpacing: "0.02em",
      lineHeight:    0.92,
      textShadow:    "0 4px 20px rgba(0,0,0,0.15)",
      uppercase:     true,
      align:         "left",
    },

    subtitle: {
      show:          true,
      fontSize:      "clamp(13px, 3vw, 18px)",
      fontFamily:    "'Montserrat', sans-serif",
      color:         "#F5C518",
      letterSpacing: "0.22em",
      fontStyle:     "normal",
    },

    divider: {
      show:      true,
      style:     "line",
      color:     "#F5C518",
      width:     40,
      thickness: 2,
    },

    tagline: {
      show:          true,
      fontSize:      "11px",
      color:         "rgba(255,255,255,0.55)",
      letterSpacing: "0.12em",
      fontFamily:    "'Montserrat', sans-serif",
    },

    footer: {
      show:      false,
      showBadge: true,
      badgeText: "Ouvert maintenant",
      // Traductions du badge footer (si footer.show passe à true un jour)
      badgeTextTranslations: {
        fr: "Ouvert maintenant",
        en: "Open now",
        de: "Jetzt geöffnet",
      },
      badgeBackground: "#F5C518",
      badgeColor:      "#1a3a00",
    },
  },

  card: {
    layout:            "grid",
    gridMinWidth:      155,
    borderRadius:      16,
    showFloatingImage: true,
    imageFloat:        true,
    showIndex:         false,
    showBadges:        true,
    showDescription:   true,
    showDietIcons:     true,
  },

  modal: {
    heroEmojis:       ["🌿", "🍌"],
    showHeroTexture:  true,
    heroShape:        "blob",
    labelIngredients: "Ingrédients",
    labelDescription: "Description",
    labelVariants:    "Taille",
    showIngredients:  true,
    showVariants:     true,
  },

  socials: {
    sectionLabel: "🌍 Rejoins la communauté Alloco",
    layout:       "grid",
    gridMinWidth: 150,
  },

  // ── i18n ────────────────────────────────────────────────────
  i18n: {
    defaultLanguage:    "de",
    supportedLanguages: ["fr", "en", "de"],

    // Lignes du titre hero traduites par langue
    heroTitleLines: {
      fr: ["Street Food", "Camerounaise"],
      en: ["Cameroonian",  "Street Food"],
      de: ["Kamerunisches", "Streetfood"],
    },

    // Label de la section socials
    socialsLabel: {
      fr: "🌍 Rejoins la communauté Alloco",
      en: "🌍 Join the Alloco community",
      de: "🌍 Werde Teil der Alloco-Community",
    },
  },
};

export default allocoConfig;