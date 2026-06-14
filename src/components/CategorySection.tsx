// components/CategorySection.tsx — v2 (typages stricts)

import { motion, AnimatePresence } from "framer-motion";
import type { FC }                 from "react";

import ItemCard             from "./ItemCard";
import type { Category, MenuItem, Colors, CardConfig } from "./types";

interface CategorySectionProps {
  category:        Category;
  items:           MenuItem[];
  colors:          Colors;
  config:          CardConfig;
  globalIndex:     number;
  onOpen:          (item: MenuItem) => void;
  /** Labels traduits par MenuPage */
  labelVoir:       string;
  labelTailles:    string;
  labelBestseller: string;
  labelPopular:    string;
  labelNew:        string;
  labelVegetarian: string;
  labelSpicy:      string;
  labelOffert:     string;
}

const CategorySection: FC<CategorySectionProps> = ({
  category,
  items,
  colors,
  globalIndex,
  onOpen,
  labelVoir,
  labelTailles,
  labelBestseller,
  labelPopular,
  labelNew,
  labelVegetarian,
  labelSpicy,
}) => {
  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) return null;

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
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            8,
          padding:        "10px 20px",
          margin:         "16px 16px 0",
          borderRadius:   999,
          background:     colors.accent,
          border:         `1px solid ${colors.accent}`,
          alignSelf:      "flex-start",
          width:          "fit-content",
          marginLeft:     "auto",
          marginRight:    "auto",
        }}
      >
        {category.icon && (
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate:   0 }}
            transition={{ type: "spring", stiffness: 360, damping: 22, delay: 0.05 }}
            style={{ fontSize: 18, lineHeight: 1, display: "flex", alignItems: "center" }}
          >
            {category.icon}
          </motion.span>
        )}
        <h2 style={{
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color:         colors.primary,
          fontFamily:    "sans-serif",
          margin:        0,
          lineHeight:    1,
        }}>
          {category.name}
        </h2>
      </motion.div>

      {/* ── Grille des cartes ── */}
      <div style={{
        padding:        "48px 16px 8px",
        display:        "flex",
        flexWrap:       "wrap",
        justifyContent: "center",
        gap:            14,
        overflow:       "visible",
      }}>
        <AnimatePresence mode="popLayout">
          {safeItems.map((item, i) => (
            <ItemCard
              key={item.id}
              item={item}
              colors={colors}
              index={globalIndex + i}
              onOpen={onOpen}
              labelVoir={labelVoir}
              labelTailles={labelTailles}
              labelBestseller={labelBestseller}
              labelPopular={labelPopular}
              labelNew={labelNew}
              labelVegetarian={labelVegetarian}
              labelSpicy={labelSpicy}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default CategorySection;