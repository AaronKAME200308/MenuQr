// HomePage.tsx — Page d'accueil MenuQR
// Liste les restaurants groupés par type, fond vert, cartes avec image + logo

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { Search, MapPin, ChevronRight } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

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
  cover_url?: string;   // nouvelle propriété image de fond carte
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
          ? "0 24px 60px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.3)"
          : "0 8px 28px rgba(0,0,0,0.25)",
        transform: hovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "transform 0.32s cubic-bezier(0.34,1.3,0.64,1), box-shadow 0.32s ease",
      }}
    >
      {/* Image de fond */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: resto.cover_url ? `url(${resto.cover_url})` : undefined,
        background: !resto.cover_url ? `linear-gradient(145deg, ${resto.color_bg ?? "#1a5c3a"}, ${resto.color_accent ?? "#2E7D32"})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      }} />

      {/* Overlay dégradé bas */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
        zIndex: 1,
      }} />

      {/* Pattern déco */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, opacity: 0.06, pointerEvents: "none" }} aria-hidden>
        <defs>
          <pattern id={`pat-${resto.id}`} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="1.5" fill="#fff" />
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
          border: "3px solid rgba(255,255,255,0.9)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.15)",
          background: "#fff",
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
          fontSize: 14,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
          margin: "0 0 4px",
          textShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}>
          {resto.name}
        </p>
        {resto.tagline && (
          <p style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.4,
            margin: 0,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          } as React.CSSProperties}>
            {resto.tagline}
          </p>
        )}
        {resto.address && (
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 5, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
            <MapPin size={8} /> {resto.address}
          </p>
        )}

        {/* Bouton voir */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.22 }}
          style={{
            marginTop: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 999,
            padding: "5px 12px",
            fontSize: 10,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.06em",
          }}
        >
          Voir le menu <ChevronRight size={10} />
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
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 24px", marginBottom: 20 }}>
        <span style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: `${meta.color}22`,
          border: `1.5px solid ${meta.color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}>
          {meta.icon}
        </span>
        <div>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#F5E6C8",
            letterSpacing: "-0.02em",
            margin: 0,
            lineHeight: 1,
          }}>
            {typeName}
          </h2>
          <p style={{ fontSize: 10, color: "rgba(245,230,200,0.45)", margin: "3px 0 0", letterSpacing: "0.08em" }}>
            {restos.length} établissement{restos.length > 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ flex: 1, height: 1, background: "rgba(245,230,200,0.08)", marginLeft: 8 }} />
      </div>

      {/* Scroll horizontal */}
      <div style={{
        display: "flex",
        gap: 16,
        padding: "8px 24px 16px",
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
        const { data: restosData, error } = await supabase
          .from("restaurants")
          .select(`
    id, slug, name, tagline, logo_url, cover_url,
    address, color_accent, color_bg,
    restaurant_types_restaurants ( restaurant_types!type_id ( id, name, slug, icon ) )
  `)
          .order("name");

        console.log("raw:", JSON.stringify(restosData, null, 2));
        console.log("error:", error);

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
      background: "#0a2e20",
      fontFamily: "sans-serif",
      overflowX: "hidden",
    }}>
      {/* ── Background déco ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* Blob haut-gauche */}
        <div style={{ position: "absolute", top: "-15%", left: "-15%", width: "55%", height: "55%", background: "radial-gradient(ellipse, rgba(46,125,50,0.25) 0%, transparent 70%)", filter: "blur(80px)" }} />
        {/* Blob bas-droite */}
        <div style={{ position: "absolute", bottom: "0%", right: "-10%", width: "50%", height: "50%", background: "radial-gradient(ellipse, rgba(245,197,24,0.06) 0%, transparent 70%)", filter: "blur(90px)" }} />
        {/* Pattern SVG */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }} aria-hidden>
          <defs>
            <pattern id="home-diamonds" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <polygon points="24,4 44,24 24,44 4,24" fill="none" stroke="#F5E6C8" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#home-diamonds)" />
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
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "linear-gradient(135deg, #2E7D32, #1B5E20)",
              border: "1.5px solid rgba(245,197,24,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 12px 40px rgba(46,125,50,0.4)",
              fontSize: 28,
            }}
          >
            <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            style={{
              fontSize: "clamp(32px, 9vw, 56px)",
              fontWeight: 900,
              color: "#F5E6C8",
              letterSpacing: "-0.035em",
              lineHeight: 1,
              margin: "0 0 10px",
            }}
          >
            Menu<span style={{ color: "#F5C518" }}>QR</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            style={{
              fontSize: 13,
              color: "rgba(245,230,200,0.55)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: "0 0 36px",
            }}
          >
            Découvrez les menus près de chez vous
          </motion.p>

          {/* ── Barre de recherche ── */}
          {/* ── Barre de recherche avec autocomplétion ── */}
          <motion.div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              border: `1.5px solid ${search ? "rgba(245,197,24,0.5)" : "rgba(255,255,255,0.12)"}`,
              borderRadius: 16, padding: "0 16px",
              transition: "border-color 0.25s",
            }}>
              <Search size={16} color="rgba(245,230,200,0.5)" style={{ flexShrink: 0 }} />
              <input
                type="text"
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
                  padding: "14px 12px", fontSize: 14, color: "#F5E6C8", fontFamily: "sans-serif",
                }}
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => { setSearch(""); setShowSuggestions(false); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,230,200,0.5)", fontSize: 18, lineHeight: 1, padding: 4 }}
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
                    background: "#0f3d28", border: "1px solid rgba(245,197,24,0.2)",
                    borderRadius: 12, overflow: "hidden", zIndex: 50,
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
                          padding: "10px 16px", textDecoration: "none",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,197,24,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ fontSize: 16 }}>{meta.icon}</span>
                        <span style={{ fontSize: 13, color: "#F5E6C8", fontWeight: 600 }}>{r.name}</span>
                        {firstType && (
                          <span style={{ fontSize: 11, color: "rgba(245,230,200,0.45)", marginLeft: "auto" }}>
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
              style={{ marginTop: 20 }}
            >
              <p style={{ fontSize: 9, color: "rgba(245,230,200,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
                Filtrer par type
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {byType.map(({ type, restos }) => {
                  const meta = TYPE_META[type.slug] ?? { icon: "🍽️", color: "#2E7D32" };
                  const active = activeTypes.has(type.id);
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setActiveTypes(prev => {
                          const next = new Set(prev);
                          active ? next.delete(type.id) : next.add(type.id);
                          return next;
                        });
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: active ? `${meta.color}26` : "rgba(255,255,255,0.05)",
                        border: `${active ? "1.5px" : "1px"} solid ${active ? meta.color + "80" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 999, padding: "6px 14px", cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <span style={{ fontSize: 14 }}>{meta.icon}</span>
                      <span style={{ fontSize: 12, color: active ? "#F5C518" : "rgba(245,230,200,0.7)", fontWeight: active ? 700 : 400 }}>
                        {type.name}
                      </span>
                      <span style={{
                        fontSize: 10, borderRadius: 999, padding: "1px 6px",
                        background: active ? "rgba(245,197,24,0.25)" : "rgba(255,255,255,0.08)",
                        color: active ? "#F5C518" : "rgba(245,230,200,0.5)",
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
                style={{ fontSize: 11, color: "rgba(245,230,200,0.45)", marginTop: 10, letterSpacing: "0.06em" }}
              >
                {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour « {search} »
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Séparateur ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 24px", marginBottom: 36 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(245,230,200,0.08)" }} />
          <span style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(245,230,200,0.3)", textTransform: "uppercase" }}>
            Établissements
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(245,230,200,0.08)" }} />
        </div>

        {/* ── Contenu ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(245,230,200,0.15)", borderTopColor: "#F5C518", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "rgba(245,230,200,0.4)", fontSize: 11, letterSpacing: "0.2em" }}>CHARGEMENT…</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "60px 24px" }}
          >
            <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
            <p style={{ color: "rgba(245,230,200,0.5)", fontSize: 14 }}>
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
        <footer style={{ textAlign: "center", padding: "32px 24px", borderTop: "1px solid rgba(245,230,200,0.06)" }}>
          <p style={{ fontSize: 9, color: "rgba(245,230,200,0.25)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            MenuQR · Menus numériques
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(245,230,200,0.3); }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}