// components/StyledBackground.tsx
// Fond de page : couleur unie + patterns SVG + blobs radiaux.
// Tout vient de colors (BD) et config.background (alloco.ts).

import type { Colors } from "./types";
import type { useRestaurantConfig } from "../hooks/useRestaurantConfig";

type Props = {
  colors: Colors;
  config: ReturnType<typeof useRestaurantConfig>;
};

export default function StyledBackground({ colors, config }: Props) {
  const {
    patternTop,
    patternBottom,
    patternTopOpacity,
    patternBottomOpacity,
    blobTopLeft,
    blobBottomRight,
  } = config.background;

  const patterns: Record<string, React.ReactElement> = {
    diamonds: (
      <pattern id="bg-top" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <polygon points="30,2 58,30 30,58 2,30" fill="none" stroke={colors.primary} strokeWidth="0.7" />
        <circle cx="30" cy="30" r="2.5" fill={colors.primary} opacity="0.35" />
      </pattern>
    ),
    grid: (
      <pattern id="bg-bottom" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <rect x="12" y="0" width="6" height="30" fill={colors.primary} opacity="0.12" />
        <rect x="0" y="12" width="30" height="6" fill={colors.primary} opacity="0.12" />
      </pattern>
    ),
    dots: (
      <pattern id="bg-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="1.5" fill={colors.primary} opacity="0.3" />
      </pattern>
    ),
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: colors.bg }} />

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          {patternTop    !== "none" && patterns[patternTop]}
          {patternBottom !== "none" && patterns[patternBottom]}
        </defs>
        {patternTop !== "none" && (
          <rect width="100%" height="50%" fill="url(#bg-top)" opacity={patternTopOpacity} />
        )}
        {patternBottom !== "none" && (
          <rect y="40%" width="100%" height="60%" fill="url(#bg-bottom)" opacity={patternBottomOpacity} />
        )}
      </svg>

      {blobTopLeft && (
        <div style={{ position: "absolute", top: "-18%", left: "-18%", width: "60%", height: "60%", background: `radial-gradient(ellipse, ${colors.accent}55 0%, transparent 65%)`, filter: "blur(80px)" }} />
      )}
      {blobBottomRight && (
        <div style={{ position: "absolute", bottom: "0%", right: "-12%", width: "55%", height: "50%", background: `radial-gradient(ellipse, ${colors.accent}30 0%, transparent 65%)`, filter: "blur(90px)" }} />
      )}
    </div>
  );
}