// HomePage.tsx — v5 · Direction « Marché vivant »
// Fond terracotta, contours vert profond épais, surlignage jaune, grandes formes rondes, emojis.
// Données Supabase et logique identiques aux versions précédentes.

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
// Palette MenuQr — Marché vivant
// ─────────────────────────────────────────────────────────────

const C = {
  bg:       "#B94A25",   // terracotta (texte blanc dessus : ~5:1)
  ink:      "#0F2A1F",   // vert très profond : contours, ombres, textes sur blanc
  inkSoft:  "#173A2B",
  yellow:   "#FFE066",   // surlignage / accents
  sage:     "#8FC27A",
  white:    "#FFFFFF",
  onBg:     "#FFF1EA",   // texte secondaire sur terracotta
  onWhite:  "#4F6358",   // texte secondaire sur blanc (~6:1)
  line:     "rgba(255,255,255,0.35)",
};

const FONT_TITLE = "'Bricolage Grotesque', 'Inter', system-ui, sans-serif";
const FONT_BODY  = "'Inter', system-ui, sans-serif";

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
// Pixels de QR code (motif de séparation)
// ─────────────────────────────────────────────────────────────

const PIXEL_COLORS = [C.ink, C.yellow, C.white, C.sage, C.ink, C.yellow];

function PixelStrip({ count = 28, size = 12 }: { count?: number; size?: number }) {
  return (
    <div aria-hidden="true" style={{ display: "flex", gap: 5, flexWrap: "nowrap", overflow: "hidden" }}>
      {Array.from({ length: count }, (_, i) => {
        const on = (i * 7 + (i % 3) * 5) % 4 !== 0;
        return (
          <span key={i} style={{
            flexShrink: 0, width: size, height: size, borderRadius: 3,
            background: on ? PIXEL_COLORS[(i * 5) % PIXEL_COLORS.length] : "transparent",
            border: on ? "none" : `2px solid ${C.line}`,
          }} />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo MenuQr (carte blanche)
// ─────────────────────────────────────────────────────────────

function MenuQrMark({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="16 16 182 182" aria-hidden="true">
      <rect x="29" y="29" width="140" height="140" rx="28" fill={C.white} stroke={C.bg} strokeWidth="7" />
      {[[49, 49], [121, 49], [49, 121]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="28" height="28" rx="8" fill="none" stroke={C.bg} strokeWidth="6" />
          <rect x={x + 9} y={y + 9} width="10" height="10" rx="3" fill={C.ink} />
        </g>
      ))}
      <g fill={C.ink}>
        {[[82,46],[82,58],[106,46],[106,58],[82,70],[94,70],[106,70],[94,82],[94,94],[94,106],[94,118],[94,130],[94,142]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" rx="2" />
        ))}
      </g>
      <g fill={C.bg}>
        {[[46,82],[70,82],[58,94],[46,106],[70,106],[118,82],[142,82],[130,94],[118,106],[142,106]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" rx="2" />
        ))}
      </g>
      <g fill={C.sage}>
        {[[142,118],[130,130],[118,142]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" rx="2" />
        ))}
      </g>
      <rect x="172" y="20" width="10" height="10" fill={C.yellow} />
      <rect x="186" y="34" width="7" height="7" fill={C.sage} />
      <rect x="176" y="44" width="5" height="5" fill={C.white} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Carte restaurant — contour épais + ombre pleine
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
        borderRadius: "23px 23px 0 0", borderBottom: `3px solid ${C.ink}`,
        background: `linear-gradient(145deg, ${resto.color_bg ?? C.sage}, ${resto.color_accent ?? C.yellow})`,
      }}>
        {resto.cover_url && (
          <img src={resto.cover_url} alt="" loading="lazy" decoding="async" width={320} height={240}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
        {firstType && (
          <span style={{
            position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 6,
            background: C.yellow, color: C.ink, border: `2px solid ${C.ink}`, borderRadius: 999,
            padding: "4px 11px", fontSize: 12, fontWeight: 700, fontFamily: FONT_BODY,
          }}>
            <span aria-hidden="true">{(TYPE_META[firstType.slug] ?? { icon: "🍽️" }).icon}</span>
            {firstType.name}
          </span>
        )}
      </div>

      {/* Logo chevauchant */}
      <div style={{
        position: "relative", marginTop: -32, marginLeft: 14, width: 62, height: 62, borderRadius: 18,
        background: C.white, border: `3px solid ${C.ink}`,
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", zIndex: 1,
      }}>
        {resto.logo_url
          ? <img src={resto.logo_url} alt="" loading="lazy" decoding="async" width={56} height={56}
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
          : <UtensilsCrossed size={24} color={C.ink} aria-hidden="true" />}
      </div>

      {/* Texte */}
      <div style={{ padding: "10px 16px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <h3 style={{ margin: 0, fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.ink }}>
          {resto.name}
        </h3>
        {resto.tagline && (
          <p style={{
            margin: 0, fontSize: 14, lineHeight: 1.4, color: C.onWhite,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          } as CSSProperties}>
            {resto.tagline}
          </p>
        )}
        <div style={{ marginTop: "auto", paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          {resto.address ? (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.onWhite, minWidth: 0 }}>
              <MapPin size={13} aria-hidden="true" style={{ flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resto.address}</span>
            </span>
          ) : <span />}
          <span className="mqr-go" aria-hidden="true">
            <ArrowUpRight size={20} strokeWidth={2.8} />
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
    <section style={{ marginBottom: 60 }} aria-label={typeName}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <span aria-hidden="true" style={{
          width: 52, height: 52, borderRadius: 16, background: C.yellow, fontSize: 26,
          border: `3px solid ${C.ink}`, boxShadow: `3px 3px 0 ${C.ink}`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>{meta.icon}</span>
        <h2 style={{ margin: 0, fontFamily: FONT_TITLE, fontSize: "clamp(26px, 5.5vw, 36px)", fontWeight: 800, color: C.white, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {typeName}
        </h2>
        <span style={{ fontSize: 14, fontWeight: 800, color: C.yellow, background: C.ink, borderRadius: 999, padding: "4px 13px" }}>
          {restos.length}
        </span>
        <div aria-hidden="true" style={{ flex: 1, height: 3, borderRadius: 2, background: C.line, minWidth: 16 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 250px), 1fr))", gap: 30 }}>
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
const STEP_COLORS = [C.yellow, C.sage, C.white];

// ─────────────────────────────────────────────────────────────
// Réseaux sociaux de MenuQr  →  REMPLACEZ les liens par les vôtres
// ─────────────────────────────────────────────────────────────

type SocialIcon = (p: { size?: number }) => JSX.Element;

const IconInstagram: SocialIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const IconFacebook: SocialIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconWhatsapp: SocialIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
const IconTiktok: SocialIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1-.13z" />
  </svg>
);

const SOCIAL_LINKS: { key: string; label: string; handle: string; href: string; Icon: SocialIcon }[] = [
  { key: "instagram", label: "Instagram", handle: "@menuqr",  href: "https://instagram.com/menuqr",  Icon: IconInstagram },
  { key: "facebook",  label: "Facebook",  handle: "MenuQr",   href: "https://facebook.com/menuqr",   Icon: IconFacebook },
  { key: "tiktok",    label: "TikTok",    handle: "@menuqr",  href: "https://tiktok.com/@menuqr",    Icon: IconTiktok },
  { key: "whatsapp",  label: "WhatsApp",  handle: "Nous écrire", href: "https://wa.me/237600000000", Icon: IconWhatsapp },
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
    link.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Inter:wght@400;500;700&display=swap";
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
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      {/* Texture : petits carrés discrets */}
      <svg aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", opacity: 0.12, pointerEvents: "none" }}>
        <defs>
          <pattern id="home-pixels" width="56" height="56" patternUnits="userSpaceOnUse">
            <rect x="8" y="8" width="8" height="8" rx="2" fill={C.yellow} />
            <rect x="34" y="26" width="6" height="6" rx="1.5" fill={C.white} />
            <rect x="18" y="42" width="5" height="5" rx="1.5" fill={C.ink} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#home-pixels)" />
      </svg>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto", padding: "0 20px 64px" }}>

        {/* ── Barre de marque ── */}
        <header style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 0" }}>
          <MenuQrMark size={44} />
          <span style={{ fontFamily: FONT_TITLE, fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>
            Menu<span style={{ color: C.yellow }}>Qr</span>
          </span>
        </header>

        {/* ── HERO ── */}
        <motion.section
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "32px 48px", padding: "24px 0 44px" }}
        >
          <div style={{ flex: "1 1 340px", minWidth: 0 }}>
            <p style={{
              display: "inline-block", margin: "0 0 18px", padding: "6px 14px", borderRadius: 999,
              background: C.ink, color: C.yellow, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            }}>
              Menus numériques près de chez vous
            </p>
            <h1 style={{
              margin: "0 0 22px", fontFamily: FONT_TITLE, fontWeight: 800,
              fontSize: "clamp(44px, 10vw, 84px)", lineHeight: 0.96, letterSpacing: "-0.04em",
            }}>
              Faim ?<br />
              <mark style={{
                display: "inline-block", background: C.yellow, color: C.ink, padding: "0 14px", borderRadius: 16,
                border: `3px solid ${C.ink}`, transform: "rotate(-2deg)", margin: "6px 0",
              }}>
                Scannez
              </mark><br />
              et c'est servi.
            </h1>
            <p style={{ margin: "0 0 30px", fontSize: 17, lineHeight: 1.55, color: C.onBg, maxWidth: 460 }}>
              Les menus de vos restaurants, cafés et bars préférés : photos, prix et allergènes, sans rien télécharger.
            </p>

            {/* Recherche */}
            <div style={{ position: "relative", maxWidth: 520 }}>
              <div role="search" style={{
                display: "flex", alignItems: "center", gap: 6, minHeight: 60,
                background: C.white, borderRadius: 20, padding: "0 8px 0 18px",
                border: `3px solid ${C.ink}`, boxShadow: `5px 5px 0 ${C.ink}`,
              }}>
                <Search size={22} color={C.ink} aria-hidden="true" style={{ flexShrink: 0 }} />
                <input
                  type="search"
                  aria-label="Rechercher un restaurant"
                  autoComplete="off"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setShowSuggestions(Boolean(e.target.value.trim())); }}
                  onFocus={() => search && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Un restaurant, une adresse…"
                  style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", padding: "14px 6px", fontSize: 16, fontWeight: 500, color: C.ink, fontFamily: FONT_BODY }}
                />
                {search && (
                  <button aria-label="Effacer la recherche" onClick={() => { setSearch(""); setShowSuggestions(false); }}
                    style={{ background: "none", border: "none", cursor: "pointer", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <X size={20} color={C.ink} aria-hidden="true" />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    style={{ position: "absolute", top: "calc(100% + 16px)", left: 0, right: 0, margin: 0, padding: 0, listStyle: "none",
                      background: C.white, border: `3px solid ${C.ink}`, borderRadius: 18, overflow: "hidden", zIndex: 50,
                      boxShadow: `5px 5px 0 ${C.ink}` }}
                  >
                    {suggestions.map(r => {
                      const t = r.types?.[0];
                      return (
                        <li key={r.id}>
                          <a href={`/${r.slug}`} className="mqr-sugg">
                            <span aria-hidden="true" style={{ fontSize: 20 }}>{(t ? TYPE_META[t.slug] : undefined)?.icon ?? "🍽️"}</span>
                            <span style={{ fontWeight: 700 }}>{r.name}</span>
                            {t && <span style={{ marginLeft: "auto", fontSize: 13, color: C.onWhite }}>{t.name}</span>}
                          </a>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Carte QR + stickers */}
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, rotate: -8, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 3, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 160, damping: 14 }}
            style={{ position: "relative", flex: "0 1 270px", display: "flex", justifyContent: "center", margin: "0 auto" }}
          >
            <div style={{ padding: 18, borderRadius: 34, background: C.white, border: `3px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}` }}>
              <MenuQrMark size={196} />
            </div>
            <span style={{ position: "absolute", top: -18, right: -6, width: 58, height: 58, borderRadius: "50%", background: C.yellow, border: `3px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, transform: "rotate(12deg)" }}>🍲</span>
            <span style={{ position: "absolute", bottom: -16, left: -8, width: 54, height: 54, borderRadius: "50%", background: C.sage, border: `3px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, transform: "rotate(-10deg)" }}>☕</span>
          </motion.div>
        </motion.section>

        <PixelStrip count={36} />

        {/* ── Filtres ── */}
        {!search && allTypes.length > 0 && (
          <div style={{ margin: "34px 0 8px" }}>
            <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.onBg }}>
              Filtrer par type
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {allTypes.map(({ type, count }) => {
                const active = activeTypes.has(type.id);
                return (
                  <button
                    key={type.id}
                    aria-pressed={active}
                    onClick={() => toggleType(type.id)}
                    className="mqr-chip"
                    style={{ background: active ? C.yellow : C.white }}
                  >
                    <span aria-hidden="true" style={{ fontSize: 17 }}>{(TYPE_META[type.slug] ?? { icon: "🍽️" }).icon}</span>
                    {type.name}
                    <span style={{ fontSize: 12, fontWeight: 800, borderRadius: 999, padding: "2px 8px", background: C.ink, color: C.white }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {search && (
          <p aria-live="polite" style={{ margin: "28px 0 0", fontSize: 15, color: C.onBg }}>
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour « {search} »
          </p>
        )}

        {/* ── Contenu ── */}
        <div style={{ marginTop: 44 }}>
          {loading ? (
            <div role="status" aria-live="polite" style={{ textAlign: "center", padding: "60px 0" }}>
              <div aria-hidden="true" style={{ display: "grid", gridTemplateColumns: "repeat(6, 14px)", gap: 6, justifyContent: "center", marginBottom: 18 }}>
                {Array.from({ length: 36 }, (_, i) => (
                  <span key={i} className="mqr-pixel" style={{ width: 14, height: 14, borderRadius: 4, background: i % 5 === 0 ? C.ink : C.yellow, animationDelay: `${((i * 7) % 12) * 0.13}s` }} />
                ))}
              </div>
              <p style={{ margin: 0, color: C.onBg, fontSize: 13, fontWeight: 700, letterSpacing: "0.2em" }}>CHARGEMENT…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p aria-hidden="true" style={{ fontSize: 48, margin: "0 0 12px" }}>🔍</p>
              <p style={{ margin: 0, color: C.onBg, fontSize: 17 }}>
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
        <section aria-label="Comment ça marche" style={{
          margin: "24px 0 56px", padding: "34px 26px", background: C.ink, borderRadius: 32,
          border: `3px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.yellow}`,
        }}>
          <h2 style={{ margin: "0 0 26px", fontFamily: FONT_TITLE, fontSize: "clamp(26px, 5.5vw, 36px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Comment ça marche
          </h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 26 }}>
            {STEPS.map(({ Icon, title, text }, i) => (
              <li key={title} style={{ display: "flex", gap: 14 }}>
                <span aria-hidden="true" style={{
                  flexShrink: 0, width: 52, height: 52, borderRadius: 16, background: STEP_COLORS[i], color: C.ink,
                  border: `3px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center",
                  transform: `rotate(${i === 1 ? 4 : -4}deg)`,
                }}>
                  <Icon size={24} />
                </span>
                <div>
                  <p style={{ margin: "0 0 4px", fontFamily: FONT_TITLE, fontSize: 20, fontWeight: 800 }}>{i + 1}. {title}</p>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "#D5E4DA" }}>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Réseaux sociaux ── */}
        <section aria-label="Réseaux sociaux" style={{ margin: "0 0 52px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <span aria-hidden="true" style={{
              width: 52, height: 52, borderRadius: 16, background: C.yellow, fontSize: 26,
              border: `3px solid ${C.ink}`, boxShadow: `3px 3px 0 ${C.ink}`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>📣</span>
            <h2 style={{ margin: 0, fontFamily: FONT_TITLE, fontSize: "clamp(26px, 5.5vw, 36px)", fontWeight: 800, color: C.white, lineHeight: 1, letterSpacing: "-0.02em" }}>
              Suivez-nous
            </h2>
            <div aria-hidden="true" style={{ flex: 1, height: 3, borderRadius: 2, background: C.line, minWidth: 16 }} />
          </div>
          <p style={{ margin: "0 0 24px 66px", fontSize: 15, lineHeight: 1.5, color: C.onBg }}>
            Nouveaux restaurants, nouveaux menus et bons plans.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))", gap: 20 }}>
            {SOCIAL_LINKS.map(({ key, label, handle, href, Icon }, i) => (
              <motion.a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} — ${handle}`}
                className="mqr-social"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <span aria-hidden="true" className="mqr-social-icon" style={{ transform: `rotate(${i % 2 === 0 ? -4 : 4}deg)` }}>
                  <Icon size={24} />
                </span>
                <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontFamily: FONT_TITLE, fontSize: 18, fontWeight: 800, color: C.white, lineHeight: 1.1 }}>{label}</span>
                  <span style={{ fontSize: 13, color: "#D5E4DA", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{handle}</span>
                </span>
                <span aria-hidden="true" className="mqr-social-go">
                  <ArrowUpRight size={20} strokeWidth={2.8} />
                </span>
              </motion.a>
            ))}
          </div>
        </section>

        <PixelStrip count={36} />
        <footer style={{ textAlign: "center", padding: "28px 0 0" }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.onBg, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            MenuQr · Menus numériques
          </p>
        </footer>
      </div>

      <style>{`
        .mqr-card {
          position: relative; display: flex; flex-direction: column; text-decoration: none; color: ${C.ink};
          background: ${C.white}; border: 3px solid ${C.ink}; border-radius: 26px;
          box-shadow: 6px 6px 0 ${C.ink};
          transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s cubic-bezier(.22,1,.36,1);
        }
        .mqr-card:hover { transform: translate(-3px,-3px) rotate(-0.6deg); box-shadow: 10px 10px 0 ${C.ink}; }
        .mqr-card:active { transform: translate(3px,3px); box-shadow: 3px 3px 0 ${C.ink}; }
        .mqr-go {
          flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%;
          background: ${C.ink}; color: ${C.yellow}; display: flex; align-items: center; justify-content: center;
          transition: transform .2s, background .2s;
        }
        .mqr-card:hover .mqr-go { transform: rotate(45deg); background: ${C.bg}; color: ${C.white}; }
        .mqr-chip {
          display: inline-flex; align-items: center; gap: 8px; min-height: 46px; padding: 0 16px;
          color: ${C.ink}; border: 3px solid ${C.ink}; border-radius: 999px; cursor: pointer;
          font: 700 15px ${FONT_BODY}; box-shadow: 3px 3px 0 ${C.ink};
          transition: transform .15s, box-shadow .15s, background .15s;
        }
        .mqr-chip:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 ${C.ink}; }
        .mqr-chip[aria-pressed="true"] { transform: translate(2px,2px); box-shadow: 1px 1px 0 ${C.ink}; }
        .mqr-sugg { display: flex; align-items: center; gap: 12px; min-height: 54px; padding: 0 18px; color: ${C.ink}; text-decoration: none; font-size: 15px; border-bottom: 2px solid rgba(15,42,31,.12); }
        .mqr-sugg:hover, .mqr-sugg:focus-visible { background: ${C.yellow}; }
        .mqr-social {
          display: flex; align-items: center; gap: 14px; min-height: 76px; padding: 12px 16px;
          background: ${C.ink}; border: 3px solid ${C.ink}; border-radius: 22px;
          box-shadow: 5px 5px 0 ${C.yellow}; text-decoration: none;
          transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s cubic-bezier(.22,1,.36,1);
        }
        .mqr-social:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 ${C.yellow}; }
        .mqr-social:active { transform: translate(3px,3px); box-shadow: 2px 2px 0 ${C.yellow}; }
        .mqr-social-icon {
          flex-shrink: 0; width: 50px; height: 50px; border-radius: 15px;
          background: ${C.yellow}; color: ${C.ink}; border: 3px solid ${C.white};
          display: flex; align-items: center; justify-content: center;
        }
        .mqr-social-go { margin-left: auto; flex-shrink: 0; color: ${C.yellow}; display: flex; transition: transform .2s; }
        .mqr-social:hover .mqr-social-go { transform: rotate(45deg); }
        a:focus-visible, button:focus-visible, input:focus-visible { outline: 3px solid ${C.ink}; outline-offset: 3px; }
        input::placeholder { color: #6B7D72; }
        @keyframes mqr-pixel { 0%,100% { opacity:.2; transform:scale(.75);} 40% { opacity:1; transform:scale(1);} }
        .mqr-pixel { animation: mqr-pixel 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .mqr-pixel { animation: none; opacity: .7; }
          .mqr-card, .mqr-go, .mqr-chip, .mqr-social, .mqr-social-go { transition: none; }
          .mqr-card:hover, .mqr-social:hover { transform: none; }
        }
      `}</style>
    </div>
  );
}