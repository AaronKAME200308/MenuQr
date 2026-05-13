/**
 * MenuPage.tsx — v2
 * ──────────────────
 * • Header dynamique : grand titre animé, logo pulsant, vague SVG
 * • Barre de recherche flottante (filtre les items en temps réel)
 * • Section socials "fun" avec cartes colorées et hover animé
 *
 * Dépendances : framer-motion, lucide-react, react-icons, @supabase/supabase-js
 */

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import {
  MapPin, Phone, Globe, MessageCircle, Music2,
  UtensilsCrossed, Search, X,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

import CategoryNav     from "./CategoryNav";
import CategorySection from "./CategorySection";
import ItemModal       from "./ItemModal";
import type { Restaurant, Category, MenuItem, Colors } from "./types";

// ─────────────────────────────────────────────────────────────
// Supabase
// ─────────────────────────────────────────────────────────────

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

// ─────────────────────────────────────────────────────────────
// Global styles
// ─────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
  @keyframes spin { to { transform: rotate(360deg) } }
  @keyframes pulse-ring {
    0%   { transform: scale(0.9); opacity: 0.7; }
    70%  { transform: scale(1.3); opacity: 0;   }
    100% { transform: scale(1.3); opacity: 0;   }
  }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { display: none; }
`;

// ─────────────────────────────────────────────────────────────
// Arrière-plan décoratif
// ─────────────────────────────────────────────────────────────

function StyledBackground({ colors }: { colors: Colors }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: colors.bg }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bg-k" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,2 58,30 30,58 2,30" fill="none" stroke={colors.primary} strokeWidth="0.7" opacity="1" />
            <circle cx="30" cy="30" r="2.5" fill={colors.primary} opacity="0.35" />
          </pattern>
          <pattern id="bg-w" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect x="12" y="0" width="6" height="30" fill={colors.primary} opacity="0.12" />
            <rect x="0" y="12" width="30" height="6" fill={colors.primary} opacity="0.12" />
          </pattern>
        </defs>
        <rect width="100%" height="50%" fill="url(#bg-k)" opacity="0.055" />
        <rect y="40%" width="100%" height="60%" fill="url(#bg-w)" opacity="0.065" />
      </svg>
      <div style={{ position: "absolute", top: "-18%", left: "-18%", width: "60%", height: "60%", background: `radial-gradient(ellipse, ${colors.accent}55 0%, transparent 65%)`, filter: "blur(80px)" }} />
      <div style={{ position: "absolute", bottom: "0%", right: "-12%", width: "55%", height: "50%", background: `radial-gradient(ellipse, ${colors.accent}30 0%, transparent 65%)`, filter: "blur(90px)" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO — header dynamique avec parallax + vague SVG
// ─────────────────────────────────────────────────────────────

function DynamicHero({ restaurant, colors }: { restaurant: Restaurant; colors: Colors }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 180], [1, 0]);
  const y       = useTransform(scrollY, [0, 180], [0, -40]);

  return (
    <motion.header
      ref={heroRef}
      style={{ opacity, y, position: "relative", overflow: "hidden", paddingBottom: 0 }}
    >
      {/* ── Fond arc coloré ── */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "72%",
          background: `linear-gradient(160deg, ${colors.accent} 0%, ${colors.accent}99 100%)`,
          borderRadius: "0 0 50% 50% / 0 0 80px 80px",
          zIndex: 0,
        }}
      />

      {/* Texture points sur l'arc */}
      <svg aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, width: "100%", height: "72%", opacity: 0.08, zIndex: 0, pointerEvents: "none" }}>
        <defs>
          <pattern id="hero-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="2" fill={colors.primary} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>

      {/* Contenu */}
      <div style={{ position: "relative", zIndex: 1, padding: "clamp(36px,8vw,64px) 24px clamp(48px,10vw,80px)", textAlign: "center" }}>

        {/* Logo pulsant */}
        <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 20px" }}>
          {/* Anneau pulse */}
          <div style={{
            position: "absolute", inset: -8,
            borderRadius: "50%",
            border: `2px solid ${colors.primary}40`,
            animation: "pulse-ring 2.4s ease-out infinite",
          }} />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 20 }}
            style={{
              width: 90, height: 90, borderRadius: "50%",
              border: `3px solid ${colors.primary}30`,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {restaurant.logo_url
              ? <img src={restaurant.logo_url} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 40 }}>🍽️</span>
            }
          </motion.div>
        </div>

        {/* Mot MENU en grand — typo éditorial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(64px, 20vw, 108px)",
            lineHeight: 0.82,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "#fff",
            fontFamily: restaurant.font_display ?? "Georgia, serif",
            userSelect: "none",
            textShadow: `0 6px 30px ${colors.accent}60`,
          }}
        >
          ME<br />NU
        </motion.div>

        {/* Nom du restaurant */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          style={{
            marginTop: 14,
            fontSize: "clamp(15px, 4vw, 22px)",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.9)",
            fontFamily: restaurant.font_display ?? "Georgia, serif",
            fontWeight: 400,
          }}
        >
          {restaurant.name}
        </motion.h1>

        {/* Séparateur animé */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.38, duration: 0.6 }}
          style={{ width: 48, height: 2, background: "rgba(255,255,255,0.4)", margin: "14px auto", borderRadius: 2 }}
        />

        {restaurant.tagline && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42 }}
            style={{ fontSize: 12, letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}
          >
            {restaurant.tagline}
          </motion.p>
        )}

        {restaurant.address && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.48 }}
            style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
          >
            <MapPin size={11} /> {restaurant.address}
          </motion.p>
        )}
      </div>
    </motion.header>
  );
}

// ─────────────────────────────────────────────────────────────
// BARRE DE RECHERCHE
// ─────────────────────────────────────────────────────────────

function SearchBar({
  query,
  setQuery,
  colors,
  resultCount,
}: {
  query: string;
  setQuery: (v: string) => void;
  colors: Colors;
  resultCount: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      style={{ padding: "12px 16px 4px" }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1.5px solid ${query ? colors.primary + "40" : colors.primary + "18"}`,
          borderRadius: 16,
          padding: "0 14px",
          transition: "border-color 0.25s",
          boxShadow: query ? `0 4px 20px ${colors.accent}25` : "none",
        }}
      >
        <Search size={15} color={`${colors.primary}55`} style={{ flexShrink: 0 }} />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un plat…"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            padding: "13px 10px",
            fontSize: 13,
            color: colors.primary,
            fontFamily: "sans-serif",
          }}
        />

        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {/* Compteur résultats */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: colors.accent,
                  background: `${colors.accent}20`,
                  borderRadius: 999,
                  padding: "2px 8px",
                  fontFamily: "sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {resultCount} résultat{resultCount !== 1 ? "s" : ""}
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
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SOCIALS — section fun colorée
// ─────────────────────────────────────────────────────────────

const SOCIAL_META = [
  { key: "social_facebook",   label: "Facebook",     emoji: "👥", bg: "#1877F2", Icon: FaFacebook   },
  { key: "social_instagram",  label: "Instagram",    emoji: "📸", bg: "#E1306C", Icon: FaInstagram   },
  { key: "social_whatsapp",   label: "WhatsApp",     emoji: "💬", bg: "#25D366", Icon: MessageCircle },
  { key: "social_tiktok",     label: "TikTok",       emoji: "🎵", bg: "#010101", Icon: Music2        },
  { key: "social_googlemaps", label: "Maps",         emoji: "📍", bg: "#EA4335", Icon: MapPin        },
  { key: "social_website",    label: "Site web",     emoji: "🌐", bg: "#6366f1", Icon: Globe         },
];

function FunSocials({ restaurant, colors }: { restaurant: Restaurant; colors: Colors }) {
  const socials = [
    ...SOCIAL_META
      .filter(s => Boolean(restaurant[s.key as keyof Restaurant]))
      .map(s => ({ ...s, href: restaurant[s.key as keyof Restaurant] as string })),
    ...(restaurant.phone ? [{
      key: "phone", label: "Appeler", emoji: "📞", bg: "#555",
      Icon: Phone, href: `tel:${restaurant.phone}`,
    }] : []),
  ];

  if (socials.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ margin: "8px 16px 28px" }}
    >
      {/* Titre section */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: `${colors.primary}15` }} />
        <p style={{ fontSize: 10, letterSpacing: "0.25em", color: `${colors.primary}40`, fontFamily: "sans-serif", textTransform: "uppercase", flexShrink: 0 }}>
          🤝 Rejoins-nous
        </p>
        <div style={{ flex: 1, height: 1, background: `${colors.primary}15` }} />
      </div>

      {/* Grille */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
        {socials.map(({ key, label, emoji, bg, Icon, href }, idx) => (
          <motion.a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.34, 1.3, 0.64, 1] }}
            whileHover={{ y: -5, scale: 1.04, boxShadow: `0 14px 36px ${bg}40` }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "18px 12px 16px",
              borderRadius: 20,
              background: `${bg}18`,
              border: `1.5px solid ${bg}30`,
              textDecoration: "none",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {/* Icône dans cercle coloré */}
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 6px 18px ${bg}50`,
                fontSize: 18,
              }}
            >
              <Icon size={20} color="#fff" />
            </motion.div>

            {/* Label + emoji */}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: colors.primary, marginBottom: 2 }}>
                {emoji} {label}
              </p>
              {key !== "phone" && (
                <p style={{ fontSize: 9, color: `${colors.primary}38`, fontFamily: "sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>
                  {href.replace(/^https?:\/\//, "").split("/")[0]}
                </p>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// MenuPage principal
// ─────────────────────────────────────────────────────────────

type MenuPageProps = { slug: string };

export default function MenuPage({ slug }: MenuPageProps) {
  const [restaurant, setRestaurant]     = useState<Restaurant | null>(null);
  const [categories, setCategories]     = useState<Category[]>([]);
  const [items, setItems]               = useState<MenuItem[]>([]);
  const [activeCategory, setActive]     = useState<string>("all");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery]   = useState("");

  const openModal  = useCallback((item: MenuItem) => setSelectedItem(item), []);
  const closeModal = useCallback(() => setSelectedItem(null), []);

  // ── Fetch ──────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const { data: resto, error: e1 } = await supabase
          .from("restaurants").select("*").eq("slug", slug).single<Restaurant>();
        if (e1) throw e1;
        const { data: cats, error: e2 } = await supabase
          .from("categories").select("*")
          .eq("restaurant_id", resto.id).order("sort_order").returns<Category[]>();
        if (e2) throw e2;
        const { data: menuItems, error: e3 } = await supabase
          .from("menu_items").select("*")
          .eq("restaurant_id", resto.id)
          .eq("is_available", true).order("sort_order").returns<MenuItem[]>();
        if (e3) throw e3;
        setRestaurant(resto);
        setCategories(cats ?? []);
        setItems(menuItems ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const colors: Colors = {
    bg:      restaurant?.color_bg      ?? "#0a2e20",
    primary: restaurant?.color_primary ?? "#F5E6C8",
    accent:  restaurant?.color_accent  ?? "#1a5c3a",
    card:    restaurant?.color_card    ?? "#0d3d28",
  };

  // ── Filtres combinés : catégorie + recherche ───────────────
  const itemsByCategory = useMemo(() =>
    categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = items.filter(i => i.category_id === cat.id);
      return acc;
    }, {}),
  [categories, items]);

  const activeCats = useMemo(() =>
    categories.filter(c => (itemsByCategory[c.id] ?? []).length > 0),
  [categories, itemsByCategory]);

  // Filtrage par recherche
  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  // Items par catégorie après recherche
  const filteredByCategory = useMemo(() =>
    categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = searchedItems.filter(i => i.category_id === cat.id);
      return acc;
    }, {}),
  [categories, searchedItems]);

  // Catégories à afficher (filtrées par recherche + catégorie active)
  const filteredCats = useMemo(() => {
    const cats = activeCats.filter(c => (filteredByCategory[c.id] ?? []).length > 0);
    if (searchQuery.trim()) return cats; // recherche ignore le filtre catégorie
    return activeCategory === "all" ? cats : cats.filter(c => c.id === activeCategory);
  }, [activeCats, filteredByCategory, searchQuery, activeCategory]);

  const totalResults = useMemo(() =>
    filteredCats.reduce((n, c) => n + (filteredByCategory[c.id] ?? []).length, 0),
  [filteredCats, filteredByCategory]);

  // ── Loading ────────────────────────────────────────────────
  if (loading) return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: colors.bg }}>
      <style>{GLOBAL_STYLES}</style>
      <StyledBackground colors={colors} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${colors.primary}30`, borderTopColor: colors.primary, animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: 11, letterSpacing: 4, color: `${colors.primary}55`, fontFamily: "sans-serif" }}>CHARGEMENT…</p>
      </div>
    </div>
  );

  if (error || !restaurant) return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: colors.bg }}>
      <style>{GLOBAL_STYLES}</style>
      <StyledBackground colors={colors} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <UtensilsCrossed size={40} style={{ color: `${colors.primary}40`, margin: "0 auto 16px" }} />
        <p style={{ color: colors.primary, fontFamily: "sans-serif" }}>Restaurant introuvable.</p>
      </div>
    </div>
  );

  let globalIdx = 0;

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <StyledBackground colors={colors} />

      {/* Modal — géré en interne par AnimatePresence */}
      <ItemModal item={selectedItem} colors={colors} onClose={closeModal} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", width: "100%", overflow: "visible" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>

          {/* ┌────────────────────────────────────┐
              │  HERO dynamique                    │
              └────────────────────────────────────┘ */}
          <DynamicHero restaurant={restaurant} colors={colors} />

          <div
  style={{
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: `${colors.bg}d0`,          // ~80 % opaque
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: `1px solid ${colors.primary}10`,
    // Légère ombre vers le bas pour bien séparer du contenu
    boxShadow: `0 4px 24px ${colors.bg}80`,
  }}
>
  <SearchBar
    query={searchQuery}
    setQuery={setSearchQuery}
    colors={colors}
    resultCount={totalResults}
  />
 
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
        />
      </motion.div>
    )}
  </AnimatePresence>
</div>

          {/* ┌────────────────────────────────────┐
              │  MENU                              │
              └────────────────────────────────────┘ */}
          <main style={{ paddingBottom: 32, paddingTop: 8, overflow: "visible" }}>
            <AnimatePresence >
              {filteredCats.length === 0 ? (
                <motion.div
                  key="no-result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: "center", padding: "48px 24px", color: `${colors.primary}50`, fontFamily: "sans-serif" }}
                >
                  <p style={{ fontSize: 36, marginBottom: 12 }}>🔍</p>
                  <p style={{ fontSize: 14 }}>Aucun plat trouvé pour « {searchQuery} »</p>
                </motion.div>
              ) : (
                filteredCats.map(cat => {
                  const catItems = filteredByCategory[cat.id] ?? [];
                  const startIdx = globalIdx;
                  globalIdx += catItems.length;
                  return (
                    <CategorySection
                      key={cat.id}
                      category={cat}
                      items={catItems}
                      colors={colors}
                      globalIndex={startIdx}
                      onOpen={openModal}
                    />
                  );
                })
              )}
            </AnimatePresence>
          </main>

          {/* ┌────────────────────────────────────┐
              │  SOCIALS fun                       │
              └────────────────────────────────────┘ */}
          <FunSocials restaurant={restaurant} colors={colors} />

          {/* Footer */}
          <footer style={{ textAlign: "center", padding: "24px 16px 40px", borderTop: `1px solid ${colors.primary}08` }}>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", color: `${colors.primary}22`, fontFamily: "sans-serif", textTransform: "uppercase" }}>
              {restaurant.name} · Menu numérique
            </p>
            <p style={{ fontSize: 9, marginTop: 4, color: `${colors.primary}14`, fontFamily: "sans-serif" }}>
              Propulsé par MenuQR
            </p>
          </footer>

        </div>
      </div>
    </>
  );
}