/**
 * ItemModal.tsx — v6 (promotions)
 * Affiche le badge promo, prix barré et prix réduit dans le modal.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Leaf, Flame, Share2, Tag, X, ZoomIn } from "lucide-react";
import { fmt, promoPrice } from "./ItemCard";
import type { MenuItem, Colors, TextConfig } from "./types";

const IMG_D    = 128;
const OVERHANG = 64;

// ─── Drag handle ───────────────────────────────────────────

function DragHandle() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:  "absolute",
        top:       10,
        left:      "50%",
        transform: "translateX(-50%)",
        width:     36,
        height:    4,
        borderRadius: 99,
        background: "rgba(255,255,255,0.30)",
        zIndex:    30,
      }}
    />
  );
}

// ─── Lightbox fullscreen ───────────────────────────────────

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         200,
        background:     "rgba(0,0,0,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        24,
      }}
    >
      {/* Bouton fermer */}
      <motion.button
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.12 }}
        onClick={onClose}
        style={{
          position:       "absolute",
          top:            20,
          right:          20,
          width:          40,
          height:         40,
          borderRadius:   "50%",
          background:     "rgba(255,255,255,0.12)",
          border:         "1px solid rgba(255,255,255,0.2)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          cursor:         "pointer",
          zIndex:         201,
        }}
      >
        <X size={18} color="#fff" />
      </motion.button>

      {/* Image */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        exit={{ scale: 0.88,    opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.34, 1.2, 0.64, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth:     "100%",
          maxHeight:    "88vh",
          objectFit:    "contain",
          borderRadius: 20,
          boxShadow:    "0 32px 80px rgba(0,0,0,0.6)",
        }}
      />
    </motion.div>
  );
}

// ─── Image circulaire ──────────────────────────────────────

function DishImage({ src, alt, accent, bg, onExpand }: { src?: string; alt: string; accent: string; bg: string; onExpand: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.82, opacity: 0, y: 12 }}
      animate={{ scale: 1,    opacity: 1, y: 0  }}
      transition={{ delay: 0.1, duration: 0.45, ease: [0.34, 1.3, 0.64, 1] }}
      onClick={src ? onExpand : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:    "absolute",
        bottom:      -OVERHANG,
        left:        "50%",
        transform:   "translateX(-50%)",
        width:       IMG_D,
        height:      IMG_D,
        borderRadius: "50%",
        overflow:    "hidden",
        boxShadow:   `0 12px 40px rgba(0,0,0,0.22), 0 0 0 5px ${bg}, 0 0 0 9px ${accent}38`,
        zIndex:      10,
        background:  `${accent}18`,
        cursor:      src ? "zoom-in" : "default",
      }}
    >
      {src ? (
        <>
          <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s ease", transform: hovered ? "scale(1.07)" : "scale(1)" }} />
          {/* Overlay zoom au hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position:       "absolute",
              inset:          0,
              background:     "rgba(0,0,0,0.35)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              borderRadius:   "50%",
            }}
          >
            <ZoomIn size={24} color="#fff" />
          </motion.div>
        </>
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, background: `${bg}` }}>
          🍽️
        </div>
      )}
    </motion.div>
  );
}

// ─── Badges diète ──────────────────────────────────────────

function DietBadges({ isVegetarian, isSpicy, labelVegetarian, labelSpicy }: { isVegetarian: boolean; isSpicy: boolean; labelVegetarian: string; labelSpicy: string }) {
  if (!isVegetarian && !isSpicy) return null;
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 10, zIndex: 2, flexWrap: "wrap", justifyContent: "center" }}>
      {isVegetarian && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, color: "#fff" }}>
          <Leaf size={9} color="#fff" /> {labelVegetarian}
        </span>
      )}
      {isSpicy && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, background: "rgba(255,80,0,0.45)", fontSize: 10, fontWeight: 700, color: "#fff" }}>
          <Flame size={9} color="#fff" /> {labelSpicy}
        </span>
      )}
    </div>
  );
}

// ─── Badge promo dans le header du modal ───────────────────

function PromoHeaderBadge({ pct, name }: { pct: number; name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 320, damping: 22 }}
      style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, zIndex: 2, flexWrap: "wrap", justifyContent: "center" }}
    >
      <span style={{
        display:      "inline-flex",
        alignItems:   "center",
        gap:          5,
        padding:      "5px 12px",
        borderRadius: 99,
        background:   "linear-gradient(135deg, #e53935 0%, #ff5252 100%)",
        boxShadow:    "0 4px 14px rgba(229,57,53,0.45)",
        fontSize:     11,
        fontWeight:   900,
        color:        "#fff",
        letterSpacing: "0.01em",
      }}>
        <Tag size={10} color="#fff" />
        -{pct}%
      </span>
      {name && (
        <span style={{
          padding:      "5px 12px",
          borderRadius: 99,
          background:   "rgba(255,255,255,0.22)",
          border:       "1px solid rgba(255,255,255,0.35)",
          fontSize:     10,
          fontWeight:   700,
          color:        "#fff",
          letterSpacing: "0.04em",
        }}>
          {name}
        </span>
      )}
    </motion.div>
  );
}

// ─── Pastille ingrédient ───────────────────────────────────

function IngPill({ icon, name, index, primary }: { icon?: string; name: string; index: number; primary: string; bg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.72, y: 8 }}
      animate={{ opacity: 1, scale: 1,    y: 0 }}
      transition={{ delay: 0.28 + index * 0.055, duration: 0.38, ease: [0.34, 1.4, 0.64, 1] }}
      style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
    >
      <div title={name} style={{ width: 52, height: 52, borderRadius: 16, background: `${primary}09`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: `0 2px 8px ${primary}10`, border: `0.5px solid ${primary}14` }}>
        {icon ?? "🌿"}
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: `${primary}60`, fontFamily: "sans-serif", textAlign: "center", maxWidth: 54, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {name}
      </span>
    </motion.div>
  );
}

// ─── Composant principal ────────────────────────────────────

type Props = {
  item:    MenuItem | null;
  colors:  Colors;
  config:  any;
  onClose: () => void;
  text:    TextConfig;
};

export default function ItemModal({ item, colors, onClose, text }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen]       = useState(false);

  useEffect(() => { setSelectedVariant(null); setLightboxOpen(false); }, [item?.id]);

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

  // Prix de base (variante ou base)
  const basePrice = selectedVariant !== null && item?.variants
    ? item.variants[selectedVariant].price
    : item?.price ?? 0;
  const displayCurrency = selectedVariant !== null && item?.variants
    ? item.variants[selectedVariant].currency
    : item?.currency ?? "EUR";

  // Promo
  const hasPromo = !!(item?.promotion_active && (item?.promotion ?? 0) > 0);
  const discountedPrice = hasPromo ? promoPrice(basePrice, item!.promotion!) : null;
  const displayPrice = hasPromo ? discountedPrice! : basePrice;

  const accent  = colors.accent;
  const primary = colors.primary;
  const dark    = colors.primary;
  const muted   = `${colors.accent}70`;

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
          style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
        >
          {/* Lightbox */}
          <AnimatePresence>
            {lightboxOpen && item?.image_url && (
              <Lightbox
                src={item.image_url}
                alt={item.name}
                onClose={() => setLightboxOpen(false)}
              />
            )}
          </AnimatePresence>
          {/* ── Bottom sheet ── */}
          <motion.div
            key="sheet"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0,      opacity: 1   }}
            exit={{ y: "100%",    opacity: 0   }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: 480, maxHeight: "92vh", borderRadius: "28px 28px 0 0", background: colors.bg, display: "flex", flexDirection: "column", overflow: "visible" }}
          >
            <DragHandle />

            {/* ══ HEADER ══ */}
            <div style={{
              position:      "relative",
              width:         "100%",
              minHeight:     210,
              paddingBottom: OVERHANG + 20,
              background:    `linear-gradient(155deg, ${accent} 0%, ${accent}ee 100%)`,
              borderRadius:  "28px 28px 52% 52% / 28px 28px 90px 90px",
              flexShrink:    0,
              display:       "flex",
              flexDirection: "column",
              alignItems:    "center",
              paddingTop:    44,
              overflow:      "visible",
              zIndex:        1,
            }}>
              {/* Texture */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", pointerEvents: "none" }}>
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
              <span style={{ position: "absolute", top: 42, left: 24, fontSize: 26, zIndex: 2, pointerEvents: "none", transform: "rotate(-22deg)", opacity: 0.9 }}>🥬</span>
              <span style={{ position: "absolute", bottom: OVERHANG + 40, right: 24, fontSize: 18, zIndex: 2, pointerEvents: "none", opacity: 0.55, transform: "rotate(16deg)" }}>🌿</span>

              {/* Bouton retour */}
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={onClose} aria-label="Fermer" style={{ position: "absolute", top: 16, left: 16, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.20)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.30)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 20 }}>
                <ArrowLeft size={16} color="#fff" />
              </motion.button>

              {/* Bouton partage */}
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} aria-label="Partager" onClick={() => { if (navigator.share) navigator.share({ title: item.name, text: item.description ?? "" }).catch(() => {}); }} style={{ position: "absolute", top: 16, right: 16, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.20)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.30)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 20 }}>
                <Share2 size={15} color="#fff" />
              </motion.button>

              {/* Titre */}
              <h2 style={{ fontSize: "clamp(22px, 6vw, 28px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", textAlign: "center", padding: "0 64px", zIndex: 2, lineHeight: 1.12, margin: 0, textShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
                {item.name}
              </h2>

              <DietBadges isVegetarian={item.is_vegetarian} isSpicy={item.is_spicy} labelVegetarian={text.vegetarian} labelSpicy={text.spicy} />

              {/* Badge promo dans le header */}
              {hasPromo && (
                <PromoHeaderBadge pct={item.promotion!} name={item.promotion_name ?? ""} />
              )}

              <DishImage src={item.image_url} alt={item.name} accent={accent} bg={colors.bg} onExpand={() => setLightboxOpen(true)} />
            </div>

            {/* ══ SECTION BASSE ══ */}
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", display: "flex", flexDirection: "column", gap: 20, padding: `${OVERHANG + 28}px 22px 36px`, background: colors.bg }}>

              {/* ── Prix + disponibilité ── */}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingBottom: 18, borderBottom: `0.5px solid ${colors.primary}12` }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: muted, fontFamily: "sans-serif", marginBottom: 4 }}>
                    {text.prix}
                  </p>

                  {hasPromo ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {/* Prix original barré */}
                      <span style={{ fontSize: 14, fontWeight: 600, color: `${dark}40`, textDecoration: "line-through", letterSpacing: "-0.02em", lineHeight: 1 }}>
                        {fmt(basePrice, displayCurrency)}
                      </span>
                      {/* Prix promoé en rouge */}
                      <motion.div
                        initial={{ scale: 0.88 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        style={{ display: "flex", alignItems: "center", gap: 8 }}
                      >
                        <span style={{ fontSize: 30, fontWeight: 900, color: "#e53935", letterSpacing: "-0.04em", lineHeight: 1 }}>
                          {fmt(displayPrice, displayCurrency, text.offert)}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 800, background: "linear-gradient(135deg,#e53935,#ff5252)", color: "#fff", padding: "3px 8px", borderRadius: 99, boxShadow: "0 3px 10px rgba(229,57,53,0.35)" }}>
                          -{item.promotion}%
                        </span>
                      </motion.div>
                      {/* Nom de la promo */}
                      {item.promotion_name && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#e53935", letterSpacing: "0.06em", marginTop: 2, opacity: 0.8 }}>
                          {item.promotion_name}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p style={{ fontSize: 30, fontWeight: 900, color: dark, letterSpacing: "-0.04em", lineHeight: 1 }}>
                      {fmt(displayPrice, displayCurrency)}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.accent, display: "inline-block" }} />
                  <span style={{ fontSize: 10, color: muted, fontFamily: "sans-serif" }}>{text.disponible}</span>
                </div>
              </div>

              {/* ── Variantes ── */}
              {item.variants && item.variants.length > 0 && (
                <div>
                  <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: muted, fontFamily: "sans-serif", marginBottom: 10 }}>
                    {text.variants}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {item.variants.map((v, i) => {
                      const sel = selectedVariant === i;
                      return (
                        <motion.button
                          key={i}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedVariant(sel ? null : i)}
                          style={{ padding: "9px 16px", borderRadius: 12, border: `1.5px solid ${sel ? accent : `${primary}18`}`, background: sel ? `${accent}14` : `${primary}06`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, transition: "border-color 0.18s, background 0.18s" }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 700, color: sel ? accent : dark }}>{v.label}</span>
                          <span style={{ fontSize: 11, color: sel ? accent : muted }}>{fmt(v.price, v.currency)}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Ingrédients ── */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: dark, marginBottom: 12, letterSpacing: "-0.01em" }}>
                    {text.ingredients}
                  </p>
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
                    {item.ingredients.map((ing, i) => (
                      <IngPill key={i} icon={ing.icon} name={ing.name} index={i} primary={primary} bg={colors.bg} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Description ── */}
              {item.description && (
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: dark, marginBottom: 8, letterSpacing: "-0.01em" }}>
                    {text.description}
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.85, color: muted, fontFamily: "sans-serif" }}>
                    {item.description}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}