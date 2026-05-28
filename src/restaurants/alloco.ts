// alloco.ts — v4
// defaultLanguage = "de" : allemand par défaut pour Alloco.
// supportedLanguages défini ici pour affichage immédiat du picker
// (la BD arrive de manière asynchrone — trop tard pour le premier rendu).

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
    layout:    "banner",
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
      stackedLines:  ["Street Food", "Camerounaise"], // fallback si pas de traduction
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
  // defaultLanguage et supportedLanguages DOIVENT être définis ici
  // pour que le LanguagePicker s'affiche dès le premier rendu.
  // Sans ça, le hook tombe sur le fallback ["fr"] du default.ts
  // et le picker reste caché (1 seule langue détectée).
  //
  // La BD (restaurant.default_language / supported_languages) peut
  // encore agir si userOverride = false, mais pour Alloco on fixe
  // explicitement "de" comme langue d'ouverture.
  i18n: {
    defaultLanguage:    "de",
    supportedLanguages: ["de", "fr", "en"],
    heroTitleLines: {
      fr: ["Street Food",   "Camerounaise"],
      en: ["Cameroonian",   "Street Food"],
      de: ["Kamerunisches", "Streetfood"],
    },
    socialsLabel: {
      fr: "🌍 Rejoins la communauté Alloco",
      en: "🌍 Join the Alloco community",
      de: "🌍 Werde Teil der Alloco-Community",
    },
  },
};

export default allocoConfig;