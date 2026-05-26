// hooks/useRestaurantData.ts
// Charge restaurant, categories et items depuis Supabase.
// Retourne { restaurant, categories, items, loading, error }.

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Restaurant, Category, MenuItem } from "../components/types";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

type UseRestaurantDataResult = {
  restaurant: Restaurant | null;
  categories: Category[];
  items: MenuItem[];
  loading: boolean;
  error: string | null;
};

export function useRestaurantData(slug: string): UseRestaurantDataResult {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems]           = useState<MenuItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: resto, error: e1 } = await supabase
          .from("restaurants").select("*").eq("slug", slug).single<Restaurant>();
        if (e1) throw e1;

        const { data: cats, error: e2 } = await supabase
          .from("categories").select("*").eq("restaurant_id", resto.id).order("sort_order").returns<Category[]>();
        if (e2) throw e2;

        const { data: menuItems, error: e3 } = await supabase
          .from("menu_items").select("*").eq("restaurant_id", resto.id).eq("is_available", true).order("sort_order").returns<MenuItem[]>();
        if (e3) throw e3;

        setRestaurant(resto);
        setCategories(cats ?? []);
        setItems(menuItems ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return { restaurant, categories, items, loading, error };
}