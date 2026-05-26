// src/hooks/useVisit.ts
// ─────────────────────────────────────────────────────────────
// Tracker de visites anonymes.
// Génère un visitor_id persistant en localStorage,
// puis appelle la fonction RPC upsert_visit à chaque montage.
// Aucune donnée personnelle — juste un UUID aléatoire.
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

const VISITOR_KEY = "mq_visitor_id";

/** Génère ou récupère l'UUID anonyme du visiteur */
function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

/**
 * useVisit(restaurantId)
 * À appeler dans MenuPage une fois que restaurant.id est connu.
 * Fire-and-forget : n'affecte pas le rendu.
 */
export function useVisit(restaurantId: string | undefined) {
  useEffect(() => {
    if (!restaurantId) return;

    const visitorId = getVisitorId();

    // Appel RPC — utilise SECURITY DEFINER côté Supabase
    supabase.rpc("upsert_visit", {
      p_restaurant_id: restaurantId,
      p_visitor_id:    visitorId,
    }).then(({ error }) => {
      if (error) console.warn("[useVisit] RPC error:", error.message);
    });
  }, [restaurantId]); // ne se déclenche qu'une fois par restaurantId
}