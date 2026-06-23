// CategoryNav.tsx — v4 (i18n)
// Prop allLabel pour traduire "Tout" / "All" / "الكل"

import { useRef, useState, useEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";
import type { Colors, Category } from "./types";

type CategoryNavProps = {
  colors:         Colors;
  activeCats:     Category[];
  activeCategory: string;
  setActive:      (id: string) => void;
  /** Label traduit de la pilule "Tout" */
  allLabel?:      string;
};

export default function CategoryNav({
  colors,
  activeCats = [],
  activeCategory,
  setActive,
  allLabel = "Tout",
}: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = navRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [activeCats]); // activeCats est normalisé à [] par défaut

  const allCats: Pick<Category, "id" | "name" | "icon">[] = [
    { id: "all", name: allLabel, icon: "🍽️" },
    ...(Array.isArray(activeCats) ? activeCats : []),
  ];

  const handleClick = (id: string, el: HTMLButtonElement | null) => {
    setActive(id);
    if (el && navRef.current) {
      const nav = navRef.current;
      const left = el.offsetLeft - nav.clientWidth / 2 + el.clientWidth / 2;
      nav.scrollTo({ left, behavior: "smooth" });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Gradient bord gauche */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40, background: `linear-gradient(to right, ${colors.bg}, transparent)`, zIndex: 2, pointerEvents: "none", opacity: canScrollLeft ? 1 : 0, transition: "opacity 0.3s" }} />
      {/* Gradient bord droit */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 40, background: `linear-gradient(to left, ${colors.bg}, transparent)`, zIndex: 2, pointerEvents: "none", opacity: canScrollRight ? 1 : 0, transition: "opacity 0.3s" }} />

      <motion.div
        ref={navRef}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "flex", gap: 8, padding: "10px 16px 12px", overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        <LayoutGroup id="cat-nav-v4">
          {allCats.map((cat, idx) => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.045, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleClick(cat.id, e.currentTarget as HTMLButtonElement)}
                style={{
                  position: "relative",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: isActive ? "9px 18px" : "8px 16px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: "sans-serif",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  outline: "none",
                  border: isActive ? "none" : `1.5px solid ${colors.accent}80`,
                  background: isActive ? "transparent" : `${colors.accent}09`,
                  color: isActive ? colors.bg : `${colors.main}70`,
                  boxShadow: isActive ? `0 6px 20px ${colors.accent}35, 0 2px 6px ${colors.accent}20` : "0 1px 3px rgba(0,0,0,0.08)",
                  transition: "color 0.2s, border-color 0.2s, box-shadow 0.2s, padding 0.2s",
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill-v4"
                    style={{ position: "absolute", inset: 0, borderRadius: 999, background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accent}dd 100%)`, boxShadow: `0 6px 20px ${colors.accent}40, 0 2px 6px ${colors.accent}25, inset 0 1px 0 rgba(255,255,255,0.22)`, zIndex: 0 }}
                    transition={{ type: "spring", stiffness: 440, damping: 34 }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1, fontSize: 14, lineHeight: 1 }}>{cat.icon ?? ""}</span>
                <span style={{ position: "relative", zIndex: 1, letterSpacing: isActive ? "-0.01em" : "0" }}>{cat.name}</span>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ position: "relative", zIndex: 1, width: 5, height: 5, borderRadius: "50%", background: `${colors.bg}60`, marginLeft: 2 }}
                  />
                )}
              </motion.button>
            );
          })}
        </LayoutGroup>
      </motion.div>
    </div>
  );
}