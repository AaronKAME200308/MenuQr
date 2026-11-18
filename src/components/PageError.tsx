// components/PageError.tsx — v3 (carte d'erreur + pixels qui s'éteignent)
// Écran d'erreur — icône, message, aide et lien de retour,
// centrés sur StyledBackground. Couleurs : celles du restaurant.

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
// Constantes
// ─────────────────────────────────────────────────────────────

/** Opacités décroissantes : la ligne de pixels « se dissout ». */
const FADE = [1, 0.7, 0.45, 0.25, 0.1];

const ERROR_STYLES = `
  .mqr-error-link {
    transition: background 0.2s ease, color 0.2s ease;
  }
  .mqr-error-link:hover,
  .mqr-error-link:focus-visible {
    outline: none;
    filter: brightness(1.15);
  }
`;

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

const PageError: FC<PageErrorProps> = ({
  colors,
  config,
  message = "Restaurant introuvable.",
}) => (
  <div
    role="alert"
    style={{
      position:       "fixed",
      inset:          0,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      padding:        24,
    }}
  >
    <style>{GLOBAL_STYLES}</style>
    <style>{ERROR_STYLES}</style>
    <StyledBackground colors={colors} config={config} />

    <div style={{
      position:       "relative",
      zIndex:         1,
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      textAlign:      "center",
      maxWidth:       340,
      gap:            14,
    }}>
      {/* Icône */}
      <div
        aria-hidden="true"
        style={{
          width:          88,
          height:         88,
          borderRadius:   26,
          background:     `${colors.primary}14`,
          border:         `1.5px solid ${colors.primary}33`,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        <UtensilsCrossed size={40} style={{ color: colors.primary }} />
      </div>

      {/* Pixels qui s'éteignent */}
      <div aria-hidden="true" style={{ display: "flex", gap: 6 }}>
        {FADE.map((o, i) => (
          <span
            key={i}
            style={{
              width:        8,
              height:       8,
              borderRadius: 2,
              background:   colors.primary,
              opacity:      o,
            }}
          />
        ))}
      </div>

      <h1 style={{
        margin:        0,
        fontSize:      22,
        fontWeight:    700,
        lineHeight:    1.25,
        letterSpacing: "-0.01em",
        color:         colors.primary,
        fontFamily:    "system-ui, sans-serif",
      }}>
        {message}
      </h1>

      <p style={{
        margin:     0,
        fontSize:   14,
        lineHeight: 1.5,
        color:      `${colors.primary}B3`,
        fontFamily: "system-ui, sans-serif",
      }}>
        Vérifiez le lien ou rescannez le QR code, puis réessayez.
      </p>

      <a
        href="/"
        className="mqr-error-link"
        style={{
          marginTop:      6,
          display:        "inline-block",
          padding:        "10px 22px",
          borderRadius:   999,
          border:         `1.5px solid ${colors.primary}`,
          color:          colors.primary,
          fontSize:       13,
          fontWeight:     700,
          letterSpacing:  "0.04em",
          textDecoration: "none",
          fontFamily:     "system-ui, sans-serif",
        }}
      >
        Retour à l'accueil
      </a>
    </div>
  </div>
);

export default PageError;