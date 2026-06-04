// components/LanguagePicker.tsx
// ─────────────────────────────────────────────────────────────
// Bouton de sélection de langue — s'intègre dans la StickyBar.
// Design : pill avec flag + code ISO, dropdown élégant.
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Colors, SupportedLang, LangMeta } from "./types";

type Props = {
  lang:           SupportedLang;
  availableLangs: LangMeta[];
  setLang:        (l: SupportedLang) => void;
  colors:         Colors;
};

export default function LanguagePicker({ lang, availableLangs, setLang, colors }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Ferme le dropdown si clic extérieur
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Masquer si une seule langue
  if (availableLangs.length <= 1) return null;

  const current = availableLangs.find(l => l.code === lang) ?? availableLangs[0];

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* ── Bouton principal ── */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "7px 11px 7px 9px",
          borderRadius: 999,
          border: `1.5px solid ${open ? colors.accent + "45" : colors.accent + "22"}`,
          background: open ? `${colors.accent}0e` : colors.bg,
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transition: "background 0.2s, border-color 0.2s",
          boxShadow: `0 1px 4px ${colors.accent}08`,
        }}
      >
        <span style={{ fontSize: 15, lineHeight: 1 }}>{current.flag}</span>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          color: colors.accent,
          letterSpacing: "0.08em",
          fontFamily: "sans-serif",
          textTransform: "uppercase",
        }}>
          {current.code}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <ChevronDown size={11} color={`${colors.accent}70`} />
        </motion.span>
      </motion.button>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.94 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: 148,
              borderRadius: 16,
              background: colors.bg,
              border: `1.5px solid ${colors.accent}14`,
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: `0 16px 40px ${colors.accent}14, 0 4px 12px ${colors.accent}0a`,
              overflow: "hidden",
              zIndex: 100,
            }}
          >
            {availableLangs.map((l, idx) => {
              const isActive = l.code === lang;
              return (
                <motion.button
                  key={l.code}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ background: `${colors.accent}0c` }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setLang(l.code); setOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "11px 14px",
                    border: "none",
                    background: isActive ? `${colors.accent}08` : "transparent",
                    cursor: "pointer",
                    borderBottom: idx < availableLangs.length - 1 ? `1px solid ${colors.accent}08` : "none",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{l.flag}</span>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? colors.accent : `${colors.accent}65`, margin: 0, fontFamily: "sans-serif" }}>
                      {l.label}
                    </p>
                    <p style={{ fontSize: 9, color: `${colors.accent}38`, margin: 0, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {l.code}
                    </p>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="lang-check"
                      style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: colors.accent }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}