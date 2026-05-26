// components/SearchBar.tsx — v2 (i18n)
// Barre de recherche avec textes traduits via props.

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import type { Colors } from "./types";

type Props = {
  query:        string;
  setQuery:     (v: string) => void;
  colors:       Colors;
  resultCount:  number;
  // i18n — valeurs pré-traduites par le parent
  placeholder?:    string;
  resultsLabel?:   (count: number) => string;
};

export default function SearchBar({
  query,
  setQuery,
  colors,
  resultCount,
  placeholder    = "Rechercher un plat…",
  resultsLabel,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const countLabel = resultsLabel
    ? resultsLabel(resultCount)
    : `${resultCount} résultat${resultCount !== 1 ? "s" : ""}`;

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.07)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: `1.5px solid ${query ? colors.primary + "40" : colors.primary + "18"}`, borderRadius: 16, padding: "0 14px", transition: "border-color 0.25s", boxShadow: query ? `0 4px 20px ${colors.accent}25` : "none" }}>
      <Search size={15} color={`${colors.primary}55`} style={{ flexShrink: 0 }} />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "13px 10px", fontSize: 13, color: colors.primary, fontFamily: "sans-serif" }}
      />
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, color: colors.accent, background: `${colors.accent}20`, borderRadius: 999, padding: "2px 8px", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
              {countLabel}
            </span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}
            >
              <X size={14} color={`${colors.primary}60`} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}