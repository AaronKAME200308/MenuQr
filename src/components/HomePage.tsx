// HomePage.tsx — Page d'accueil MenuQr (v2, palette du logo)
// Liste les restaurants groupés par type. Fond crème, accents terracotta et vert.

import { useEffect, useState, useMemo } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { Search, MapPin, ChevronRight } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

// ─────────────────────────────────────────────────────────────
// Palette MenuQr
// ─────────────────────────────────────────────────────────────

const C = {
  cream:      "#F6EFE2",
  ivory:      "#FBF5E9",
  white:      "#FFFFFF",
  terracotta: "#A44A26",
  forest:     "#2B4A3A",
  green:      "#3E6B4F",
  sage:       "#6E9A5A",
  muted:      "#5A4A3C",
  line:       "rgba(43,74,58,0.12)",
};

const FONT_TITLE = "'Fraunces', Georgia, serif";
const FONT_BODY  = "'DM Sans', system-ui, sans-serif";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface RestaurantType {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  logo_url?: string;
  cover_url?: string;   // image de fond de la carte
  address?: string;
  color_accent: string;
  color_bg: string;
  types?: RestaurantType[];
}

// ─────────────────────────────────────────────────────────────
// Données des types (côté client — à synchroniser avec la BD)
// ─────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { icon: string; color: string }> = {
  "restaurant": { icon: "🍽️", color: "#2E7D32" },
  "street-food": { icon: "🌮", color: "#E65100" },
  "bar": { icon: "🍺", color: "#1565C0" },
  "café": { icon: "☕", color: "#5D4037" },
  "boulangerie": { icon: "🥐", color: "#F9A825" },
  "food-truck": { icon: "🚚", color: "#6A1B9A" },
  "pizzeria": { icon: "🍕", color: "#C62828" },
  "sushi": { icon: "🍣", color: "#00695C" },
  "végétarien": { icon: "🥗", color: "#388E3C" },
  "burger": { icon: "🍔", color: "#BF360C" },
  "brasserie": { icon: "🥂", color: "#4527A0" },
  "traiteur": { icon: "👨‍🍳", color: "#00838F" },
};

// ─────────────────────────────────────────────────────────────
// Logo MenuQr (symbole : QR code + fourchette dans une carte)
// ─────────────────────────────────────────────────────────────

function MenuQrMark({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="16 16 182 182" aria-hidden="true">
      <rect x="29" y="29" width="140" height="140" rx="28" fill={C.ivory} stroke={C.terracotta} strokeWidth="7" />
      {/* repères d'angle */}
      <rect x="49" y="49" width="28" height="28" rx="8" fill="none" stroke={C.terracotta} strokeWidth="6" />
      <rect x="58" y="58" width="10" height="10" rx="3" fill={C.green} />
      <rect x="121" y="49" width="28" height="28" rx="8" fill="none" stroke={C.terracotta} strokeWidth="6" />
      <rect x="130" y="58" width="10" height="10" rx="3" fill={C.green} />
      <rect x="49" y="121" width="28" height="28" rx="8" fill="none" stroke={C.terracotta} strokeWidth="6" />
      <rect x="58" y="130" width="10" height="10" rx="3" fill={C.green} />
      {/* fourchette */}
      <g fill={C.forest}>
        <rect x="82" y="46" width="10" height="10" rx="2" />
        <rect x="82" y="58" width="10" height="10" rx="2" />
        <rect x="106" y="46" width="10" height="10" rx="2" />
        <rect x="106" y="58" width="10" height="10" rx="2" />
        <rect x="82" y="70" width="10" height="10" rx="2" />
        <rect x="94" y="70" width="10" height="10" rx="2" />
        <rect x="106" y="70" width="10" height="10" rx="2" />
        <rect x="94" y="82" width="10" height="10" rx="2" />
        <rect x="94" y="94" width="10" height="10" rx="2" />
        <rect x="94" y="106" width="10" height="10" rx="2" />
        <rect x="94" y="118" width="10" height="10" rx="2" />
        <rect x="94" y="130" width="10" height="10" rx="2" />
        <rect x="94" y="142" width="10" height="10" rx="2" />
      </g>
      {/* pixels */}
      <g fill={C.terracotta}>
        <rect x="46" y="82" width="10" height="10" rx="2" />
        <rect x="70" y="82" width="10" height="10" rx="2" />
        <rect x="58" y="94" width="10" height="10" rx="2" />
        <rect x="46" y="106" width="10" height="10" rx="2" />
        <rect x="70" y="106" width="10" height="10" rx="2" />
        <rect x="118" y="82" width="10" height="10" rx="2" />
        <rect x="142" y="82" width="10" height="10" rx="2" />
        <rect x="130" y="94" width="10" height="10" rx="2" />
        <rect x="118" y="106" width="10" height="10" rx="2" />
        <rect x="142" y="106" width="10" height="10" rx="2" />
      </g>
      <g fill={C.sage}>
        <rect x="142" y="118" width="10" height="10" rx="2" />
        <rect x="130" y="130" width="10" height="10" rx="2" />
        <rect x="118" y="142" width="10" height="10" rx="2" />
        <rect x="130" y="118" width="10" height="10" rx="2" opacity="0.65" />
        <rect x="118" y="130" width="10" height="10" rx="2" opacity="0.65" />
      </g>
      <rect x="172" y="20" width="10" height="10" fill={C.sage} />
      <rect x="186" y="34" width="7" height="7" fill={C.terracotta} />
      <rect x="176" y="44" width="5" height="5" fill={C.green} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Loader : pixels de QR code qui s'allument
// ─────────────────────────────────────────────────────────────

function QrPixelsLoader() {
  const cells = Array.from({ length: 36 }, (_, i) => i);
  return (
    <div
      aria-hidden="true"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 12px)",
        gap: 5,
        justifyContent: "center",
        margin: "0 auto 16px",
      }}
    >
      {cells.map(i => (
        <span
          key={i}
          className="mqr-pixel"
          style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            background: i % 5 === 0 ? C.terracotta : C.green,
            animationDelay: `${((i * 7) % 12) * 0.13}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Composant carte restaurant
// ─────────────────────────────────────────────────────────────

function RestaurantCard({ resto, index }: { resto: Restaurant; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={`/${resto.slug}`}
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.34, 1.2, 0.64, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 200,
        height: 260,
        borderRadius: 24,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        cursor: "pointer",
        textDecoration: "none",
        boxShadow: hovered
          ? "0 22px 48px rgba(43,74,58,0.30), 0 6px 16px rgba(43,74,58,0.18)"
          : "0 6px 20px rgba(43,74,58,0.18)",
        transform: hovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "transform 0.32s cubic-bezier(0.34,1.3,0.64,1), box-shadow 0.32s ease",
      }}
    >
      {/* Image de fond */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: resto.cover_url ? `url(${resto.cover_url})` : undefined,
        background: !resto.cover_url ? `linear-gradient(145deg, ${resto.color_bg ?? C.forest}, ${resto.color_accent ?? C.green})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      }} />

      {/* Overlay dégradé bas (garde le texte blanc lisible) */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(20,34,27,0.88) 0%, rgba(20,34,27,0.25) 55%, transparent 100%)",
        zIndex: 1,
      }} />

      {/* Pattern déco */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, opacity: 0.07, pointerEvents: "none" }} aria-hidden="true">
        <defs>
          <pattern id={`pat-${resto.id}`} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <rect x="12" y="12" width="4" height="4" rx="1" fill="#fff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#pat-${resto.id})`} />
      </svg>

      {/* Logo circulaire au centre */}
      <motion.div
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          width: 88,
          height: 88,
          borderRadius: "50%",
          overflow: "hidden",
          border: `3px solid ${C.ivory}`,
          boxShadow: "0 8px 28px rgba(0,0,0,0.30)",
          background: C.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        {resto.logo_url ? (
          <img src={resto.logo_url} alt={resto.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} />
        ) : (
          <span style={{ fontSize: 36 }}>🍽️</span>
        )}
      </motion.div>

      {/* Infos bas */}
      <div style={{ position: "relative", zIndex: 2, padding: "0 14px 16px", width: "100%", textAlign: "center" }}>
        <p style={{
          fontFamily: FONT_TITLE,
          fontSize: 16,
          fontWeight: 600,
          color: "#fff",
          lineHeight: 1.2,
          margin: "0 0 4px",
          textShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}>
          {resto.name}
        </p>
        {resto.tagline && (
          <p style={{
            fontFamily: FONT_BODY,
            fontSize: 11,
            color: "rgba(255,255,255,0.86)",
            lineHeight: 1.4,
            margin: 0,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          } as CSSProperties}>
            {resto.tagline}
          </p>
        )}
        {resto.address && (
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: "rgba(255,255,255,0.75)", margin: "5px 0 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
            <MapPin size={10} aria-hidden="true" /> {resto.address}
          </p>
        )}

        {/* Bouton voir */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0.88, y: hovered ? 0 : 2 }}
          transition={{ duration: 0.22 }}
          style={{
            marginTop: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: C.terracotta,
            borderRadius: 999,
            padding: "6px 14px",
            fontFamily: FONT_BODY,
            fontSize: 11,
            fontWeight: 700,
            color: C.ivory,
            letterSpacing: "0.05em",
          }}
        >
          Voir le menu <ChevronRight size={11} aria-hidden="true" />
        </motion.div>
      </div>
    </motion.a>
  );
}

// ─────────────────────────────────────────────────────────────
// Section par type
// ─────────────────────────────────────────────────────────────

function TypeSection({ typeName, typeSlug, restos }: { typeName: string; typeSlug: string; restos: Restaurant[] }) {
  const meta = TYPE_META[typeSlug] ?? { icon: "🍽️", color: "#2E7D32" };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginBottom: 48 }}
    >
      {/* Header section */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 24px", marginBottom: 20 }}>
        <span aria-hidden="true" style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: `${meta.color}1F`,
          border: `1.5px solid ${meta.color}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 19,
          flexShrink: 0,
        }}>
          {meta.icon}
        </span>
        <div>
          <h2 style={{
            fontFamily: FONT_TITLE,
            fontSize: 20,
            fontWeight: 600,
            color: C.forest,
            margin: 0,
            lineHeight: 1.1,
          }}>
            {typeName}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.muted, margin: "3px 0 0" }}>
            {restos.length} établissement{restos.length > 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ flex: 1, height: 1, background: C.line, marginLeft: 8 }} />
      </div>

      {/* Scroll horizontal */}
      <div style={{
        display: "flex",
        gap: 16,
        padding: "8px 24px 20px",
        overflowX: "auto",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}>
        {restos.map((r, i) => (
          <RestaurantCard key={r.id} resto={r} index={i} />
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [_types, setTypes] = useState<RestaurantType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Restaurant[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        // Charge les types
        const { data: typesData } = await supabase
          .from("restaurant_types")
          .select("*")
          .order("name");

        // Charge les restaurants avec leurs types
        const { data: restosData } = await supabase
          .from("restaurants")
          .select(`
            id, slug, name, tagline, logo_url, cover_url,
            address, color_accent, color_bg,
            restaurant_types_restaurants ( restaurant_types!type_id ( id, name, slug, icon ) )
          `)
          .order("name");

        const restos: Restaurant[] = (restosData ?? []).map((r: any) => ({
          ...r,
          types: (r.restaurant_types_restaurants ?? [])
            .map((rel: any) => rel.restaurant_types)
            .filter(Boolean),
        }));

        setTypes(typesData ?? []);
        setRestaurants(restos);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  // Filtre recherche
  const filtered = useMemo(() => {
    let list = restaurants;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.tagline?.toLowerCase().includes(q) ||
        r.address?.toLowerCase().includes(q)
      );
    }
    if (activeTypes.size > 0) {
      list = list.filter(r =>
        r.types?.some(t => activeTypes.has(t.id))
      );
    }
    return list;
  }, [restaurants, search, activeTypes]);

  // Groupement par type
  const byType = useMemo(() => {
    const map: Record<string, { type: RestaurantType; restos: Restaurant[] }> = {};
    for (const resto of filtered) {
      for (const t of (resto.types ?? [])) {
        if (!map[t.id]) map[t.id] = { type: t, restos: [] };
        map[t.id].restos.push(resto);
      }
    }
    return Object.values(map);
  }, [filtered]);

  // Restos sans type
  const untyped = useMemo(() =>
    filtered.filter(r => !r.types || r.types.length === 0),
    [filtered]);

  return (
    <div style={{
      minHeight: "100vh",
      background: C.cream,
      fontFamily: FONT_BODY,
      overflowX: "hidden",
    }}>
      {/* ── Background déco : pixels de QR code ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-15%", left: "-15%", width: "55%", height: "55%", background: "radial-gradient(ellipse, rgba(110,154,90,0.18) 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div style={{ position: "absolute", bottom: "0%", right: "-10%", width: "50%", height: "50%", background: "radial-gradient(ellipse, rgba(164,74,38,0.10) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }} aria-hidden="true">
          <defs>
            <pattern id="home-pixels" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
              <rect x="10" y="10" width="8" height="8" rx="2" fill={C.green} />
              <rect x="34" y="22" width="6" height="6" rx="1.5" fill={C.terracotta} />
              <rect x="22" y="40" width="5" height="5" rx="1.5" fill={C.sage} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#home-pixels)" />
        </svg>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", paddingBottom: 64 }}>

        {/* ── HERO HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ padding: "56px 24px 40px", textAlign: "center" }}
        >
          {/* Logo app */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}
          >
            <MenuQrMark size={84} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            style={{
              fontFamily: FONT_TITLE,
              fontSize: "clamp(36px, 9vw, 60px)",
              fontWeight: 600,
              color: C.forest,
              lineHeight: 1,
              margin: "0 0 12px",
            }}
          >
            Menu<span style={{ color: C.terracotta }}>Qr</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: C.muted,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              margin: "0 0 36px",
            }}
          >
            Découvrez les menus près de chez vous
          </motion.p>

          {/* ── Barre de recherche avec autocomplétion ── */}
          <motion.div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: C.white,
              border: `1.5px solid ${search ? C.terracotta : C.line}`,
              boxShadow: "0 6px 22px rgba(43,74,58,0.10)",
              borderRadius: 16, padding: "0 16px",
              transition: "border-color 0.25s",
            }}>
              <Search size={16} color={C.muted} style={{ flexShrink: 0 }} aria-hidden="true" />
              <input
                type="text"
                aria-label="Rechercher un restaurant"
                value={search}
                onChange={e => {
                  const val = e.target.value;
                  setSearch(val);
                  if (val.trim()) {
                    const q = val.toLowerCase();
                    setSuggestions(restaurants.filter(r =>
                      r.name.toLowerCase().includes(q) ||
                      r.tagline?.toLowerCase().includes(q)
                    ).slice(0, 5));
                    setShowSuggestions(true);
                  } else {
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => search && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Rechercher un restaurant…"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  padding: "14px 12px", fontSize: 15, color: C.forest, fontFamily: FONT_BODY,
                }}
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    aria-label="Effacer la recherche"
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => { setSearch(""); setShowSuggestions(false); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20, lineHeight: 1, padding: 6 }}
                  >×</motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{
                    position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
                    background: C.white, border: `1px solid ${C.line}`,
                    boxShadow: "0 14px 36px rgba(43,74,58,0.16)",
                    borderRadius: 14, overflow: "hidden", zIndex: 50, textAlign: "left",
                  }}
                >
                  {suggestions.map(r => {
                    const firstType = r.types?.[0];
                    const meta = firstType ? (TYPE_META[firstType.slug] ?? { icon: "🍽️" }) : { icon: "🍽️" };
                    return (
                      <a
                        key={r.id}
                        href={`/${r.slug}`}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "11px 16px", textDecoration: "none",
                          borderBottom: `1px solid ${C.line}`,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(164,74,38,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ fontSize: 16 }} aria-hidden="true">{meta.icon}</span>
                        <span style={{ fontSize: 14, color: C.forest, fontWeight: 600 }}>{r.name}</span>
                        {firstType && (
                          <span style={{ fontSize: 12, color: C.muted, marginLeft: "auto" }}>
                            {firstType.name}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Filtres par type ── */}
          {!search && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              style={{ marginTop: 22 }}
            >
              <p style={{ fontSize: 11, color: C.muted, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>
                Filtrer par type
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {byType.map(({ type, restos }) => {
                  const meta = TYPE_META[type.slug] ?? { icon: "🍽️", color: "#2E7D32" };
                  const active = activeTypes.has(type.id);
                  return (
                    <button
                      key={type.id}
                      aria-pressed={active}
                      onClick={() => {
                        setActiveTypes(prev => {
                          const next = new Set(prev);
                          if (active) next.delete(type.id); else next.add(type.id);
                          return next;
                        });
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: active ? C.terracotta : C.ivory,
                        border: `1.5px solid ${active ? C.terracotta : C.line}`,
                        borderRadius: 999, padding: "7px 14px", cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: FONT_BODY,
                      }}
                    >
                      <span style={{ fontSize: 14 }} aria-hidden="true">{meta.icon}</span>
                      <span style={{ fontSize: 13, color: active ? C.ivory : C.forest, fontWeight: active ? 700 : 500 }}>
                        {type.name}
                      </span>
                      <span style={{
                        fontSize: 11, borderRadius: 999, padding: "1px 7px", fontWeight: 600,
                        background: active ? "rgba(251,245,233,0.25)" : "rgba(43,74,58,0.08)",
                        color: active ? C.ivory : C.muted,
                      }}>
                        {restos.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Compteur résultats */}
          <AnimatePresence>
            {search && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: 13, color: C.muted, marginTop: 12 }}
              >
                {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour « {search} »
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Séparateur ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 24px", marginBottom: 36 }}>
          <div style={{ flex: 1, height: 1, background: C.line }} />
          <span style={{ fontSize: 11, letterSpacing: "0.22em", color: C.muted, textTransform: "uppercase" }}>
            Établissements
          </span>
          <div style={{ flex: 1, height: 1, background: C.line }} />
        </div>

        {/* ── Contenu ── */}
        {loading ? (
          <div role="status" aria-live="polite" style={{ textAlign: "center", padding: "60px 24px" }}>
            <QrPixelsLoader />
            <p style={{ color: C.muted, fontSize: 12, letterSpacing: "0.2em", margin: 0 }}>CHARGEMENT…</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "60px 24px" }}
          >
            <p style={{ fontSize: 40, margin: "0 0 12px" }} aria-hidden="true">🔍</p>
            <p style={{ color: C.muted, fontSize: 15, margin: 0 }}>
              Aucun restaurant pour « {search} »
            </p>
          </motion.div>
        ) : (
          <>
            {byType.map(({ type, restos }) => (
              <TypeSection
                key={type.id}
                typeName={type.name}
                typeSlug={type.slug}
                restos={restos}
              />
            ))}
            {untyped.length > 0 && (
              <TypeSection
                typeName="Autres"
                typeSlug="restaurant"
                restos={untyped}
              />
            )}
          </>
        )}

        {/* ── Footer ── */}
        <footer style={{ textAlign: "center", padding: "32px 24px", borderTop: `1px solid ${C.line}` }}>
          <p style={{ fontSize: 11, color: C.muted, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>
            MenuQr · Menus numériques
          </p>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=DM+Sans:wght@400;500;700&display=swap');
        @keyframes mqr-pixel {
          0%, 100% { opacity: 0.12; transform: scale(0.75); }
          40%      { opacity: 1;    transform: scale(1); }
        }
        .mqr-pixel { animation: mqr-pixel 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .mqr-pixel { animation: none; opacity: 0.6; }
        }
        input::placeholder { color: #7A6A5A; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}