// RestaurantMapModal.tsx — fenêtre « Itinéraire » ouverte depuis le bouton d'une carte restaurant

import { lazy, Suspense, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { MapRestaurant } from "./RestaurantsMap";

// Leaflet n'est chargé qu'à la première ouverture
const RestaurantsMap = lazy(() => import("./RestaurantsMap"));

const C = {
  bg: "#0F2A1F", surface: "#173A2B", surface2: "#1F4A37",
  line: "rgba(255,255,255,0.16)", text: "#F4F8F4", muted: "#B9CFC1",
  terracotta: "#C2562F", terraLight: "#F29B77", sage: "#8FC27A",
};
const FONT_TITLE = "'Fraunces', Georgia, serif";

export default function RestaurantMapModal({ resto, onClose }: { resto: MapRestaurant; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000, background: "rgba(8,22,16,.8)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <motion.div
        role="dialog" aria-modal="true" aria-label={`Itinéraire vers ${resto.name}`}
        initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "min(100%, 720px)", maxHeight: "100%", overflow: "auto",
          background: C.bg, border: `2px solid ${C.line}`, borderRadius: 24,
          boxShadow: `8px 8px 0 ${C.terracotta}`, padding: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 4px 14px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 600, color: C.text, lineHeight: 1.1 }}>
              {resto.name}
            </h2>
            {resto.address && (
              <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>{resto.address}</p>
            )}
          </div>
          <button
            ref={closeRef} aria-label="Fermer la carte" onClick={onClose}
            style={{
              width: 44, height: 44, borderRadius: 12, border: `2px solid ${C.line}`, background: C.surface,
              color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <Suspense fallback={<p style={{ color: C.muted, textAlign: "center", padding: 48, margin: 0 }}>Chargement de la carte…</p>}>
          <RestaurantsMap restaurants={[resto]} height={380} bare autoRoute />
        </Suspense>
      </motion.div>
    </motion.div>
  );
}