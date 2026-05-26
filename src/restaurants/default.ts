// src/restaurants/default.ts — v2
// Config par défaut alignée sur HeaderConfig (types.ts v6).

import type { RestaurantConfig } from "../components/types";

const defaultConfig: RestaurantConfig = {
  slug: "default",

  // ── Fond de page ──────────────────────────────────────────
  background: {
    patternTop:           "diamonds",
    patternBottom:        "grid",
    patternTopOpacity:    0.055,
    patternBottomOpacity: 0.065,
    blobTopLeft:          true,
    blobBottomRight:      true,
  },

  // ── Header / Hero ─────────────────────────────────────────
  header: {
    layout:    "vertical",
    minHeight: "100svh",
    paddingX:  "24px",
    align:     "center",
    parallax:  true,

    background: {
      color:          "#0a2e20",
      type:           "solid",
      pattern:        "dots",
      patternColor:   "#ffffff",
      patternOpacity: 0.045,
      shape:          "arc",
      shapeColor:     "#0d3d28",
      shapeCoverage:  72,
    },

    logo: {
      show:        true,
      size:        90,
      shape:       "circle",
      pulse:       true,
      pulseColor:  "#F5E6C8",
      borderColor: "rgba(245,230,200,0.25)",
    },

    title: {
      show:          true,
      mode:          "big-editorial",   // grand "ME\nNU"
      fontSize:      "clamp(40px,12vw,80px)",
      fontWeight:    900,
      color:         "#F5E6C8",
      letterSpacing: "-0.03em",
      lineHeight:    1,
      uppercase:     false,
      align:         "center",
    },

    subtitle: {
      show:          false,   // restaurant.name déjà affiché via tagline
      letterSpacing: "0.15em",
    },

    divider: {
      show:      true,
      style:     "line",
      color:     "rgba(245,230,200,0.35)",
      width:     48,
      thickness: 2,
    },

    tagline: {
      show:          true,
      fontSize:      "11px",
      letterSpacing: "0.12em",
      color:         "rgba(245,230,200,0.6)",
      fontFamily:    "sans-serif",
    },

    footer: {
      show:            true,
      background:      "rgba(0,0,0,0.18)",
      paddingY:        14,
      showAddress:     true,
      addressColor:    "rgba(245,230,200,0.65)",
      addressIcon:     true,
      showBadge:       true,
      badgeText:       "Ouvert maintenant",
      badgeBackground: "#F5E6C8",
      badgeColor:      "#0a2e20",
    },

    showBigMenu: true,
  },

  // ── Cartes ────────────────────────────────────────────────
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

  // ── Modal ─────────────────────────────────────────────────
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

  // ── Socials ───────────────────────────────────────────────
  socials: {
    sectionLabel: "🤝 Rejoins-nous",
    layout:       "grid",
    gridMinWidth: 150,
  },
};

export default defaultConfig;