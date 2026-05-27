// components/PageError.tsx — v2 (typages stricts)
// Écran d'erreur — icône + message centré sur StyledBackground.

import type { FC } from "react";
import { UtensilsCrossed } from "lucide-react";

import StyledBackground  from "./StyledBackground";
import { GLOBAL_STYLES } from "../styles/global";
import type { Colors, RestaurantConfig } from "./types";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface PageErrorProps {
  colors:   Colors;
  config:   RestaurantConfig;
  message?: string;
}

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

const PageError: FC<PageErrorProps> = ({
  colors,
  config,
  message = "Restaurant introuvable.",
}) => (
  <div style={{
    position:       "fixed",
    inset:          0,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
  }}>
    <style>{GLOBAL_STYLES}</style>
    <StyledBackground colors={colors} config={config} />

    <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
      <UtensilsCrossed
        size={40}
        style={{ color: `${colors.primary}40`, margin: "0 auto 16px" }}
      />
      <p style={{ color: colors.primary, fontFamily: "sans-serif" }}>
        {message}
      </p>
    </div>
  </div>
);

export default PageError;