/**
 * ItemModal.tsx — v7 (lisibilité, image pleine largeur, accessibilité)
 * Mêmes props que la v6 : <ItemModal item colors config onClose text />
 *
 * Changements vs v6 :
 *  - Image du plat pleine largeur en haut (zoomable) au lieu du cercle qui déborde
 *  - Suppression des emojis décoratifs 🥬/🌿 affichés sur TOUS les plats
 *  - Textes >= 12px, contrastes pleins, boutons 44px
 *  - role="dialog" + aria-modal, focus sur le bouton fermer, verrouillage du scroll
 *  - promoPrice reçoit la devise (arrondi correct en XAF)
 *  - Animations réduites si prefers-reduced-motion
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Leaf, Flame, Share2, Tag, ZoomIn } from "lucide-react";
import { fmt, promoPrice } from "./ItemCard";
import type { MenuItem, Colors, TextConfig } from "./types";

// ─── Lightbox ──────────────────────────────────────────────

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", h, true);
    return () => window.removeEventListener("keydown", h, true);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      role="dialog" aria-modal="true" aria-label={alt}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Fermer l'image"
        style={{ position: "absolute", top: 16, right: 16, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        <X size={20} color="#fff" aria-hidden="true" />
      </button>
      <img
        src={src} alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "100%", maxHeight: "88vh", objectFit: "contain", borderRadius: 16 }}
      />
    </motion.div>
  );
}

// ─── Pastille ronde utilitaire ─────────────────────────────

const roundBtn: React.CSSProperties = {
  width: 44, height: 44, borderRadius: "50%",
  background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.35)",
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
};

const chip: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 5,
  padding: "6px 11px", borderRadius: 999, fontSize: 12, fontWeight: 700, lineHeight: 1,
};

// ─── Composant principal ───────────────────────────────────

type Props = {
  item:    MenuItem | null;
  colors:  Colors;
  config:  unknown;
  onClose: () => void;
  text:    TextConfig;
};

export default function ItemModal({ item, colors, onClose, text }: Props) {
  const reduce = useReducedMotion();
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen]       = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setSelectedVariant(null); setLightboxOpen(false); }, [item?.id]);

  useEffect(() => {
    if (!item) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", h);
  }, [item, onClose]);

  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  const variant         = selectedVariant !== null && item?.variants ? item.variants[selectedVariant] : null;
  const basePrice       = variant ? variant.price    : item?.price ?? 0;
  const displayCurrency = variant ? variant.currency : item?.currency ?? "XAF";

  const hasPromo        = !!(item?.promotion_active && (item?.promotion ?? 0) > 0);
  const discounted      = hasPromo ? promoPrice(basePrice, item!.promotion!, displayCurrency) : null;
  const displayPrice    = discounted ?? basePrice;

  const { accent, primary, main: dark, bg } = colors;
  const muted = dark;               // texte secondaire : couleur pleine + opacité contrôlée
  const label: React.CSSProperties = { margin: "0 0 8px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: primary, opacity: 0.75 };

  const share = (): void => {
    if (item && navigator.share) navigator.share({ title: item.name, text: item.description ?? "" }).catch(() => {});
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.55)" }}
        >
          <AnimatePresence>
            {lightboxOpen && item.image_url && (
              <Lightbox src={item.image_url} alt={item.name} onClose={() => setLightboxOpen(false)} />
            )}
          </AnimatePresence>

          <motion.div
            key="sheet"
            role="dialog" aria-modal="true" aria-label={item.name}
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: 520, maxHeight: "92vh", borderRadius: "24px 24px 0 0", background: bg, display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            {/* ══ Image ══ */}
            <div style={{ position: "relative", flexShrink: 0, height: "min(46vh, 300px)", background: `${accent}22` }}>
              {item.image_url ? (
                <button
                  onClick={() => setLightboxOpen(true)}
                  aria-label={`Agrandir : ${item.name}`}
                  style={{ all: "unset", display: "block", width: "100%", height: "100%", cursor: "zoom-in" }}
                >
                  <img src={item.image_url} alt={item.name} decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <span aria-hidden="true" style={{ position: "absolute", right: 12, bottom: 12, ...roundBtn, width: 36, height: 36 }}>
                    <ZoomIn size={16} color="#fff" />
                  </span>
                </button>
              ) : (
                <div aria-hidden="true" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>🍽️</div>
              )}

              <div aria-hidden="true" style={{ position: "absolute", inset: "0 0 auto 0", height: 90, background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)", pointerEvents: "none" }} />

              <button ref={closeRef} onClick={onClose} aria-label="Fermer" style={{ ...roundBtn, position: "absolute", top: 12, left: 12 }}>
                <X size={20} color="#fff" aria-hidden="true" />
              </button>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button onClick={share} aria-label="Partager" style={{ ...roundBtn, position: "absolute", top: 12, right: 12 }}>
                  <Share2 size={18} color="#fff" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* ══ Contenu ══ */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20, padding: "20px 20px 32px" }}>

              {/* Titre + badges */}
              <div>
                <h2 style={{ margin: 0, fontSize: "clamp(22px, 6vw, 28px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.02em", color: primary, textAlign: "left" }}>
                  {item.name}
                </h2>
                {(item.is_vegetarian || item.is_spicy || hasPromo) && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {hasPromo && (
                      <span style={{ ...chip, background: "#d32f2f", color: "#fff" }}>
                        <Tag size={12} aria-hidden="true" />
                        -{item.promotion}%{item.promotion_name ? ` · ${item.promotion_name}` : ""}
                      </span>
                    )}
                    {item.is_vegetarian && (
                      <span style={{ ...chip, background: "#e8f7ee", color: "#1d6b3c" }}>
                        <Leaf size={12} aria-hidden="true" /> {text.vegetarian}
                      </span>
                    )}
                    {item.is_spicy && (
                      <span style={{ ...chip, background: "#fff1ea", color: "#b33a10" }}>
                        <Flame size={12} aria-hidden="true" /> {text.spicy}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Prix + disponibilité */}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, paddingBottom: 16, borderBottom: `1px solid ${primary}1f` }}>
                <div>
                  <p style={label}>{text.prix}</p>
                  {hasPromo ? (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 32, fontWeight: 900, color: "#c62828", letterSpacing: "-0.03em", lineHeight: 1 }}>
                        {fmt(displayPrice, displayCurrency)}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: muted, opacity: 0.7, textDecoration: "line-through" }}>
                        {fmt(basePrice, displayCurrency)}
                      </span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 32, fontWeight: 900, color: dark, letterSpacing: "-0.03em", lineHeight: 1 }}>
                      {fmt(displayPrice, displayCurrency)}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: "#2e9a5a" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: dark }}>{text.disponible}</span>
                </div>
              </div>

              {/* Variantes */}
              {item.variants && item.variants.length > 0 && (
                <div role="radiogroup" aria-label={text.variants}>
                  <p style={label}>{text.variants}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {item.variants.map((v, i) => {
                      const sel = selectedVariant === i;
                      return (
                        <button
                          key={i}
                          role="radio" aria-checked={sel}
                          onClick={() => setSelectedVariant(sel ? null : i)}
                          style={{
                            minHeight: 48, padding: "8px 16px", borderRadius: 14, cursor: "pointer",
                            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
                            border: `2px solid ${sel ? accent : `${primary}26`}`,
                            background: sel ? `${accent}1f` : "transparent",
                            transition: "border-color 0.18s, background 0.18s",
                          }}
                        >
                          <span style={{ fontSize: 14, fontWeight: 700, color: dark }}>{v.label}</span>
                          <span style={{ fontSize: 13, color: dark, opacity: 0.8 }}>{fmt(v.price, v.currency)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              {item.description && (
                <div>
                  <p style={label}>{text.description}</p>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: dark, textAlign: "left" }}>
                    {item.description}
                  </p>
                </div>
              )}

              {/* Ingrédients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <p style={label}>{text.ingredients}</p>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {item.ingredients.map((ing, i) => (
                      <li key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 999, background: `${primary}0f`, border: `1px solid ${primary}1f`, fontSize: 13, fontWeight: 600, color: dark }}>
                        {ing.icon && <span aria-hidden="true" style={{ fontSize: 16 }}>{ing.icon}</span>}
                        {ing.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Allergènes */}
              {item.allergens && (
                <div role="note" style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: 14, background: "#fff4e0", border: "1px solid #f0b95a" }}>
                  <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1.2 }}>⚠️</span>
                  <div>
                    <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a4400" }}>
                      {text.allergenes}
                    </p>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#5c3300", textAlign: "left" }}>
                      {item.allergens}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}