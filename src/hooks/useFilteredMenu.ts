// hooks/useFilteredMenu.ts — v3 (N-à-N categories)
// Utilise category_ids: string[] au lieu de category_id: string

import { useMemo } from "react";
import type { Category, MenuItem } from "../components/types";

export interface UseFilteredMenuResult {
  itemsByCategory:    Record<string, MenuItem[]>;
  activeCats:         Category[];
  filteredByCategory: Record<string, MenuItem[]>;
  filteredCats:       Category[];
  totalResults:       number;
}

export function useFilteredMenu(
  categories:     Category[],
  items:          MenuItem[],
  searchQuery:    string,
  activeCategory: string,
): UseFilteredMenuResult {

  const itemsByCategory = useMemo<Record<string, MenuItem[]>>(() =>
    categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = items.filter(i => i.category_ids.includes(cat.id));
      return acc;
    }, {}),
  [categories, items]);

  const activeCats = useMemo<Category[]>(() =>
    categories.filter(c => (itemsByCategory[c.id]?.length ?? 0) > 0),
  [categories, itemsByCategory]);

  const searchedItems = useMemo<MenuItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.description?.toLowerCase().includes(q) ?? false),
    );
  }, [items, searchQuery]);

  const filteredByCategory = useMemo<Record<string, MenuItem[]>>(() =>
    categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = searchedItems.filter(i => i.category_ids.includes(cat.id));
      return acc;
    }, {}),
  [categories, searchedItems]);

  const filteredCats = useMemo<Category[]>(() => {
    const withItems = activeCats.filter(
      c => (filteredByCategory[c.id]?.length ?? 0) > 0,
    );
    if (searchQuery.trim()) return withItems;
    return activeCategory === "all"
      ? withItems
      : withItems.filter(c => c.id === activeCategory);
  }, [activeCats, filteredByCategory, searchQuery, activeCategory]);

  const totalResults = useMemo<number>(() =>
    filteredCats.reduce((n, c) => n + (filteredByCategory[c.id]?.length ?? 0), 0),
  [filteredCats, filteredByCategory]);

  return { itemsByCategory, activeCats, filteredByCategory, filteredCats, totalResults };
}