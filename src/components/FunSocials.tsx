// components/FunSocials.tsx — v2 (i18n)
// Reçoit sectionLabel déjà traduit par MenuPage (prop directe).
// Ne connaît pas la langue — reste pur.

import { motion }  from "framer-motion";
import { Phone }   from "lucide-react";
import type { FC } from "react";

import type { Restaurant, Colors, RestaurantConfig } from "./types";

// ─────────────────────────────────────────────────────────────
// Métadonnées des réseaux sociaux
// ─────────────────────────────────────────────────────────────

interface SocialMeta {
  key:   string;
  label: string;
  emoji: string;
  bg:    string;
  Icon:  React.ComponentType<{ size?: number; color?: string }>;
}

// Importé depuis constants/socials — reproduit ici pour l'autonomie du fichier
// Dans ton projet : importe depuis "../constants/socials"
const SOCIAL_META: SocialMeta[] = [
  { key: "social_instagram",  label: "Instagram",   emoji: "📸", bg: "#E1306C", Icon: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )},
  { key: "social_facebook",   label: "Facebook",    emoji: "👍", bg: "#1877F2", Icon: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  )},
  { key: "social_whatsapp",   label: "WhatsApp",    emoji: "💬", bg: "#25D366", Icon: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  )},
  { key: "social_tiktok",     label: "TikTok",      emoji: "🎵", bg: "#010101", Icon: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1-.13z"/></svg>
  )},
  { key: "social_googlemaps", label: "Maps",        emoji: "📍", bg: "#EA4335", Icon: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )},
  { key: "social_website",    label: "Site web",    emoji: "🌐", bg: "#6366F1", Icon: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )},
];

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface FunSocialsProps {
  restaurant:   Restaurant;
  colors:       Colors;
  config:       RestaurantConfig;
  /** Label de section déjà traduit par MenuPage */
  sectionLabel: string;
}

interface SocialLink {
  key:   string;
  label: string;
  emoji: string;
  bg:    string;
  Icon:  React.ComponentType<{ size?: number; color?: string }>;
  href:  string;
}

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

const FunSocials: FC<FunSocialsProps> = ({
  restaurant,
  colors,
  config,
  sectionLabel,
}) => {
  const { layout, gridMinWidth } = config.socials;

  // Construit la liste des liens disponibles
  const socials: SocialLink[] = [
    ...SOCIAL_META
      .filter(s => Boolean(restaurant[s.key as keyof Restaurant]))
      .map(s => ({
        ...s,
        href: restaurant[s.key as keyof Restaurant] as string,
      })),
    ...(restaurant.phone
      ? [{
          key:   "phone",
          label: "Appeler",
          emoji: "📞",
          bg:    "#555555",
          Icon:  Phone,
          href:  `tel:${restaurant.phone}`,
        }]
      : []),
  ];

  if (socials.length === 0) return null;

  const gridStyle: React.CSSProperties = layout === "grid"
    ? {
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${gridMinWidth}px, 1fr))`,
        gap: 10,
      }
    : {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        overflowX: "auto",
        scrollbarWidth: "none",
      };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ margin: "8px 16px 28px" }}
    >
      {/* ── Séparateur + label traduit ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: `${colors.primary}15` }} />
        <p style={{
          fontSize: 10, letterSpacing: "0.25em",
          color: `${colors.primary}40`,
          fontFamily: "sans-serif",
          textTransform: "uppercase",
          flexShrink: 0,
        }}>
          {sectionLabel}
        </p>
        <div style={{ flex: 1, height: 1, background: `${colors.primary}15` }} />
      </div>

      {/* ── Grille / rangée de boutons ── */}
      <div style={gridStyle}>
        {socials.map(({ key, label, emoji, bg, Icon, href }, idx) => (
          <motion.a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.34, 1.3, 0.64, 1] }}
            whileHover={{ y: -5, scale: 1.04, boxShadow: `0 14px 36px ${bg}40` }}
            whileTap={{ scale: 0.96 }}
            style={{
              flexShrink: layout === "row" ? 0 : undefined,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "18px 12px 16px",
              borderRadius: 20,
              background: `${bg}18`,
              border: `1.5px solid ${bg}30`,
              textDecoration: "none",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              style={{
                width: 44, height: 44,
                borderRadius: "50%",
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 6px 18px ${bg}50`,
              }}
            >
              <Icon size={20} color="#fff" />
            </motion.div>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: colors.primary, marginBottom: 2 }}>
                {emoji} {label}
              </p>
              {key !== "phone" && (
                <p style={{
                  fontSize: 9,
                  color: `${colors.primary}38`,
                  fontFamily: "sans-serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 120,
                }}>
                  {href.replace(/^https?:\/\//, "").split("/")[0]}
                </p>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
};

export default FunSocials;