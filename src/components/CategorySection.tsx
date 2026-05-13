/**
 * CategorySection.tsx
 * ────────────────────
 * Section d'une catégorie avec :
 *   • Titre animé en slide-in
 *   • Grille de cartes avec AnimatePresence (transition douce filtre actif ↔ inactif)
 *   • paddingTop 48px sur la grille pour accueillir les images circulaires débordantes
 *
 * Dépendances : framer-motion
 */

import { motion, AnimatePresence } from "framer-motion";
import ItemCard from "./ItemCard";
import type { Category, MenuItem, Colors } from "./types";

type CategorySectionProps = {
  category: Category;
  items: MenuItem[];
  colors: Colors;
  /** Index global de départ pour la numérotation et le stagger */
  globalIndex: number;
  onOpen: (item: MenuItem) => void;
};

export default function CategorySection({
  category,
  items,
  colors,
  globalIndex,
  onOpen,
}: CategorySectionProps) {
  if (items.length === 0) return null;

  return (
    <motion.section
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ marginBottom: 8 }}
    >
      {/* ── Titre de catégorie ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "16px 16px 0",
          borderTop: `1px solid ${colors.primary}10`,
        }}
      >
        {category.icon && (
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 22, delay: 0.05 }}
            style={{ fontSize: 18 }}
          >
            {category.icon}
          </motion.span>
        )}
        <h2
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: `${colors.primary}45`,
            fontFamily: "sans-serif",
          }}
        >
          {category.name}
        </h2>
      </motion.div>

      {/* ── Grille des cartes ── */}
      {/*
        paddingTop: 48 = espace pour les images circulaires qui débordent vers le haut.
        overflow: visible est indispensable pour que les images ne soient pas coupées.
      */}
      <div
        style={{
          padding: "48px 16px 8px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
          gap: 14,
          overflow: "visible",
        }}
      >
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
}

/*
 * ─────────────────────────────────────────────────────────────
 * INTÉGRATION DANS MenuPage.tsx
 * ─────────────────────────────────────────────────────────────
 *
 * import CategorySection from "./CategorySection";
 *
 * Remplacer le bloc <main> existant par :
 *
 *   <main style={{ paddingBottom: 32, paddingTop: 8, overflow: "visible" }}>
 *     <AnimatePresence mode="wait">
 *       {filteredCats.map(cat => {
 *         const catItems = itemsByCategory[cat.id] ?? [];
 *         const startIdx = globalIdx;
 *         globalIdx += catItems.length;
 *         return (
 *           <CategorySection
 *             key={cat.id}
 *             category={cat}
 *             items={catItems}
 *             colors={colors}
 *             globalIndex={startIdx}
 *             onOpen={openModal}
 *           />
 *         );
 *       })}
 *     </AnimatePresence>
 *   </main>
 *
 * Note : le mode="wait" assure une transition propre
 * quand l'utilisateur change de catégorie dans la nav.
 */