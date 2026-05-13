/**
 * ItemModal.tsx — v4
 * ──────────────────
 * Fix image : translateX("-50%") corrigé + animation supprimée
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Leaf, Flame } from "lucide-react";
import { fmt } from "./ItemCard";
import type { MenuItem, Colors } from "./types";

const IMG_D    = 200;
const OVERHANG = 70;

// ─── Image circulaire statique ─────────────────────────────

function DishImage({ src, alt }: { src?: string; alt: string }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: -OVERHANG,
        left: "50%",
        transform: "translateX(-50%)", // ← CSS standard, pas une prop Framer
        width: IMG_D,
        height: IMG_D,
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.28), 0 0 0 6px rgba(255,255,255,0.18), 0 0 0 12px rgba(255,255,255,0.07)",
        zIndex: 10,
        background: "#e8e8e8",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
          }}
        >
          🍽️
        </div>
      )}
    </div>
  );
}

// ─── Pastille ingrédient ───────────────────────────────────

function IngPill({ icon, name, index }: { icon?: string; name: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.055, duration: 0.38, ease: [0.34, 1.4, 0.64, 1] }}
      title={name}
      style={{
        flexShrink: 0,
        width: 54,
        height: 54,
        borderRadius: 18,
        background: "#f2f2f2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 27,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        cursor: "default",
      }}
    >
      {icon ?? "🌿"}
    </motion.div>
  );
}

// ─── Composant principal ────────────────────────────────────

type Props = { item: MenuItem | null; colors: Colors; onClose: () => void };

export default function ItemModal({ item, colors, onClose }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  useEffect(() => {
    if (!item) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [item, onClose]);

  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  const displayPrice =
    selectedVariant !== null && item?.variants
      ? item.variants[selectedVariant].price
      : item?.price ?? 0;
  const displayCurrency =
    selectedVariant !== null && item?.variants
      ? item.variants[selectedVariant].currency
      : item?.currency ?? "EUR";

  const accent = colors.accent;
  const dark   = "#1c1c1c";
  const muted  = "#888";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {/* ── Bottom sheet ── */}
          <motion.div
            key="sheet"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 480,
              maxHeight: "92vh",
              borderRadius: "28px 28px 0 0",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              overflow: "visible", // permet à l'image de dépasser du header
            }}
          >
            {/* ══ HEADER VERT ══ */}
            <div
              style={{
                position: "relative",
                width: "100%",
                minHeight: 220,
                paddingBottom: OVERHANG + 16,
                background: `linear-gradient(160deg, ${accent} 0%, ${accent}ee 100%)`,
                borderRadius: "28px 28px 52% 52% / 28px 28px 90px 90px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 40,
                overflow: "visible", // ← indispensable pour que l'image déborde
                zIndex: 1,
              }}
            >
              {/* Texture dans un sous-div clippé */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "inherit",
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                <svg aria-hidden="true" style={{ width: "100%", height: "100%", opacity: 0.09 }}>
                  <defs>
                    <pattern id="lv2" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
                      <path d="M8,35 Q20,5 32,35 Q20,65 8,35Z" fill="none" stroke="white" strokeWidth="1.4" />
                      <line x1="8" y1="35" x2="32" y2="35" stroke="white" strokeWidth="0.7" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#lv2)" />
                </svg>
              </div>

              {/* Décos */}
              <span style={{ position: "absolute", top: 40, left: 28, fontSize: 30, zIndex: 2, pointerEvents: "none", transform: "rotate(-25deg)" }}>🥕</span>
              <span style={{ position: "absolute", bottom: OVERHANG + 36, right: 26, fontSize: 20, zIndex: 2, pointerEvents: "none", opacity: 0.65, transform: "rotate(18deg)" }}>🌿</span>

              {/* Titre */}
              <h2
                style={{
                  fontSize: "clamp(22px, 6vw, 28px)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  textAlign: "center",
                  padding: "0 64px",
                  zIndex: 2,
                  lineHeight: 1.15,
                  margin: 0,
                }}
              >
                {item.name}
              </h2>

              {/* Badges diète */}
              {(item.is_vegetarian || item.is_spicy) && (
                <div style={{ display: "flex", gap: 6, marginTop: 8, zIndex: 2 }}>
                  {item.is_vegetarian && (
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Leaf size={12} color="#fff" />
                    </span>
                  )}
                  {item.is_spicy && (
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,80,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Flame size={12} color="#fff" />
                    </span>
                  )}
                </div>
              )}

              {/* Image — aucune animation, juste du CSS */}
              <DishImage src={item.image_url} alt={item.name} />
            </div>

            {/* ══ SECTION BASSE ══ */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                scrollbarWidth: "none",
                display: "flex",
                flexDirection: "column",
                gap: 22,
                padding: `${OVERHANG + 24}px 24px 100px`,
                background: "#fff",
              }}
            >
              {/* Prix */}
              <p style={{ fontSize: 28, fontWeight: 900, color: dark, letterSpacing: "-0.03em", margin: 0 }}>
                {fmt(displayPrice, displayCurrency)}
              </p>

              {/* Variantes */}
              {item.variants && item.variants.length > 0 && (
                <div>
                  <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: muted, fontFamily: "sans-serif", marginBottom: 10 }}>
                    Taille
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {item.variants.map((v, i) => {
                      const sel = selectedVariant === i;
                      return (
                        <motion.button
                          key={i}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedVariant(sel ? null : i)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: 12,
                            border: `1.5px solid ${sel ? accent : "#e8e8e8"}`,
                            background: sel ? `${accent}15` : "#fafafa",
                            cursor: "pointer",
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 700, color: sel ? accent : dark }}>{v.label}</span>
                          <span style={{ fontSize: 11, marginLeft: 6, color: muted }}>{fmt(v.price, v.currency)}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ingrédients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <p style={{ fontSize: 17, fontWeight: 800, color: dark, marginBottom: 14, letterSpacing: "-0.01em" }}>
                    Ingrédients
                  </p>
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
                    {item.ingredients.map((ing, i) => (
                      <IngPill key={i} icon={ing.icon} name={ing.name} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {item.description && (
                <div>
                  <p style={{ fontSize: 17, fontWeight: 800, color: dark, marginBottom: 10, letterSpacing: "-0.01em" }}>
                    Description
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.9, color: muted, fontFamily: "sans-serif" }}>
                    {item.description}
                  </p>
                </div>
              )}
            </div>

            {/* Bouton retour */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 20,
              }}
            >
              <ArrowLeft size={16} color="#fff" />
            </motion.button>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}