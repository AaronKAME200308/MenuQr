// components/PageLoader.tsx — v2 (typages stricts)
// Écran de chargement — spinner centré sur StyledBackground.

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
  /** Message affiché sous le spinner. Défaut : "CHARGEMENT…" */
  message?: string;
}

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

const PageLoader: FC<PageLoaderProps> = ({
  colors,
  config,
  message = "CHARGEMENT…",
}) => (
  <div style={{
    position:       "fixed",
    inset:          0,
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    gap:            16,
  }}>
    <style>{GLOBAL_STYLES}</style>
    <StyledBackground colors={colors} config={config} />

    <div style={{
      position:       "relative",
      zIndex:         1,
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      gap:            16,
    }}>
      {/* Spinner */}
      <div style={{
        width:           48,
        height:          48,
        borderRadius:    "50%",
        border:          `2px solid ${colors.primary}30`,
        borderTopColor:  colors.primary,
        animation:       "spin 0.8s linear infinite",
      }} />

      <p style={{
        fontSize:      11,
        letterSpacing: 4,
        color:         `${colors.primary}55`,
        fontFamily:    "sans-serif",
      }}>
        {message}
      </p>
    </div>
  </div>
);

export default PageLoader;