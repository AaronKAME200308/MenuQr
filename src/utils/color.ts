// utils/colors.ts
// Construit l'objet Colors depuis les colonnes du restaurant (avec fallbacks).
// Utilisable dans MenuPage, la page 404, et tout autre contexte.

import type { Colors, Restaurant } from "../components/types";

export const DEFAULT_COLORS: Colors = {
  bg:      "#0a2e20",
  primary: "#F5E6C8",
  accent:  "#1a5c3a",
  card:    "#0d3d28",
  main:    "#F5E6C8",
};

export function buildColors(restaurant: Restaurant | null): Colors {
  return {
    bg:      restaurant?.color_bg      ?? DEFAULT_COLORS.bg,
    primary: restaurant?.color_primary ?? DEFAULT_COLORS.primary,
    accent:  restaurant?.color_accent  ?? DEFAULT_COLORS.accent,
    card:    restaurant?.color_card    ?? DEFAULT_COLORS.card,
    main:    restaurant?.color_main    ?? DEFAULT_COLORS.main,
  };
}