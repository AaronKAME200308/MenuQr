// src/hooks/useRestaurantConfig.ts
// ─────────────────────────────────────────────────────────────
// Charge la config du restaurant par son slug.
// Merge profond avec defaultConfig — le resto ne doit définir
// que ce qui change par rapport au défaut.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import type { RestaurantConfig, PartialRestaurantConfig } from "../components/types";
import defaultConfig from "../restaurants/default";

// ── Merge profond section par section ─────────────────────────

function mergeConfig(
  base: RestaurantConfig,
  override: PartialRestaurantConfig
): RestaurantConfig {
  return {
    slug: override.slug,
    background: { ...base.background, ...override.background },
    header:     { ...base.header,     ...override.header     },
    card:       { ...base.card,       ...override.card       },
    modal:      { ...base.modal,      ...override.modal      },
    socials:    { ...base.socials,    ...override.socials    },
  };
}

// ── Hook ──────────────────────────────────────────────────────

export function useRestaurantConfig(slug: string): RestaurantConfig {
  const [config, setConfig] = useState<RestaurantConfig>(defaultConfig);

  useEffect(() => {
    if (!slug) return;

    // Import dynamique : cherche src/restaurants/<slug>.ts
    // Si le fichier n'existe pas, on garde le default sans erreur.
    import(`../restaurants/${slug}.ts`)
      .then((mod) => {
        const partial = mod.default as PartialRestaurantConfig;
        setConfig(mergeConfig(defaultConfig, partial));
      })
      .catch(() => {
        // Pas de config spécifique pour ce slug → default
        setConfig({ ...defaultConfig, slug });
      });
  }, [slug]);

  return config;
}