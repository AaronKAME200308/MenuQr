import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Une seule instance, même avec le rechargement à chaud (HMR) de Vite
const g = globalThis as unknown as { __supabase?: SupabaseClient };

export const supabase: SupabaseClient =
  g.__supabase ??
  (g.__supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  ));