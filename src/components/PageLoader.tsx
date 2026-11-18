// components/PageLoader.tsx — v3 (pixels de QR code)
// Écran de chargement — grille de pixels façon QR code qui s'allument,
// centrée sur StyledBackground. Couleurs : celles du restaurant.

import type { FC } from "react";

import StyledBackground from "./StyledBackground";
import { GLOBAL_STYLES } from "../styles/global";
import type { Colors, RestaurantConfig } from "./types";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface PageLoaderProps {
  colors:  Colors;
  config:  RestaurantConfig;
  /** Message affiché sous la grille. Défaut : "CHARGEMENT…" */
  message?: string;
}

// ─────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────

const GRID = 6;
const CELLS = Array.from({ length: GRID * GRID }, (_, i) => i);

const LOADER_STYLES = `
  @keyframes mqr-pixel {
    0%, 100% { opacity: 0.12; transform: scale(0.75); }
    40%      { opacity: 1;    transform: scale(1); }
  }
  .mqr-pixel { animation: mqr-pixel 1.6s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .mqr-pixel { animation: none; opacity: 0.6; }
  }
`;

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

const PageLoader: FC<PageLoaderProps> = ({
  colors,
  config,
  message = "CHARGEMENT…",
}) => (
  <div
    role="status"
    aria-live="polite"
    style={{
      position:       "fixed",
      inset:          0,
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
    }}
  >
    <style>{GLOBAL_STYLES}</style>
    <style>{LOADER_STYLES}</style>
    <StyledBackground colors={colors} config={config} />

    <div style={{
      position:       "relative",
      zIndex:         1,
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      gap:            28,
    }}>
      {/* Grille de pixels façon QR code */}
      <div
        aria-hidden="true"
        style={{
          display:             "grid",
          gridTemplateColumns: `repeat(${GRID}, 14px)`,
          gap:                 6,
          padding:             18,
          borderRadius:        22,
          background:          `${colors.primary}10`,
          border:              `1.5px solid ${colors.primary}30`,
        }}
      >
        {CELLS.map((i) => (
          <span
            key={i}
            className="mqr-pixel"
            style={{
              width:          14,
              height:         14,
              borderRadius:   4,
              background:     colors.primary,
              animationDelay: `${((i * 7) % 12) * 0.13}s`,
            }}
          />
        ))}
      </div>

      <p style={{
        margin:        0,
        fontSize:      11,
        fontWeight:    600,
        letterSpacing: 4,
        color:         `${colors.primary}99`,
        fontFamily:    "system-ui, sans-serif",
      }}>
        {message}
      </p>
    </div>
  </div>
);

export default PageLoader;