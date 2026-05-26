// components/PageError.tsx
// Écran d'erreur — icône + message centré sur StyledBackground.

import { UtensilsCrossed }  from "lucide-react";
import StyledBackground     from "./StyledBackground";
import { GLOBAL_STYLES }    from "../styles/global";
import type { Colors }      from "./types";
import type { useRestaurantConfig } from "../hooks/useRestaurantConfig";

type Props = {
  colors:  Colors;
  config:  ReturnType<typeof useRestaurantConfig>;
  message?: string;
};

export default function PageError({ colors, config, message }: Props) {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{GLOBAL_STYLES}</style>
      <StyledBackground colors={colors} config={config} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <UtensilsCrossed size={40} style={{ color: `${colors.primary}40`, margin: "0 auto 16px" }} />
        <p style={{ color: colors.primary, fontFamily: "sans-serif" }}>
          {message ?? "Restaurant introuvable."}
        </p>
      </div>
    </div>
  );
}