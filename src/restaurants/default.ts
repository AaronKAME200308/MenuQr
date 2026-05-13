// src/restaurants/default.ts
// ─────────────────────────────────────────────────────────────
// Config par défaut — reflète exactement le rendu actuel de l'app.
// Tous les autres fichiers de resto font un override partiel de celle-ci.
// ─────────────────────────────────────────────────────────────

import type { RestaurantConfig } from "../components/types";

const defaultConfig: RestaurantConfig = {
  slug: "default",

  // ── Fond de page ──────────────────────────────────────────
  background: {
    patternTop: "diamonds",       // losanges SVG sur la moitié haute
    patternBottom: "grid",        // grille SVG sur la moitié basse
    patternTopOpacity: 0.055,
    patternBottomOpacity: 0.065,
    blobTopLeft: true,            // halo radial accent en haut à gauche
    blobBottomRight: true,        // halo radial accent en bas à droite
  },

  // ── Header / Hero ─────────────────────────────────────────
  header: {
    showBigMenu: true,            // grand "ME\nNU" éditorial
    heroTitle: undefined,
    arcTexture: "dots",           // points sur le fond coloré
    arcShape: "round",            // bas de l'arc arrondi
    logoPulse: true,              // anneau pulsant autour du logo
    showDivider: true,            // séparateur animé
    parallax: true,               // header disparaît au scroll
  },

  // ── Cartes ────────────────────────────────────────────────
  card: {
    layout: "grid",               // grille auto-fill
    gridMinWidth: 148,            // px, colonnes min
    borderRadius: 20,
    showFloatingImage: true,      // image circulaire qui dépasse en haut
    imageFloat: true,             // animation lévitation
    showIndex: true,              // numéro de l'item
    showBadges: true,             // bestseller / populaire / nouveau
    showDescription: true,        // description courte (2 lignes max)
    showDietIcons: true,          // feuille (végé) + flamme (épicé)
  },

  // ── Modal ─────────────────────────────────────────────────
  modal: {
    heroEmojis: ["🥕", "🌿"],    // décos [gauche, droite] dans le header vert
    showHeroTexture: true,        // texture feuilles SVG
    heroShape: "blob",            // bas du header en blob arrondi
    labelIngredients: "Ingrédients",
    labelDescription: "Description",
    labelVariants: "Taille",
    showIngredients: true,
    showVariants: true,
  },

  // ── Socials ───────────────────────────────────────────────
  socials: {
    sectionLabel: "🤝 Rejoins-nous",
    layout: "grid",
    gridMinWidth: 150,
  },
};

export default defaultConfig;