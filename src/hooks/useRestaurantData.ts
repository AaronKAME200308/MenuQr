// hooks/useRestaurantData.ts — v3 (N-à-N categories)
// Joint menu_item_categories pour peupler category_ids[]

import { useEffect, useState } from "react";
import { createClient }        from "@supabase/supabase-js";
import type { Restaurant, Category, MenuItem } from "../components/types";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL      as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

interface RawMenuItem extends Omit<MenuItem, "category_ids"> {
  menu_item_categories: { category_id: string }[];
}

export interface UseRestaurantDataResult {
  restaurant: Restaurant | null;
  categories: Category[];
  items:      MenuItem[];
  loading:    boolean;
  error:      string | null;
}

export function useRestaurantData(slug: string): UseRestaurantDataResult {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items,      setItems]      = useState<MenuItem[]>([]);
  const [loading,    setLoading]    = useState<boolean>(true);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      try {
        const { data: resto, error: e1 } = await supabase
          .from("restaurants")
          .select("*")
          .eq("slug", slug)
          .single<Restaurant>();
        if (e1) throw e1;

        const { data: cats, error: e2 } = await supabase
          .from("categories")
          .select("*")
          .eq("restaurant_id", resto.id)
          .order("sort_order")
          .returns<Category[]>();
        if (e2) throw e2;

        const { data: rawItems, error: e3 } = await supabase
          .from("menu_items")
          .select(`
            *,
            menu_item_categories ( category_id )
          `)
          .eq("restaurant_id", resto.id)
          .eq("is_available", true)
          .order("sort_order")
          .returns<RawMenuItem[]>();
        if (e3) throw e3;

        const menuItems: MenuItem[] = (rawItems ?? []).map((raw) => {
          const { menu_item_categories: mic, ...rest } = raw;
          return {
            ...rest,
            category_ids: (mic ?? []).map((r) => r.category_id),
          };
        });

        if (!cancelled) {
          setRestaurant(resto);
          setCategories(cats ?? []);
          setItems(menuItems);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur inconnue");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [slug]);

  return { restaurant, categories, items, loading, error };
}