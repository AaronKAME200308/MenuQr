// components/SearchBar.tsx — v3 (lisibilité, accessibilité)
// Mêmes props que la v2.
//  - Texte saisi à 16px (évite le zoom automatique d'iOS au focus)
//  - type="search" + aria-label (le placeholder ne sert plus de seul libellé)
//  - Bouton effacer 44px avec aria-label
//  - Compteur de résultats en 12px, annoncé aux lecteurs d'écran (aria-live)
//  - Focus visible sur le champ via :focus-within

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import type { Colors } from "./types";

type Props = {
  query:        string;
  setQuery:     (v: string) => void;
  colors:       Colors;
  resultCount:  number;
  placeholder?:    string;
  resultsLabel?:   (count: number) => string;
  /** Libellé accessible du bouton « effacer » */
  clearLabel?:     string;
};

export default function SearchBar({
  query,
  setQuery,
  colors,
  resultCount,
  placeholder  = "Rechercher un plat…",
  resultsLabel,
  clearLabel   = "Effacer la recherche",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const countLabel = resultsLabel
    ? resultsLabel(resultCount)
    : `${resultCount} résultat${resultCount !== 1 ? "s" : ""}`;

  return (
    <div
      role="search"
      style={{
        display: "flex", alignItems: "center", gap: 4,
        minHeight: 48,
        background: colors.bg,
        border: `2px solid ${query ? colors.accent : `${colors.main}40`}`,
        borderRadius: 16,
        padding: "0 6px 0 14px",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: query ? `0 4px 18px ${colors.accent}22` : "none",
      }}
    >
      <Search size={18} color={colors.main} style={{ flexShrink: 0 }} aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        aria-label={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none",
          padding: "12px 8px", fontSize: 16, color: colors.main, fontFamily: "inherit",
          WebkitAppearance: "none", appearance: "none",
        }}
      />

      {/* Annonce vocale du nombre de résultats */}
      <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {query ? countLabel : ""}
      </span>

      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: colors.main, background: `${colors.accent}33`, borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap" }}>
              {countLabel}
            </span>
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              aria-label={clearLabel}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44 }}
            >
              <X size={18} color={colors.main} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}