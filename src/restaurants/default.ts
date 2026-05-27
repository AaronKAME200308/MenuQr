// restaurants/default.ts — v2 (i18n inclus)
// Config par défaut complète. Tous les restos overrident partiellement celle-ci.

import type { RestaurantConfig } from "../components/types";

const defaultConfig: RestaurantConfig = {
  slug: "default",

  // ── Fond de page ────────────────────────────────────────────
  background: {
    patternTop:           "diamonds",
    patternBottom:        "grid",
    patternTopOpacity:    0.055,
    patternBottomOpacity: 0.065,
    blobTopLeft:          true,
    blobBottomRight:      true,
  },

  // ── Header / Hero ────────────────────────────────────────────
  // Layout vertical centré, grand titre éditorial "ME\nNU"
  header: {
    layout:    "vertical",
    minHeight: "100svh",
    paddingX:  "24px",
    align:     "center",
    parallax:  true,

    background: {
      type:    "solid",
      color:   "#0a2e20",
      pattern: "dots",
      patternColor:   "#F5E6C8",
      patternOpacity: 0.045,
      shape:   "none",
    },

    logo: {
      show:          true,
      size:          90,
      shape:         "circle",
      borderColor:   "#F5E6C840",
      background:    "rgba(255,255,255,0.06)",
      pulse:         true,
      pulseColor:    "#F5E6C8",
      position:      "top-center",
      fallbackEmoji: "🍽️",
    },

    title: {
      show:          true,
      mode:          "big-editorial",
      fontSize:      "clamp(80px, 22vw, 160px)",
      fontFamily:    "Georgia, serif",
      fontWeight:    900,
      color:         "#F5E6C8",
      letterSpacing: "-0.04em",
      lineHeight:    0.88,
      textShadow:    "none",
      uppercase:     false,
      align:         "center",
    },

    subtitle: {
      show:          true,
      fontSize:      "clamp(12px, 3.5vw, 16px)",
      fontFamily:    "sans-serif",
      color:         "#F5E6C890",
      letterSpacing: "0.3em",
      fontStyle:     "normal",
    },

    divider: {
      show:      true,
      style:     "dots",
      color:     "#F5E6C840",
    },

    tagline: {
      show:          true,
      fontSize:      "11px",
      color:         "#F5E6C855",
      letterSpacing: "0.15em",
      fontFamily:    "sans-serif",
      fontStyle:     "italic",
    },

    footer: {
      show:            false,
      showAddress:     false,
      addressIcon:     true,
      addressColor:    "rgba(245,230,200,0.7)",
      showBadge:       false,
      badgeBackground: "#F5E6C8",
      badgeColor:      "#0a2e20",
    },

    showBigMenu: true,
  },

  // ── Cartes ───────────────────────────────────────────────────
  card: {
    layout:            "grid",
    gridMinWidth:      148,
    borderRadius:      20,
    showFloatingImage: true,
    imageFloat:        true,
    showIndex:         true,
    showBadges:        true,
    showDescription:   true,
    showDietIcons:     true,
  },

  // ── Modal ─────────────────────────────────────────────────────
  modal: {
    heroEmojis:       ["🥕", "🌿"],
    showHeroTexture:  true,
    heroShape:        "blob",
    labelIngredients: "Ingrédients",
    labelDescription: "Description",
    labelVariants:    "Taille",
    showIngredients:  true,
    showVariants:     true,
  },

  // ── Socials ───────────────────────────────────────────────────
  socials: {
    sectionLabel: "🤝 Rejoins-nous",
    layout:       "grid",
    gridMinWidth: 150,
  },

  // ── i18n par défaut ───────────────────────────────────────────
  // Pas de heroTitleLines ici : le titre est en mode "big-editorial"
  // et ne nécessite pas de traduction.
  i18n: {
    defaultLanguage:    "fr",
    supportedLanguages: ["fr"],
  },
};

export default defaultConfig;