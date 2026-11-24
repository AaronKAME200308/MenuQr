// CategoryNav.tsx — v5 (cibles 44px, texte lisible, moins de mouvement)
// Mêmes props que la v4.
//  - Pastilles de 44px de haut, texte 14px
//  - Plus de changement de padding à l'activation (évite le décalage des voisines)
//  - Pastille active glissante conservée (layoutId), survol/zoom supprimés
//  - Bouton « tab » accessible (role=tablist / aria-selected)
//  - prefers-reduced-motion respecté

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, LayoutGroup, useReducedMotion } from "framer-motion";
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
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

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
  }, [activeCats, checkScroll]);

  const allCats: Pick<Category, "id" | "name" | "icon">[] = [
    { id: "all", name: allLabel, icon: "🍽️" },
    ...(Array.isArray(activeCats) ? activeCats : []),
  ];

  const handleClick = (id: string, el: HTMLButtonElement | null) => {
    setActive(id);
    if (el && navRef.current) {
      const nav = navRef.current;
      const left = el.offsetLeft - nav.clientWidth / 2 + el.clientWidth / 2;
      nav.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
    }
  };

  const fade = (side: "left" | "right", visible: boolean): React.CSSProperties => ({
    position: "absolute", [side]: 0, top: 0, bottom: 0, width: 40,
    background: `linear-gradient(to ${side === "left" ? "right" : "left"}, ${colors.bg}, transparent)`,
    zIndex: 2, pointerEvents: "none", opacity: visible ? 1 : 0, transition: "opacity 0.3s",
  });

  return (
    <div style={{ position: "relative" }}>
      <div aria-hidden="true" style={fade("left", canScrollLeft)} />
      <div aria-hidden="true" style={fade("right", canScrollRight)} />

      <div
        ref={navRef}
        role="tablist"
        style={{ display: "flex", gap: 8, padding: "8px 16px 12px", overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        <LayoutGroup id="cat-nav-v5">
          {allCats.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={(e) => handleClick(cat.id, e.currentTarget)}
                style={{
                  position: "relative",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minHeight: 44,
                  padding: "0 18px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: isActive ? 800 : 600,
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  border: `1.5px solid ${isActive ? "transparent" : `${colors.main}40`}`,
                  background: "transparent",
                  color: isActive ? colors.bg : colors.main,
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill-v5"
                    aria-hidden="true"
                    style={{ position: "absolute", inset: -1.5, borderRadius: 999, background: colors.accent, boxShadow: `0 4px 14px ${colors.accent}55`, zIndex: 0 }}
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 440, damping: 34 }}
                  />
                )}
                <span aria-hidden="true" style={{ position: "relative", zIndex: 1, fontSize: 16, lineHeight: 1 }}>{cat.icon ?? ""}</span>
                <span style={{ position: "relative", zIndex: 1 }}>{cat.name}</span>
              </button>
            );
          })}
        </LayoutGroup>
      </div>
    </div>
  );
}