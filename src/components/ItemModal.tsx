/**
 * ItemModal.tsx — REFONTE DARK LUXE
 * ──────────────────────────────────
 * • Image pleine largeur en hero (parallax léger au scroll)
 * • Header gradient sombre sur l'image + titre en bas
 * • Ingrédients : pills stylées avec icônes
 * • Description élégante centrée
 * • Variantes améliorées
 * • Fermeture : overlay, bouton ✕, Escape
 *
 * Dépendances : framer-motion, lucide-react
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, Leaf, Flame,  ChefHat } from "lucide-react";
import { fmt } from "./ItemCard";
import type { MenuItem, Colors } from "./types";

// ─────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────

const HERO_H = 300;

// ─────────────────────────────────────────────────────────────
// Section Hero image
// ─────────────────────────────────────────────────────────────

function HeroImage({
  src,
  alt,
  colors,
  scrollRef,
}: {
  src?: string;
  alt: string;
  colors: Colors;
  scrollRef: React.RefObject<HTMLDivElement>;
}) {
  const { scrollY } = useScroll({ container: scrollRef });
  const imgY = useTransform(scrollY, [0, HERO_H], [0, 40]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: HERO_H,
        flexShrink: 0,
        overflow: "hidden",
        background: colors.accent,
      }}
    >
      {/* Image avec effet parallax */}
      {src ? (
        <motion.img
          src={src}
          alt={alt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "115%",
            objectFit: "cover",
            y: imgY,
          }}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 90,
            background: `linear-gradient(135deg, ${colors.accent}80, ${colors.bg}aa)`,
          }}
        >
          🍽️
        </div>
      )}

      {/* Gradient sombre en bas pour lisibilité du titre */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.08) 0%,
            rgba(0,0,0,0.15) 40%,
            rgba(0,0,0,0.72) 80%,
            rgba(0,0,0,0.88) 100%
          )`,
        }}
      />

      {/* Titre + badges dans le hero */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Badges diète */}
        <div style={{ display: "flex", gap: 6 }}>
          {/* Rating si présent */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.18)",
              fontSize: 10,
              color: "#fff",
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            <ChefHat size={10} color="rgba(255,255,255,0.8)" />
            Chef's choice
          </span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(22px, 6vw, 30px)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            margin: 0,
          }}
        >
          {alt}
        </motion.h2>

        {/* Calories · poids */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ display: "flex", gap: 10, alignItems: "center" }}
        >
          <DietBadgeHero />
        </motion.div>
      </div>
    </div>
  );
}

function DietBadgeHero() {
  // Placeholder, les vraies données viennent via item dans ItemModal
  return null;
}

// ─────────────────────────────────────────────────────────────
// Ingrédient pill — style dark luxe
// ─────────────────────────────────────────────────────────────

function IngredientPill({
  name,
  icon,
  colors,
  index,
}: {
  name: string;
  icon?: string;
  colors: Colors;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.18 + index * 0.055,
        duration: 0.4,
        ease: [0.34, 1.4, 0.64, 1],
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 14px 7px 8px",
        borderRadius: 40,
        background: `linear-gradient(135deg, ${colors.accent}22, ${colors.accent}08)`,
        border: `1px solid ${colors.accent}30`,
        backdropFilter: "blur(8px)",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: `${colors.accent}35`,
          border: `1.5px solid ${colors.accent}50`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          flexShrink: 0,
        }}
      >
        {icon ?? "🌿"}
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: `${colors.primary}80`,
          fontFamily: "sans-serif",
          letterSpacing: "0.02em",
        }}
      >
        {name}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section label
// ─────────────────────────────────────────────────────────────

function SectionLabel({ children, colors }: { children: React.ReactNode; colors: Colors }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div
        style={{
          width: 3,
          height: 18,
          borderRadius: 2,
          background: `linear-gradient(to bottom, ${colors.accent}, ${colors.accent}55)`,
        }}
      />
      <p
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: colors.primary,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "sans-serif",
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ItemModal
// ─────────────────────────────────────────────────────────────

type ItemModalProps = {
  item: MenuItem | null;
  colors: Colors;
  onClose: () => void;
};

export default function ItemModal({ item, colors, onClose }: ItemModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedVariant(null);
    // Reset scroll quand l'item change
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [item?.id]);

  // Escape
  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [item, onClose]);

  // Lock scroll
  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  const displayPrice =
    selectedVariant !== null && item?.variants
      ? item.variants[selectedVariant].price
      : item?.price ?? 0;
  const displayCurrency =
    selectedVariant !== null && item?.variants
      ? item.variants[selectedVariant].currency
      : item?.currency ?? "EUR";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="modal-overlay"
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
            background: "rgba(0,0,0,0.80)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            padding: "0",
          }}
        >
          {/* ── Panneau modal ── */}
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "60%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 480,
              maxHeight: "92vh",
              borderRadius: "28px 28px 0 0",
              overflow: "hidden",
              background: colors.card,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 -20px 80px rgba(0,0,0,0.7)",
            }}
          >
            {/* Handle bar */}
            <div
              style={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 40,
                height: 4,
                borderRadius: 2,
                background: "rgba(255,255,255,0.22)",
                zIndex: 20,
              }}
            />

            {/* Hero image */}
            <HeroImage
              src={item.image_url}
              alt={item.name}
              colors={colors}
              scrollRef={scrollRef as React.RefObject<HTMLDivElement>}
            />

            {/* ══ CORPS SCROLLABLE ══ */}
            <div
              ref={scrollRef}
              style={{
                overflowY: "auto",
                flex: 1,
                scrollbarWidth: "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Bande prix + badges */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px 0",
                  gap: 12,
                }}
              >
                <p
                  style={{
                    fontSize: 34,
                    fontWeight: 900,
                    color: "#f5d98b",
                    letterSpacing: "-0.04em",
                    textShadow: "0 0 32px rgba(245,217,139,0.3)",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {fmt(displayPrice, displayCurrency)}
                </p>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {item.is_vegetarian && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 10px",
                        borderRadius: 20,
                        background: "rgba(80,200,120,0.15)",
                        border: "1px solid rgba(80,200,120,0.35)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#50c878",
                        fontFamily: "sans-serif",
                      }}
                    >
                      <Leaf size={11} />
                      Végétarien
                    </span>
                  )}
                  {item.is_spicy && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 10px",
                        borderRadius: 20,
                        background: "rgba(255,69,0,0.15)",
                        border: "1px solid rgba(255,69,0,0.35)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#ff4500",
                        fontFamily: "sans-serif",
                      }}
                    >
                      <Flame size={11} />
                      Épicé
                    </span>
                  )}
                  {(item.calories || item.weight) && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 10px",
                        borderRadius: 20,
                        background: `${colors.accent}15`,
                        border: `1px solid ${colors.accent}30`,
                        fontSize: 11,
                        fontWeight: 600,
                        color: `${colors.primary}70`,
                        fontFamily: "sans-serif",
                      }}
                    >
                      {[item.calories ? `${item.calories} kcal` : null, item.weight]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Padding + sections */}
              <div
                style={{
                  padding: "20px 24px 40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {/* Description */}
                {item.description && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.9,
                        color: `${colors.primary}60`,
                        fontFamily: "sans-serif",
                        margin: 0,
                        borderLeft: `2px solid ${colors.accent}40`,
                        paddingLeft: 14,
                        fontStyle: "italic",
                      }}
                    >
                      {item.description}
                    </p>
                  </motion.div>
                )}

                {/* Séparateur */}
                <div
                  style={{
                    height: 1,
                    background: `linear-gradient(to right, ${colors.accent}30, transparent)`,
                  }}
                />

                {/* Ingrédients */}
                {item.ingredients && item.ingredients.length > 0 && (
                  <div>
                    <SectionLabel colors={colors}>Ingrédients</SectionLabel>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {item.ingredients.map((ing, i) => (
                        <IngredientPill
                          key={i}
                          name={ing.name}
                          icon={ing.icon}
                          colors={colors}
                          index={i}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Variantes */}
                {item.variants && item.variants.length > 0 && (
                  <div>
                    <SectionLabel colors={colors}>Taille / Variante</SectionLabel>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {item.variants.map((v, i) => {
                        const isSelected = selectedVariant === i;
                        return (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setSelectedVariant(isSelected ? null : i)}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              padding: "10px 20px",
                              borderRadius: 14,
                              border: `1.5px solid ${
                                isSelected ? colors.accent : `${colors.primary}18`
                              }`,
                              background: isSelected
                                ? `${colors.accent}20`
                                : "rgba(255,255,255,0.03)",
                              cursor: "pointer",
                              minWidth: 80,
                              transition: "all 0.18s ease",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 800,
                                color: isSelected ? colors.accent : colors.primary,
                                letterSpacing: "0.02em",
                              }}
                            >
                              {v.label}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                marginTop: 3,
                                color: `${colors.primary}50`,
                                fontFamily: "sans-serif",
                              }}
                            >
                              {fmt(v.price, v.currency)}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Bouton fermer ── */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 20,
              }}
            >
              <X size={16} color="rgba(255,255,255,0.9)" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}