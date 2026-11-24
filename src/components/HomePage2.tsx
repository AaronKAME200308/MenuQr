// HomePage.tsx — v3 · Direction artistique « Carte QR » (sombre, sans crème)
// Fond vert forêt profond, ombres franches terracotta décalées, pixels de QR code
// comme motif structurel. Données Supabase et logique identiques à la v2.

import { useEffect, useState, useMemo } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { Search, MapPin, ArrowUpRight, X, ScanLine, BookOpen, UtensilsCrossed } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

// ─────────────────────────────────────────────────────────────
// Palette MenuQr — sombre
// ─────────────────────────────────────────────────────────────

const C = {
  bg:         "#0F2A1F",   // forêt profond
  surface:    "#173A2B",
  surface2:   "#1F4A37",
  line:       "rgba(255,255,255,0.16)",
  text:       "#F4F8F4",
  muted:      "#B9CFC1",   // ~9:1 sur bg
  terracotta: "#C2562F",   // fonds (texte blanc dessus)
  terraLight: "#F29B77",   // texte/icônes terracotta sur fond sombre
  sage:       "#8FC27A",
  white:      "#FFFFFF",
};

const FONT_TITLE = "'Fraunces', Georgia, serif";
const FONT_BODY  = "'DM Sans', system-ui, sans-serif";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface RestaurantType { id: string; name: string; slug: string; icon: string; }

interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  logo_url?: string;
  cover_url?: string;
  address?: string;
  color_accent: string;
  color_bg: string;
  types?: RestaurantType[];
}

const TYPE_META: Record<string, { icon: string }> = {
  "restaurant": { icon: "🍽️" }, "street-food": { icon: "🌮" }, "bar": { icon: "🍺" },
  "café": { icon: "☕" }, "boulangerie": { icon: "🥐" }, "food-truck": { icon: "🚚" },
  "pizzeria": { icon: "🍕" }, "sushi": { icon: "🍣" }, "végétarien": { icon: "🥗" },
  "burger": { icon: "🍔" }, "brasserie": { icon: "🥂" }, "traiteur": { icon: "👨‍🍳" },
};

// ─────────────────────────────────────────────────────────────
// Pixels de QR code (motif structurel)
// ─────────────────────────────────────────────────────────────

const PIXEL_COLORS = [C.terracotta, C.sage, C.surface2, C.white, C.surface2, C.terracotta];

function PixelStrip({ count = 28, size = 10 }: { count?: number; size?: number }) {
  return (
    <div aria-hidden="true" style={{ display: "flex", gap: 4, flexWrap: "nowrap", overflow: "hidden" }}>
      {Array.from({ length: count }, (_, i) => {
        const on = (i * 7 + (i % 3) * 5) % 4 !== 0;
        return (
          <span key={i} style={{
            flexShrink: 0, width: size, height: size, borderRadius: 2,
            background: on ? PIXEL_COLORS[(i * 5) % PIXEL_COLORS.length] : "transparent",
            border: on ? "none" : `1px solid ${C.line}`,
            opacity: on ? 0.9 : 1,
          }} />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo MenuQr (carte blanche, sans crème)
// ─────────────────────────────────────────────────────────────

function MenuQrMark({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="16 16 182 182" aria-hidden="true">
      <rect x="29" y="29" width="140" height="140" rx="28" fill={C.white} stroke={C.terracotta} strokeWidth="7" />
      {[[49, 49], [121, 49], [49, 121]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="28" height="28" rx="8" fill="none" stroke={C.terracotta} strokeWidth="6" />
          <rect x={x + 9} y={y + 9} width="10" height="10" rx="3" fill={C.bg} />
        </g>
      ))}
      <g fill={C.bg}>
        {[[82,46],[82,58],[106,46],[106,58],[82,70],[94,70],[106,70],[94,82],[94,94],[94,106],[94,118],[94,130],[94,142]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" rx="2" />
        ))}
      </g>
      <g fill={C.terracotta}>
        {[[46,82],[70,82],[58,94],[46,106],[70,106],[118,82],[142,82],[130,94],[118,106],[142,106]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" rx="2" />
        ))}
      </g>
      <g fill={C.sage}>
        {[[142,118],[130,130],[118,142]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" rx="2" />
        ))}
      </g>
      <rect x="172" y="20" width="10" height="10" fill={C.sage} />
      <rect x="186" y="34" width="7" height="7" fill={C.terracotta} />
      <rect x="176" y="44" width="5" height="5" fill={C.white} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Carte restaurant — ombre franche décalée
// ─────────────────────────────────────────────────────────────

function RestaurantCard({ resto, index }: { resto: Restaurant; index: number }) {
  const reduce = useReducedMotion();
  const firstType = resto.types?.[0];

  return (
    <motion.a
      href={`/${resto.slug}`}
      className="mqr-card"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: (index % 4) * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`${resto.name} — voir le menu`}
    >
      {/* Couverture */}
      <div style={{
        position: "relative", aspectRatio: "4 / 3", overflow: "hidden",
        borderRadius: "16px 16px 0 0",
        background: `linear-gradient(145deg, ${resto.color_bg ?? C.surface2}, ${resto.color_accent ?? C.terracotta})`,
      }}>
        {resto.cover_url && (
          <img src={resto.cover_url} alt="" loading="lazy" decoding="async" width={320} height={240}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
        {firstType && (
          <span style={{
            position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 6,
            background: C.bg, color: C.text, border: `1.5px solid ${C.line}`, borderRadius: 999,
            padding: "5px 11px", fontSize: 12, fontWeight: 700, fontFamily: FONT_BODY,
          }}>
            <span aria-hidden="true">{(TYPE_META[firstType.slug] ?? { icon: "🍽️" }).icon}</span>
            {firstType.name}
          </span>
        )}
      </div>

      {/* Logo chevauchant */}
      <div style={{
        position: "relative", marginTop: -30, marginLeft: 14, width: 60, height: 60, borderRadius: 16,
        background: C.white, border: `3px solid ${C.bg}`, boxShadow: `0 0 0 2px ${C.terracotta}`,
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", zIndex: 1,
      }}>
        {resto.logo_url
          ? <img src={resto.logo_url} alt="" loading="lazy" decoding="async" width={60} height={60}
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
          : <UtensilsCrossed size={24} color={C.bg} aria-hidden="true" />}
      </div>

      {/* Texte */}
      <div style={{ padding: "10px 16px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <h3 style={{ margin: 0, fontFamily: FONT_TITLE, fontSize: 20, fontWeight: 600, lineHeight: 1.15, color: C.text }}>
          {resto.name}
        </h3>
        {resto.tagline && (
          <p style={{
            margin: 0, fontSize: 14, lineHeight: 1.4, color: C.muted,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          } as CSSProperties}>
            {resto.tagline}
          </p>
        )}
        <div style={{ marginTop: "auto", paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          {resto.address ? (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.muted, minWidth: 0 }}>
              <MapPin size={13} aria-hidden="true" style={{ flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resto.address}</span>
            </span>
          ) : <span />}
          <span className="mqr-go" aria-hidden="true">
            <ArrowUpRight size={20} strokeWidth={2.6} />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

// ─────────────────────────────────────────────────────────────
// Section par type
// ─────────────────────────────────────────────────────────────

function TypeSection({ typeName, typeSlug, restos }: { typeName: string; typeSlug: string; restos: Restaurant[] }) {
  const meta = TYPE_META[typeSlug] ?? { icon: "🍽️" };
  return (
    <section style={{ marginBottom: 56 }} aria-label={typeName}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <span aria-hidden="true" style={{
          width: 48, height: 48, borderRadius: 14, background: C.terracotta, fontSize: 24,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>{meta.icon}</span>
        <h2 style={{ margin: 0, fontFamily: FONT_TITLE, fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 600, color: C.text, lineHeight: 1.05 }}>
          {typeName}
        </h2>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.bg, background: C.sage, borderRadius: 999, padding: "4px 12px" }}>
          {restos.length}
        </span>
        <div aria-hidden="true" style={{ flex: 1, height: 2, background: C.line, minWidth: 16 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 250px), 1fr))", gap: 28 }}>
        {restos.map((r, i) => <RestaurantCard key={r.id} resto={r} index={i} />)}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────

const STEPS = [
  { Icon: ScanLine,  title: "Scannez",   text: "Flashez le QR code posé sur votre table." },
  { Icon: BookOpen,  title: "Parcourez", text: "Le menu s'ouvre aussitôt, photos et prix à jour." },
  { Icon: UtensilsCrossed, title: "Choisissez", text: "Plats, tailles, allergènes : tout est là." },
];

export default function HomePage() {
  const reduce = useReducedMotion();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [_types, setTypes] = useState<RestaurantType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());

  // Polices : <link> au lieu de @import (ne bloque plus le rendu)
  useEffect(() => {
    const id = "mqr-fonts";
    if (document.getElementById(id)) return;
    const pre = document.createElement("link");
    pre.rel = "preconnect"; pre.href = "https://fonts.gstatic.com"; pre.crossOrigin = "anonymous";
    const link = document.createElement("link");
    link.id = id; link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:wght@400;500;700&display=swap";
    document.head.append(pre, link);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const { data: typesData } = await supabase.from("restaurant_types").select("*").order("name");
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
          types: (r.restaurant_types_restaurants ?? []).map((rel: any) => rel.restaurant_types).filter(Boolean),
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

  const filtered = useMemo(() => {
    let list = restaurants;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.tagline?.toLowerCase().includes(q) ||
        r.address?.toLowerCase().includes(q));
    }
    if (activeTypes.size > 0) list = list.filter(r => r.types?.some(t => activeTypes.has(t.id)));
    return list;
  }, [restaurants, search, activeTypes]);

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return restaurants.filter(r => r.name.toLowerCase().includes(q) || r.tagline?.toLowerCase().includes(q)).slice(0, 5);
  }, [restaurants, search]);

  const byType = useMemo(() => {
    const map: Record<string, { type: RestaurantType; restos: Restaurant[] }> = {};
    for (const resto of filtered)
      for (const t of (resto.types ?? [])) {
        if (!map[t.id]) map[t.id] = { type: t, restos: [] };
        map[t.id].restos.push(resto);
      }
    return Object.values(map);
  }, [filtered]);

  // Types disponibles pour les filtres (sur la liste complète, pas filtrée)
  const allTypes = useMemo(() => {
    const map: Record<string, { type: RestaurantType; count: number }> = {};
    for (const r of restaurants)
      for (const t of (r.types ?? [])) {
        if (!map[t.id]) map[t.id] = { type: t, count: 0 };
        map[t.id].count++;
      }
    return Object.values(map);
  }, [restaurants]);

  const untyped = useMemo(() => filtered.filter(r => !r.types || r.types.length === 0), [filtered]);

  const toggleType = (id: string) =>
    setActiveTypes(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      {/* Texture : pixels discrets */}
      <svg aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none" }}>
        <defs>
          <pattern id="home-pixels" width="48" height="48" patternUnits="userSpaceOnUse">
            <rect x="8" y="8" width="8" height="8" rx="2" fill={C.sage} />
            <rect x="30" y="22" width="6" height="6" rx="1.5" fill={C.terraLight} />
            <rect x="18" y="36" width="5" height="5" rx="1.5" fill={C.white} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#home-pixels)" />
      </svg>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto", padding: "0 20px 64px" }}>

        {/* ── Barre de marque ── */}
        <header style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 0" }}>
          <MenuQrMark size={40} />
          <span style={{ fontFamily: FONT_TITLE, fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em" }}>
            Menu<span style={{ color: C.terraLight }}>Qr</span>
          </span>
        </header>

        {/* ── HERO ── */}
        <motion.section
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "32px 48px", padding: "24px 0 40px" }}
        >
          <div style={{ flex: "1 1 340px", minWidth: 0 }}>
            <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.sage }}>
              Menus numériques près de chez vous
            </p>
            <h1 style={{
              margin: "0 0 20px", fontFamily: FONT_TITLE, fontWeight: 700,
              fontSize: "clamp(40px, 9vw, 76px)", lineHeight: 0.98, letterSpacing: "-0.02em",
            }}>
              Scannez.<br />
              <span style={{ background: C.terracotta, color: C.white, padding: "0 12px", borderRadius: 10, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
                Choisissez.
              </span><br />
              Savourez.
            </h1>
            <p style={{ margin: "0 0 28px", fontSize: 17, lineHeight: 1.5, color: C.muted, maxWidth: 460 }}>
              Retrouvez le menu de vos restaurants, cafés et bars préférés — photos, prix et allergènes, sans rien télécharger.
            </p>

            {/* Recherche */}
            <div style={{ position: "relative", maxWidth: 520 }}>
              <div role="search" style={{
                display: "flex", alignItems: "center", gap: 6, minHeight: 56,
                background: C.white, borderRadius: 16, padding: "0 8px 0 16px",
                boxShadow: `5px 5px 0 ${C.terracotta}`,
              }}>
                <Search size={20} color={C.bg} aria-hidden="true" style={{ flexShrink: 0 }} />
                <input
                  type="search"
                  aria-label="Rechercher un restaurant"
                  autoComplete="off"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setShowSuggestions(Boolean(e.target.value.trim())); }}
                  onFocus={() => search && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Un restaurant, une adresse…"
                  style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", padding: "14px 6px", fontSize: 16, color: C.bg, fontFamily: FONT_BODY }}
                />
                {search && (
                  <button aria-label="Effacer la recherche" onClick={() => { setSearch(""); setShowSuggestions(false); }}
                    style={{ background: "none", border: "none", cursor: "pointer", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <X size={20} color={C.bg} aria-hidden="true" />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    style={{ position: "absolute", top: "calc(100% + 14px)", left: 0, right: 0, margin: 0, padding: 0, listStyle: "none",
                      background: C.surface, border: `2px solid ${C.line}`, borderRadius: 14, overflow: "hidden", zIndex: 50 }}
                  >
                    {suggestions.map(r => {
                      const t = r.types?.[0];
                      return (
                        <li key={r.id}>
                          <a href={`/${r.slug}`} className="mqr-sugg">
                            <span aria-hidden="true" style={{ fontSize: 18 }}>{(t ? TYPE_META[t.slug] : undefined)?.icon ?? "🍽️"}</span>
                            <span style={{ fontWeight: 700 }}>{r.name}</span>
                            {t && <span style={{ marginLeft: "auto", fontSize: 13, color: C.muted }}>{t.name}</span>}
                          </a>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Carte QR géante */}
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, rotate: -8, scale: 0.9 }}
            animate={{ opacity: 1, rotate: -4, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 160, damping: 16 }}
            style={{ flex: "0 1 260px", display: "flex", justifyContent: "center", margin: "0 auto" }}
          >
            <div style={{ padding: 18, borderRadius: 32, background: C.surface, border: `2px solid ${C.line}`, boxShadow: `8px 8px 0 ${C.terracotta}` }}>
              <MenuQrMark size={196} />
            </div>
          </motion.div>
        </motion.section>

        <PixelStrip count={36} />

        {/* ── Filtres ── */}
        {!search && allTypes.length > 0 && (
          <div style={{ margin: "32px 0 8px" }}>
            <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted }}>
              Filtrer par type
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {allTypes.map(({ type, count }) => {
                const active = activeTypes.has(type.id);
                return (
                  <button
                    key={type.id}
                    aria-pressed={active}
                    onClick={() => toggleType(type.id)}
                    className="mqr-chip"
                    style={{
                      background: active ? C.terracotta : "transparent",
                      color: active ? C.white : C.text,
                      borderColor: active ? C.terracotta : C.line,
                    }}
                  >
                    <span aria-hidden="true" style={{ fontSize: 16 }}>{(TYPE_META[type.slug] ?? { icon: "🍽️" }).icon}</span>
                    {type.name}
                    <span style={{ fontSize: 12, fontWeight: 700, borderRadius: 999, padding: "2px 8px", background: active ? "rgba(255,255,255,0.25)" : C.surface2, color: C.text }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {search && (
          <p aria-live="polite" style={{ margin: "28px 0 0", fontSize: 15, color: C.muted }}>
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour « {search} »
          </p>
        )}

        {/* ── Contenu ── */}
        <div style={{ marginTop: 40 }}>
          {loading ? (
            <div role="status" aria-live="polite" style={{ textAlign: "center", padding: "60px 0" }}>
              <div aria-hidden="true" style={{ display: "grid", gridTemplateColumns: "repeat(6, 12px)", gap: 5, justifyContent: "center", marginBottom: 16 }}>
                {Array.from({ length: 36 }, (_, i) => (
                  <span key={i} className="mqr-pixel" style={{ width: 12, height: 12, borderRadius: 3, background: i % 5 === 0 ? C.terracotta : C.sage, animationDelay: `${((i * 7) % 12) * 0.13}s` }} />
                ))}
              </div>
              <p style={{ margin: 0, color: C.muted, fontSize: 13, letterSpacing: "0.2em" }}>CHARGEMENT…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p aria-hidden="true" style={{ fontSize: 44, margin: "0 0 12px" }}>🔍</p>
              <p style={{ margin: 0, color: C.muted, fontSize: 16 }}>
                {search ? `Aucun restaurant pour « ${search} »` : "Aucun établissement pour le moment."}
              </p>
            </div>
          ) : (
            <>
              {byType.map(({ type, restos }) => (
                <TypeSection key={type.id} typeName={type.name} typeSlug={type.slug} restos={restos} />
              ))}
              {untyped.length > 0 && <TypeSection typeName="Autres" typeSlug="restaurant" restos={untyped} />}
            </>
          )}
        </div>

        {/* ── Comment ça marche ── */}
        <section aria-label="Comment ça marche" style={{ margin: "24px 0 56px", padding: "32px 24px", background: C.surface, border: `2px solid ${C.line}`, borderRadius: 28 }}>
          <h2 style={{ margin: "0 0 24px", fontFamily: FONT_TITLE, fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 600 }}>
            Comment ça marche
          </h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 24 }}>
            {STEPS.map(({ Icon, title, text }, i) => (
              <li key={title} style={{ display: "flex", gap: 14 }}>
                <span aria-hidden="true" style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 14, background: i === 1 ? C.sage : C.terracotta, color: i === 1 ? C.bg : C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={24} />
                </span>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 700 }}>{i + 1}. {title}</p>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.45, color: C.muted }}>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <PixelStrip count={36} />
        <footer style={{ textAlign: "center", padding: "28px 0 0" }}>
          <p style={{ margin: 0, fontSize: 13, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            MenuQr · Menus numériques
          </p>
        </footer>
      </div>

      <style>{`
        .mqr-card {
          position: relative; display: flex; flex-direction: column; text-decoration: none; color: inherit;
          background: ${C.surface}; border: 2px solid ${C.line}; border-radius: 18px;
          box-shadow: 6px 6px 0 ${C.terracotta};
          transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s cubic-bezier(.22,1,.36,1);
        }
        .mqr-card:hover { transform: translate(-3px,-3px); box-shadow: 9px 9px 0 ${C.terracotta}; }
        .mqr-card:active { transform: translate(3px,3px); box-shadow: 3px 3px 0 ${C.terracotta}; }
        .mqr-go {
          flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%;
          background: ${C.sage}; color: ${C.bg}; display: flex; align-items: center; justify-content: center;
          transition: transform .2s;
        }
        .mqr-card:hover .mqr-go { transform: rotate(45deg); }
        .mqr-chip {
          display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 14px;
          border: 2px solid; border-radius: 999px; cursor: pointer; font: 600 15px ${FONT_BODY};
          transition: background .15s, border-color .15s;
        }
        .mqr-chip:hover { border-color: ${C.sage} !important; }
        .mqr-sugg { display: flex; align-items: center; gap: 12px; min-height: 52px; padding: 0 16px; color: ${C.text}; text-decoration: none; font-size: 15px; border-bottom: 1px solid ${C.line}; }
        .mqr-sugg:hover, .mqr-sugg:focus-visible { background: ${C.surface2}; }
        a:focus-visible, button:focus-visible, input:focus-visible { outline: 3px solid ${C.terraLight}; outline-offset: 3px; }
        input::placeholder { color: #4B6657; }
        @keyframes mqr-pixel { 0%,100% { opacity:.15; transform:scale(.75);} 40% { opacity:1; transform:scale(1);} }
        .mqr-pixel { animation: mqr-pixel 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .mqr-pixel { animation: none; opacity: .6; }
          .mqr-card, .mqr-go { transition: none; }
          .mqr-card:hover { transform: none; }
        }
      `}</style>
    </div>
  );
}