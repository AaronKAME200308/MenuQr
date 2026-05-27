// components/StyledBackground.tsx — v2 (typages stricts)
// Fond de page fixe : couleur unie + patterns SVG + blobs radiaux.
// Tout vient de colors (BD) et config.background (fichier resto).

import type { FC } from "react";
import type { Colors, RestaurantConfig, BackgroundConfig } from "./types";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface StyledBackgroundProps {
  colors: Colors;
  config: RestaurantConfig;
}

// ─────────────────────────────────────────────────────────────
// Builders de patterns SVG
// ─────────────────────────────────────────────────────────────

type PatternType = BackgroundConfig["patternTop"]; // "diamonds" | "grid" | "dots" | "none"

function buildTopPattern(color: string): React.ReactElement {
  return (
    <pattern id="bg-top" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      <polygon points="30,2 58,30 30,58 2,30" fill="none" stroke={color} strokeWidth="0.7" />
      <circle cx="30" cy="30" r="2.5" fill={color} opacity="0.35" />
    </pattern>
  );
}

function buildBottomPattern(color: string): React.ReactElement {
  return (
    <pattern id="bg-bottom" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect x="12" y="0"  width="6"  height="30" fill={color} opacity="0.12" />
      <rect x="0"  y="12" width="30" height="6"  fill={color} opacity="0.12" />
    </pattern>
  );
}

function buildDotsPattern(color: string): React.ReactElement {
  return (
    <pattern id="bg-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1.5" fill={color} opacity="0.3" />
    </pattern>
  );
}

// Map pattern type → builder
const PATTERN_BUILDERS: Partial<Record<PatternType, (color: string) => React.ReactElement>> = {
  diamonds: buildTopPattern,
  grid:     buildBottomPattern,
  dots:     buildDotsPattern,
};

// Map pattern type → id du gradient fill
const PATTERN_IDS: Partial<Record<PatternType, string>> = {
  diamonds: "bg-top",
  grid:     "bg-bottom",
  dots:     "bg-dots",
};

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

const StyledBackground: FC<StyledBackgroundProps> = ({ colors, config }) => {
  const {
    patternTop,
    patternBottom,
    patternTopOpacity,
    patternBottomOpacity,
    blobTopLeft,
    blobBottomRight,
  } = config.background;

  const topBuilder    = PATTERN_BUILDERS[patternTop];
  const bottomBuilder = PATTERN_BUILDERS[patternBottom];
  const topId         = PATTERN_IDS[patternTop];
  const bottomId      = PATTERN_IDS[patternBottom];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Fond uni */}
      <div style={{ position: "absolute", inset: 0, background: colors.bg }} />

      {/* Patterns SVG */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          {patternTop    !== "none" && topBuilder    && topBuilder(colors.primary)}
          {patternBottom !== "none" && bottomBuilder && bottomBuilder(colors.primary)}
        </defs>

        {patternTop !== "none" && topId && (
          <rect
            width="100%"
            height="50%"
            fill={`url(#${topId})`}
            opacity={patternTopOpacity}
          />
        )}
        {patternBottom !== "none" && bottomId && (
          <rect
            y="40%"
            width="100%"
            height="60%"
            fill={`url(#${bottomId})`}
            opacity={patternBottomOpacity}
          />
        )}
      </svg>

      {/* Blob haut-gauche */}
      {blobTopLeft && (
        <div style={{
          position:   "absolute",
          top:        "-18%",
          left:       "-18%",
          width:      "60%",
          height:     "60%",
          background: `radial-gradient(ellipse, ${colors.accent}55 0%, transparent 65%)`,
          filter:     "blur(80px)",
        }} />
      )}

      {/* Blob bas-droite */}
      {blobBottomRight && (
        <div style={{
          position:   "absolute",
          bottom:     "0%",
          right:      "-12%",
          width:      "55%",
          height:     "50%",
          background: `radial-gradient(ellipse, ${colors.accent}30 0%, transparent 65%)`,
          filter:     "blur(90px)",
        }} />
      )}
    </div>
  );
};

export default StyledBackground;