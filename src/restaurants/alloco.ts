// alloco.ts — v5 (useImage)

import type { PartialRestaurantConfig } from "../components/types";

const allocoConfig: PartialRestaurantConfig = {
  slug: "alloco",

  background: {
    patternTop:           "diamonds",
    patternBottom:        "grid",
    patternTopOpacity:    0.6,
    patternBottomOpacity: 0.4,
    blobTopLeft:          true,
    blobBottomRight:      true,
  },

  header: {
    layout:    "banner",
    minHeight: "260px",
    paddingX:  "32px",
    parallax:  false,

    background: {
      type:    "solid",
      color:   "#2E7D32",         // fallback si l'image ne charge pas

      // ── Image de fond ───────────────────────────────────────
      // Mettre useImage: false pour revenir au fond vert uni
      useImage:      true,
      imageUrl:      "https://hftyamydnjezbyfmsctx.supabase.co/storage/v1/object/public/Images/alloco/banner_alloco1.png",
      imageOverlay:  "rgba(46, 125, 50, 0.55)",
      imagePosition: "center",
      // ────────────────────────────────────────────────────────

      pattern:        "dots",
      patternColor:   "#ffffff",
      patternOpacity: 0.07,
      shape:          "none",
    },

    logo: {
      show:          true,
      size:          180,
      shape:         "circle",
      borderColor:   "#F5C518",
      background:    "#ffffff",
      pulse:         false,
      position:      "top-center",
      fallbackEmoji: "🍌",
    },

    title: {
      show:          true,
      mode:          "stacked",
      stackedLines:  ["Street Food", "Camerounaise"],
      fontSize:      "clamp(36px, 8vw, 64px)",
      fontFamily:    "'Bebas Neue', sans-serif",
      fontWeight:    400,
      color:         "#ffffff",
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
      color:         "rgba(255,255,255,0.65)",
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
      badgeColor:      "#1a5c3a",
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

  i18n: {
    defaultLanguage:    "de",
    supportedLanguages: ["de", "fr", "en"],
    heroTitleLines: {
      fr: ["Découvrez le style africain"],
      en: ["Taste the African Vibes"],
      de: ["Erlebe afrikanisches Flair"],
    },
    socialsLabel: {
      fr: "🌍 Rejoins la communauté Alloco",
      en: "🌍 Join the Alloco community",
      de: "🌍 Werde Teil der Alloco-Community",
    },
  },
};

export default allocoConfig;