/**
 * CategoryNav.tsx
 * ───────────────
 * Barre de navigation des catégories — pilules glassmorphism animées
 * avec Framer Motion.
 *
 * Dépendances : framer-motion
 * Usage dans MenuPage : voir commentaire en bas de fichier
 */

import { useRef } from "react";
import { motion, LayoutGroup } from "framer-motion";
import type { Colors, Category } from "./types";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

type CategoryNavProps = {
  colors: Colors;
  /** Catégories qui ont au moins un item disponible */
  activeCats: Category[];
  activeCategory: string;
  setActive: (id: string) => void;
};

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

export default function CategoryNav({
  colors,
  activeCats,
  activeCategory,
  setActive,
}: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);

  // "Tout" en premier
  const allCats: Pick<Category, "id" | "name" | "icon">[] = [
    { id: "all", name: "Tout", icon: "🍽️" },
    ...activeCats,
  ];

  // Scroll auto vers la pilule active
  const handleClick = (id: string, el: HTMLButtonElement | null) => {
    setActive(id);
    if (el && navRef.current) {
      const nav = navRef.current;
      const left = el.offsetLeft - nav.clientWidth / 2 + el.clientWidth / 2;
      nav.scrollTo({ left, behavior: "smooth" });
    }
  };

  return (
    <motion.div
      ref={navRef}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        padding: "10px 14px",
        overflowX: "auto",
        display: "flex",
        gap: 8,
        scrollbarWidth: "none",
        // Glassmorphism
        background: `${colors.bg}cc`,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${colors.primary}10`,
        boxShadow: `0 1px 0 ${colors.primary}08, inset 0 1px 0 ${colors.primary}08`,
      }}
    >
      <LayoutGroup id="cat-nav">
        {allCats.map((cat, idx) => {
          const isActive = activeCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: idx * 0.055,
                duration: 0.38,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              whileTap={{ scale: 0.93 }}
              onClick={(e) => handleClick(cat.id, e.currentTarget as HTMLButtonElement)}
              style={{
                position: "relative",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                fontFamily: "sans-serif",
                whiteSpace: "nowrap",
                cursor: "pointer",
                outline: "none",
                border: "none",
                // fond transparent — le layoutId gère le fond actif
                background: isActive
                  ? "transparent"
                  : "rgba(255,255,255,0.055)",
                color: isActive ? colors.bg : `${colors.primary}65`,
                transition: "color 0.25s, background 0.25s",
              }}
            >
              {/* ── Fond animé de la pilule active (layout animation) ── */}
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 999,
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}cc 100%)`,
                    boxShadow: `0 4px 20px ${colors.primary}40, inset 0 1px 0 rgba(255,255,255,0.18)`,
                    zIndex: 0,
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              {/* Contenu au-dessus du fond */}
              <span style={{ position: "relative", zIndex: 1, fontSize: 15 }}>
                {cat.icon ?? ""}
              </span>
              <span style={{ position: "relative", zIndex: 1 }}>{cat.name}</span>
            </motion.button>
          );
        })}
      </LayoutGroup>
    </motion.div>
  );
}

/*
 * ─────────────────────────────────────────────────────────────
 * INTÉGRATION DANS MenuPage.tsx
 * ─────────────────────────────────────────────────────────────
 *
 * 1. Importer :
 *    import CategoryNav from "./CategoryNav";
 *
 * 2. Remplacer le bloc <nav …>…</nav> par :
 *
 *    <CategoryNav
 *      colors={colors}
 *      activeCats={activeCats}
 *      activeCategory={activeCategory}
 *      setActive={setActive}
 *    />
 *
 * C'est tout. Le composant gère scroll auto + animation spring interne.
 */