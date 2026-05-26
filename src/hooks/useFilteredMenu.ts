// hooks/useFilteredMenu.ts
// Calcule les items filtrés par catégorie et par recherche.
// Retourne { itemsByCategory, activeCats, filteredCats, filteredByCategory, totalResults }.

import { useMemo } from "react";
import type { Category, MenuItem } from "../components/types";

type UseFilteredMenuResult = {
  itemsByCategory:    Record<string, MenuItem[]>;
  activeCats:         Category[];
  filteredByCategory: Record<string, MenuItem[]>;
  filteredCats:       Category[];
  totalResults:       number;
};

export function useFilteredMenu(
  categories:     Category[],
  items:          MenuItem[],
  searchQuery:    string,
  activeCategory: string,
): UseFilteredMenuResult {

  const itemsByCategory = useMemo(() =>
    categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = items.filter(i => i.category_id === cat.id);
      return acc;
    }, {}),
  [categories, items]);

  const activeCats = useMemo(() =>
    categories.filter(c => (itemsByCategory[c.id] ?? []).length > 0),
  [categories, itemsByCategory]);

  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const filteredByCategory = useMemo(() =>
    categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = searchedItems.filter(i => i.category_id === cat.id);
      return acc;
    }, {}),
  [categories, searchedItems]);

  const filteredCats = useMemo(() => {
    const cats = activeCats.filter(c => (filteredByCategory[c.id] ?? []).length > 0);
    if (searchQuery.trim()) return cats;
    return activeCategory === "all" ? cats : cats.filter(c => c.id === activeCategory);
  }, [activeCats, filteredByCategory, searchQuery, activeCategory]);

  const totalResults = useMemo(() =>
    filteredCats.reduce((n, c) => n + (filteredByCategory[c.id] ?? []).length, 0),
  [filteredCats, filteredByCategory]);

  return { itemsByCategory, activeCats, filteredByCategory, filteredCats, totalResults };
}