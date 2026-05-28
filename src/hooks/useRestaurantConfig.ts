// hooks/useRestaurantConfig.ts — v2 (typages stricts)
// Charge la config du restaurant par son slug.
// Merge profond section par section avec defaultConfig.

import { useState, useEffect } from "react";
import type { RestaurantConfig, PartialRestaurantConfig } from "../components/types";
import defaultConfig from "../restaurants/default";

// ─────────────────────────────────────────────────────────────
// Merge section par section
// Les clés non définies dans override restent celles de base.
// ─────────────────────────────────────────────────────────────

function mergeConfig(
  base:     RestaurantConfig,
  override: PartialRestaurantConfig,
): RestaurantConfig {
  return {
    slug:       override.slug,
    background: { ...base.background, ...override.background },
    header:     { ...base.header,     ...override.header     },
    card:       { ...base.card,       ...override.card       },
    modal:      { ...base.modal,      ...override.modal      },
    socials:    { ...base.socials,    ...override.socials    },
    // i18n merge : si le resto définit i18n, on merge avec undefined (pas de default)
   i18n: override.i18n
  ? {
      defaultLanguage:    override.i18n.defaultLanguage    ?? base.i18n?.defaultLanguage ?? "fr",
      supportedLanguages: override.i18n.supportedLanguages ?? base.i18n?.supportedLanguages,
      heroTitleLines:     override.i18n.heroTitleLines     ?? base.i18n?.heroTitleLines,
      socialsLabel:       override.i18n.socialsLabel       ?? base.i18n?.socialsLabel,
    }
  : base.i18n,
  };
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useRestaurantConfig(slug: string): RestaurantConfig {
  const [config, setConfig] = useState<RestaurantConfig>({
    ...defaultConfig,
    slug,
  });

  useEffect(() => {
    if (!slug) return;

    // Import dynamique : src/restaurants/<slug>.ts
    // Si le fichier n'existe pas → garde le default sans erreur.
    import(`../restaurants/${slug}.ts`)
      .then((mod: { default: PartialRestaurantConfig }) => {
        setConfig(mergeConfig(defaultConfig, mod.default));
      })
      .catch(() => {
        // Pas de config spécifique → default avec le bon slug
        setConfig({ ...defaultConfig, slug });
      });
  }, [slug]);

  return config;
}