// components/FunSocials.tsx
// Section liens sociaux animés — lit config.socials pour le label et la disposition.

import { motion } from "framer-motion";
import { Phone }  from "lucide-react";
import { SOCIAL_META } from "../constants/socials";
import type { Restaurant, Colors } from "./types";
import type { useRestaurantConfig } from "../hooks/useRestaurantConfig";

type Props = {
  restaurant: Restaurant;
  colors:     Colors;
  config:     ReturnType<typeof useRestaurantConfig>;
  overrideSocialsLabel?: string;
};

export default function FunSocials({ restaurant, colors, config, overrideSocialsLabel }: Props) {
  const { sectionLabel, layout, gridMinWidth } = config.socials;

  const socials = [
    ...SOCIAL_META
      .filter(s => s.key !== "phone" && Boolean(restaurant[s.key as keyof Restaurant]))
      .map(s => ({ ...s, href: restaurant[s.key as keyof Restaurant] as string })),
    ...(restaurant.phone
      ? [{ key: "phone", label: "Appeler", emoji: "📞", bg: "#555555", Icon: Phone, href: `tel:${restaurant.phone}` }]
      : []),
  ];

  if (socials.length === 0) return null;

  const gridStyle: React.CSSProperties = layout === "grid"
    ? { display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${gridMinWidth}px, 1fr))`, gap: 10 }
    : { display: "flex", flexDirection: "row", gap: 10, overflowX: "auto", scrollbarWidth: "none" };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ margin: "8px 16px 28px" }}
    >
      {/* Séparateur + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: `${colors.primary}15` }} />
        <p style={{ fontSize: 10, letterSpacing: "0.25em", color: `${colors.primary}40`, fontFamily: "sans-serif", textTransform: "uppercase", flexShrink: 0 }}>
          {overrideSocialsLabel || sectionLabel}
        </p>
        <div style={{ flex: 1, height: 1, background: `${colors.primary}15` }} />
      </div>

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
            style={{ flexShrink: layout === "row" ? 0 : undefined, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "18px 12px 16px", borderRadius: 20, background: `${bg}18`, border: `1.5px solid ${bg}30`, textDecoration: "none", cursor: "pointer", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          >
            <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}
              style={{ width: 44, height: 44, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 18px ${bg}50` }}>
              <Icon size={20} color="#fff" />
            </motion.div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: colors.primary, marginBottom: 2 }}>{emoji} {label}</p>
              {key !== "phone" && (
                <p style={{ fontSize: 9, color: `${colors.primary}38`, fontFamily: "sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>
                  {href.replace(/^https?:\/\//, "").split("/")[0]}
                </p>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}