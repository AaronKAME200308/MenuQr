// hooks/useFilteredMenu.ts — v2 (typages stricts)
// Calcule les items filtrés par catégorie et par recherche.

import { useMemo } from "react";
import type { Category, MenuItem } from "../components/types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface UseFilteredMenuResult {
  /** Tous les items groupés par category_id (avant filtre recherche) */
  itemsByCategory:    Record<string, MenuItem[]>;
  /** Catégories ayant au moins 1 item disponible */
  activeCats:         Category[];
  /** Items filtrés par recherche, groupés par category_id */
  filteredByCategory: Record<string, MenuItem[]>;
  /** Catégories visibles (filtre nav + filtre recherche) */
  filteredCats:       Category[];
  /** Nombre total d'items visibles */
  totalResults:       number;
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useFilteredMenu(
  categories:     Category[],
  items:          MenuItem[],
  searchQuery:    string,
  activeCategory: string,
): UseFilteredMenuResult {

  // Tous les items groupés par catégorie
  const itemsByCategory = useMemo<Record<string, MenuItem[]>>(() =>
    categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = items.filter(i => i.category_id === cat.id);
      return acc;
    }, {}),
  [categories, items]);

  // Catégories avec au moins 1 item
  const activeCats = useMemo<Category[]>(() =>
    categories.filter(c => (itemsByCategory[c.id]?.length ?? 0) > 0),
  [categories, itemsByCategory]);

  // Items correspondant à la recherche
  const searchedItems = useMemo<MenuItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.description?.toLowerCase().includes(q) ?? false),
    );
  }, [items, searchQuery]);

  // Items filtrés groupés par catégorie
  const filteredByCategory = useMemo<Record<string, MenuItem[]>>(() =>
    categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = searchedItems.filter(i => i.category_id === cat.id);
      return acc;
    }, {}),
  [categories, searchedItems]);

  // Catégories visibles selon filtre recherche + filtre nav
  const filteredCats = useMemo<Category[]>(() => {
    const withItems = activeCats.filter(
      c => (filteredByCategory[c.id]?.length ?? 0) > 0,
    );
    if (searchQuery.trim()) return withItems;
    return activeCategory === "all"
      ? withItems
      : withItems.filter(c => c.id === activeCategory);
  }, [activeCats, filteredByCategory, searchQuery, activeCategory]);

  // Total des résultats visibles
  const totalResults = useMemo<number>(() =>
    filteredCats.reduce((n, c) => n + (filteredByCategory[c.id]?.length ?? 0), 0),
  [filteredCats, filteredByCategory]);

  return { itemsByCategory, activeCats, filteredByCategory, filteredCats, totalResults };
}