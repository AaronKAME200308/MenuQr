// components/CategorySection.tsx — v2 (typages stricts)

import { motion, AnimatePresence } from "framer-motion";
import type { FC }                 from "react";

import ItemCard             from "./ItemCard";
import type { Category, MenuItem, Colors, CardConfig } from "./types";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface CategorySectionProps {
  category:    Category;
  items:       MenuItem[];
  colors:      Colors;
  config:      CardConfig;
  /** Index global de départ (stagger + numérotation) */
  globalIndex: number;
  onOpen:      (item: MenuItem) => void;
}

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

const CategorySection: FC<CategorySectionProps> = ({
  category,
  items,
  colors,
  globalIndex,
  onOpen,
}) => {
  if (items.length === 0) return null;


  return (
    <motion.section
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      style={{ marginBottom: 8 }}
    >
      {/* ── Titre de catégorie ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x:   0  }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display:     "flex",
          alignItems:  "center",
          gap:         8,
          padding:     "16px 16px 0",
          borderTop:   `1px solid ${colors.primary}10`,
        }}
      >
        {category.icon && (
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate:   0 }}
            transition={{ type: "spring", stiffness: 360, damping: 22, delay: 0.05 }}
            style={{ fontSize: 18 }}
          >
            {category.icon}
          </motion.span>
        )}
        <h2 style={{
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color:         `${colors.primary}45`,
          fontFamily:    "sans-serif",
        }}>
          {category.name}
        </h2>
      </motion.div>

      {/* ── Grille des cartes ── */}
      {/*
        paddingTop: 48 = espace pour les images circulaires débordantes.
        overflow: visible indispensable pour ne pas clipper les images.
      */}
      <div style={{
        padding:         "48px 16px 8px",
        display:         "flex",
        flexWrap:        "wrap",
        justifyContent:  "center",
        gap:             14,
        overflow:        "visible",
      }}>
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <ItemCard
              key={item.id}
              item={item}
              colors={colors}
              index={globalIndex + i}
              onOpen={onOpen}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default CategorySection;