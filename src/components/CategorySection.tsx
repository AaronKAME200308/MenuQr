// components/CategorySection.tsx — v3 (grille responsive, titre lisible)
// Mêmes props que la v2.
//  - Grille CSS auto-fill : 2 colonnes sur mobile, 3-4 sur tablette/desktop
//  - Titre de section aligné à gauche, 18px, avec compteur de plats
//  - Plus de pastille 11px en majuscules espacées

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { FC } from "react";

import ItemCard from "./ItemCard";
import type { Category, MenuItem, Colors, CardConfig } from "./types";

interface CategorySectionProps {
  category:        Category;
  items:           MenuItem[];
  colors:          Colors;
  config:          CardConfig;
  globalIndex:     number;
  onOpen:          (item: MenuItem) => void;
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
  labelOffert,
}) => {
  const reduce = useReducedMotion();
  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) return null;

  const headingId = `cat-${category.id}`;

  return (
    <motion.section
      layout={!reduce}
      aria-labelledby={headingId}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      style={{ marginBottom: 20 }}
    >
      {/* ── Titre de catégorie ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 16px 4px" }}>
        {category.icon && (
          <span
            aria-hidden="true"
            style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, background: colors.accent,
            }}
          >
            {category.icon}
          </span>
        )}
        <h2
          id={headingId}
          style={{
            margin: 0, fontSize: 20, fontWeight: 800, lineHeight: 1.1,
            letterSpacing: "-0.01em", color: colors.primary,
          }}
        >
          {category.name}
        </h2>
        <span
          style={{
            fontSize: 12, fontWeight: 700, color: colors.primary,
            background: `${colors.primary}14`, borderRadius: 999, padding: "4px 10px",
          }}
        >
          {safeItems.length}
        </span>
        <div aria-hidden="true" style={{ flex: 1, height: 1, background: `${colors.primary}1f` }} />
      </div>

      {/* ── Grille des cartes ── */}
      <div
        style={{
          // Cartes centrées comme à l'origine : largeur 148px, retour à la ligne centré.
          display:             "flex",
          flexWrap:            "wrap",
          justifyContent:      "center",
          gap:                 14,
          padding:             "12px 16px 8px",
        }}
      >
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
              labelOffert={labelOffert}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default CategorySection;