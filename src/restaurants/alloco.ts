// alloco.ts — Street food camerounaise
// DA : Jaune Plantain #F5C518 · Vert Nature #2E7D32 · Blanc · Noir texte
// Layout : bannière horizontale 260px — texte gauche / logo droite

import type { PartialRestaurantConfig } from "../components/types";

const allocoConfig: PartialRestaurantConfig = {
  slug: "alloco",

  background: {
    patternTop: "diamonds",
    patternBottom: "grid",
    patternTopOpacity: 0.06,
    patternBottomOpacity: 0.04,
    blobTopLeft: true,
    blobBottomRight: true,
  },

  header: {
    // ── Layout bannière horizontale ───────────────────────────────────────────
    layout: "banner",
    minHeight: "260px",
    paddingX: "32px",
    parallax: false,

    // Zone : fond
    // Fond vert nature plein — couleur dominante de la bannière
    // Texture dots jaune plantain très subtile sur tout le fond
    background: {
      type: "solid",
      color: "#2E7D32",
      pattern: "dots",
      patternColor: "#F5C518",
      patternOpacity: 0.07,
      shape: "none",
    },

    // Zone : logo
    // Cercle blanc en haut à droite — grand, iconique, pas de pulse
    // (le pulse est trop agité pour une bannière statique)
    logo: {
      show: true,
      size: 180,
      shape: "circle",
      borderColor: "#F5C51860",
      background: "rgba(255,255,255,0.10)",
      pulse: false,
      position: "top-center",
      fallbackEmoji: "🍌",
    },

    // Zone : titre
    // "Street Food Camerounaise" en Bebas Neue — grand, blanc, impact maximal
    title: {
      show: true,
      mode: "stacked",
      stackedLines: ["Street Food", "Camerounaise"],
      fontSize: "clamp(36px, 8vw, 64px)",
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 400,
      color: "#FFFFFF",
      letterSpacing: "0.02em",
      lineHeight: 0.92,
      textShadow: "0 4px 20px rgba(0,0,0,0.15)",
      uppercase: true,
      align: "left",
    },

    // Zone : sous-titre — nom du restaurant en jaune plantain
    subtitle: {
      show: true,
      fontSize: "clamp(13px, 3vw, 18px)",
      fontFamily: "'Montserrat', sans-serif",
      color: "#F5C518",
      letterSpacing: "0.22em",
      fontStyle: "normal",
    },

    // Zone : divider — ligne jaune courte
    divider: {
      show: true,
      style: "line",
      color: "#F5C518",
      width: 40,
      thickness: 2,
    },

    // Zone : tagline
    tagline: {
      show: true,
      fontSize: "11px",
      color: "rgba(255,255,255,0.55)",
      letterSpacing: "0.12em",
      fontFamily: "'Montserrat', sans-serif",
    },

    // Zone : footer — désactivé sur bannière (pas de bande basse)
    footer: {
      show: false,
    },
  },

  card: {
    layout: "grid",
    gridMinWidth: 155,
    borderRadius: 16,
    showFloatingImage: true,
    imageFloat: true,
    showIndex: false,
    showBadges: true,
    showDescription: true,
    showDietIcons: true,
  },

  modal: {
    heroEmojis: ["🌿", "🍌"],
    showHeroTexture: true,
    heroShape: "blob",
    labelIngredients: "Ingrédients",
    labelDescription: "Description",
    labelVariants: "Taille",
    showIngredients: true,
    showVariants: true,
  },

  socials: {
    sectionLabel: "🌍 Rejoins la communauté Alloco",
    layout: "grid",
    gridMinWidth: 150,
  },
};

export default allocoConfig;