// components/StickyBar.tsx — v2 (i18n)
// Barre sticky : SearchBar + CategoryNav + LanguagePicker.

import { motion, AnimatePresence } from "framer-motion";
import SearchBar      from "./SearchBar";
import CategoryNav    from "./CategoryNav";
import LanguagePicker from "./languagePicker";
import type { Colors, Category, SupportedLang, LangMeta } from "./types";

type Props = {
  colors:         Colors;
  activeCats:     Category[];
  activeCategory: string;
  setActive:      (id: string) => void;
  searchQuery:    string;
  setSearchQuery: (v: string) => void;
  totalResults:   number;
  // i18n
  lang:           SupportedLang;
  availableLangs: LangMeta[];
  setLang:        (l: SupportedLang) => void;
  // ui strings
  searchPlaceholder: string;
  searchResultsLabel: (count: number) => string;
  allCategoriesLabel: string;
};

export default function StickyBar({
  colors,
  activeCats,
  activeCategory,
  setActive,
  searchQuery,
  setSearchQuery,
  totalResults,
  lang,
  availableLangs,
  setLang,
  searchPlaceholder,
  searchResultsLabel,
  allCategoriesLabel,
}: Props) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: `${colors.bg}d0`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${colors.primary}10`,
        boxShadow: `0 4px 24px ${colors.bg}80`,
      }}
    >
      {/* Ligne du haut : SearchBar + LanguagePicker */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px 4px" }}>
        <div style={{ flex: 1 }}>
          <SearchBar
            query={searchQuery}
            setQuery={setSearchQuery}
            colors={colors}
            resultCount={totalResults}
            placeholder={searchPlaceholder}
            resultsLabel={searchResultsLabel}
          />
        </div>
        <LanguagePicker
          lang={lang}
          availableLangs={availableLangs}
          setLang={setLang}
          colors={colors}
        />
      </div>

      {/* CategoryNav — masqué pendant la recherche */}
      <AnimatePresence>
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            style={{ overflow: "hidden" }}
          >
            <CategoryNav
              colors={colors}
              activeCats={activeCats}
              activeCategory={activeCategory}
              setActive={setActive}
              allLabel={allCategoriesLabel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}