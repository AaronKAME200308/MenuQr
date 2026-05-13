// src/restaurants/mon-resto.ts
// ─────────────────────────────────────────────────────────────
// Exemple de config pour le restaurant dont le slug est "mon-resto".
// Tu ne mets ICI que ce qui DIFFÈRE du default — le reste est hérité.
// ─────────────────────────────────────────────────────────────

import type { PartialRestaurantConfig } from "../components/types";

const config: PartialRestaurantConfig = {
  slug: "mon-resto",

  // Fond différent : pas de pattern, juste les blobs
  background: {
    patternTop: "none",
    patternBottom: "dots",
    patternBottomOpacity: 0.04,
  },

  // Header sans le grand "MENU" — affiche un titre custom à la place
  header: {
    showBigMenu: false,
    heroTitle: "Notre Carte",
    arcTexture: "none",
    logoPulse: false,
  },

  // Cartes en liste plutôt qu'en grille, sans animation de lévitation
  card: {
    layout: "list",
    imageFloat: false,
    showIndex: false,
    borderRadius: 16,
  },

  // Modal avec des emojis et labels custom
  modal: {
    heroEmojis: ["🌶️", "🧄"],
    labelIngredients: "Composition",
    labelDescription: "À propos du plat",
    labelVariants: "Format",
  },

  // Socials en ligne horizontale
  socials: {
    sectionLabel: "📲 Suivez-nous",
    layout: "row",
  },
};

export default config;