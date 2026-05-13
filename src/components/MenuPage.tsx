/**
 * MenuPage.tsx — REFONTE
 * ──────────────────────
 * ✦ Header : typo massive animée en slide + halo pulsant sur le logo
 * ✦ Barre de recherche : sticky sous la nav, expand animé
 * ✦ Réseaux sociaux : cartes colorées vives avec hover animé
 *
 * Dépendances npm :
 *   framer-motion lucide-react react-icons @supabase/supabase-js
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import {
  MapPin, Phone, Globe,
  MessageCircle, Music2, UtensilsCrossed, Search, X,
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
// Socials config
// ─────────────────────────────────────────────────────────────

type SocialConfig = {
  key: keyof Restaurant | "phone";
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  gradient: string;
  emoji: string;
};

const SOCIAL_CONFIG: SocialConfig[] = [
  {
    key: "social_facebook", label: "Facebook", Icon: FaFacebook,
    gradient: "linear-gradient(135deg, #1877F2, #0a5dc2)", emoji: "👥",
  },
  {
    key: "social_instagram", label: "Instagram", Icon: FaInstagram,
    gradient: "linear-gradient(135deg, #f09433, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888)", emoji: "📸",
  },
  {
    key: "social_whatsapp", label: "WhatsApp", Icon: MessageCircle,
    gradient: "linear-gradient(135deg, #25D366, #128C7E)", emoji: "💬",
  },
  {
    key: "social_tiktok", label: "TikTok", Icon: Music2,
    gradient: "linear-gradient(135deg, #010101, #69C9D0 50%, #EE1D52)", emoji: "🎵",
  },
  {
    key: "social_googlemaps", label: "Nous trouver", Icon: MapPin,
    gradient: "linear-gradient(135deg, #EA4335, #FBBC05 60%, #34A853)", emoji: "📍",
  },
  {
    key: "social_website", label: "Site web", Icon: Globe,
    gradient: "linear-gradient(135deg, #667eea, #764ba2)", emoji: "🌐",
  },
];

// ─────────────────────────────────────────────────────────────
// Global styles
// ─────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
  @keyframes spin { to { transform: rotate(360deg) } }
  @keyframes halo-pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.12); }
  }
  @keyframes slide-up-letter {
    from { transform: translateY(110%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  nav::-webkit-scrollbar { display: none }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { display: none; }
`;

// ─────────────────────────────────────────────────────────────
// Background décoratif
// ─────────────────────────────────────────────────────────────

function StyledBackground({ colors }: { colors: Colors }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: colors.bg }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bg-kente" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,2 58,30 30,58 2,30" fill="none" stroke={colors.primary} strokeWidth="0.8" opacity="1" />
            <polygon points="30,14 46,30 30,46 14,30" fill="none" stroke={colors.primary} strokeWidth="0.4" opacity="1" />
            <circle cx="30" cy="30" r="3" fill={colors.primary} opacity="0.4" />
          </pattern>
          <pattern id="bg-leaves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10,50 Q25,10 40,50 Q25,90 10,50 Z" fill="none" stroke={colors.primary} strokeWidth="0.6" opacity="1" />
            <line x1="10" y1="50" x2="40" y2="50" stroke={colors.primary} strokeWidth="0.4" opacity="1" />
          </pattern>
          <pattern id="bg-wax" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect x="12" y="0" width="6" height="30" fill={colors.primary} opacity="0.15" />
            <rect x="0" y="12" width="30" height="6" fill={colors.primary} opacity="0.15" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="45%" fill="url(#bg-kente)" opacity="0.06" />
        <rect x="0" y="30%" width="100%" height="45%" fill="url(#bg-wax)" opacity="0.07" />
        <rect x="0" y="55%" width="100%" height="45%" fill="url(#bg-leaves)" opacity="0.07" />
      </svg>
      <div style={{ position: "absolute", top: "-15%", left: "-15%", width: "55%", height: "55%", background: `radial-gradient(ellipse, ${colors.accent}60 0%, transparent 65%)`, filter: "blur(70px)" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "-10%", width: "50%", height: "45%", background: `radial-gradient(ellipse, ${colors.accent}35 0%, transparent 65%)`, filter: "blur(90px)" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AnimatedLetter — pour le MENU massif
// ─────────────────────────────────────────────────────────────

function AnimatedLetter({
  char,
  delay,
  colors,
  fontFamily,
}: {
  char: string;
  delay: number;
  colors: Colors;
  fontFamily: string;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        lineHeight: 0.85,
      }}
    >
      <motion.span
        display="inline-block"
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay,
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          display: "inline-block",
          fontSize: "clamp(64px, 19vw, 108px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: colors.primary,
          fontFamily,
        }}
      >
        {char}
      </motion.span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero header
// ─────────────────────────────────────────────────────────────

function HeroHeader({
  restaurant,
  colors,
}: {
  restaurant: Restaurant;
  colors: Colors;
}) {
  const letters = ["M", "E", "N", "U"];
  const fontFamily = restaurant.font_display ?? "Georgia, serif";

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: "clamp(40px, 10vw, 72px) 24px clamp(28px, 7vw, 52px)",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Ligne décorative haut */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 60,
          height: 1,
          background: `linear-gradient(to right, transparent, ${colors.primary}50, transparent)`,
          margin: "0 auto 24px",
        }}
      />

      {/* Logo avec halo pulsant */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 20 }}
        style={{ position: "relative", width: 88, height: 88, margin: "0 auto 24px" }}
      >
        {/* Halo 1 */}
        <div
          style={{
            position: "absolute",
            inset: -18,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.accent}55 0%, transparent 70%)`,
            animation: "halo-pulse 2.8s ease-in-out infinite",
          }}
        />
        {/* Halo 2 (décalé) */}
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.accent}30 0%, transparent 70%)`,
            animation: "halo-pulse 2.8s ease-in-out infinite 1.4s",
          }}
        />
        {/* Cercle logo */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: `2px solid ${colors.primary}25`,
            background: `rgba(255,255,255,0.06)`,
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {restaurant.logo_url
            ? <img src={restaurant.logo_url} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 40 }}>🍽️</span>
          }
        </div>
      </motion.div>

      {/* Label Restaurant */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        style={{
          fontSize: 9,
          letterSpacing: "0.5em",
          color: `${colors.primary}40`,
          fontFamily: "sans-serif",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Restaurant
      </motion.p>

      {/* MENU — lettres animées */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.04em", marginBottom: 10 }}>
        {letters.map((char, i) => (
          <AnimatedLetter
            key={i}
            char={char}
            delay={0.28 + i * 0.07}
            colors={colors}
            fontFamily={fontFamily}
          />
        ))}
      </div>

      {/* Nom du restaurant */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.68, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontSize: "clamp(16px, 4.5vw, 24px)",
          letterSpacing: "0.18em",
          color: colors.primary,
          fontFamily,
          fontWeight: 400,
          margin: "0 0 12px",
        }}
      >
        {restaurant.name}
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.78, duration: 0.5 }}
        style={{ width: 44, height: 1, background: `${colors.primary}28`, margin: "0 auto 10px" }}
      />

      {restaurant.tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          style={{ fontSize: 11, letterSpacing: "0.1em", color: `${colors.primary}40`, fontFamily: "sans-serif" }}
        >
          {restaurant.tagline}
        </motion.p>
      )}

      {restaurant.address && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{ fontSize: 11, color: `${colors.primary}35`, fontFamily: "sans-serif", marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
        >
          <MapPin size={10} />
          {restaurant.address}
        </motion.p>
      )}
    </motion.header>
  );
}

// ─────────────────────────────────────────────────────────────
// SearchBar — sticky, expand animé
// ─────────────────────────────────────────────────────────────

function SearchBar({
  colors,
  value,
  onChange,
}: {
  colors: Colors;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        padding: "10px 16px",
        background: `${colors.bg}e0`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${colors.primary}08`,
      }}
    >
      <motion.div
        animate={{
          borderColor: focused ? `${colors.accent}60` : `${colors.primary}18`,
          boxShadow: focused
            ? `0 0 0 3px ${colors.accent}18, 0 4px 20px rgba(0,0,0,0.25)`
            : "0 2px 8px rgba(0,0,0,0.12)",
        }}
        transition={{ duration: 0.22 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderRadius: 16,
          background: "rgba(255,255,255,0.05)",
          border: `1.5px solid ${colors.primary}18`,
          cursor: "text",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <motion.div
          animate={{ color: focused ? colors.accent : `${colors.primary}40` }}
          transition={{ duration: 0.18 }}
        >
          <Search size={16} />
        </motion.div>

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Rechercher un plat…"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 13,
            color: colors.primary,
            fontFamily: "sans-serif",
            caretColor: colors.accent,
          }}
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={() => onChange("")}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: `${colors.primary}20`,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
              }}
            >
              <X size={11} color={`${colors.primary}70`} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Badge nombre de résultats */}
      <AnimatePresence>
        {value && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            style={{
              fontSize: 10,
              color: `${colors.primary}45`,
              fontFamily: "sans-serif",
              textAlign: "center",
              letterSpacing: "0.05em",
              overflow: "hidden",
            }}
          >
            Résultats pour « {value} »
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SocialCard — colorée et fun
// ─────────────────────────────────────────────────────────────

function SocialCard({
  social,
  index,
}: {
  social: { key: string; label: string; Icon: React.ComponentType<{ size?: number; color?: string }>; gradient: string; emoji: string; href: string };
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.34, 1.4, 0.64, 1] }}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: "18px 12px 14px",
        borderRadius: 20,
        background: hovered
          ? social.gradient
          : "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        textDecoration: "none",
        overflow: "hidden",
        transition: "background 0.28s ease",
        cursor: "pointer",
      }}
    >
      {/* Fond gradient doux en permanence */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: social.gradient,
          opacity: hovered ? 1 : 0.12,
          transition: "opacity 0.28s ease",
          borderRadius: 20,
        }}
      />

      {/* Icône */}
      <motion.div
        animate={hovered ? { rotate: [0, -8, 8, 0], scale: 1.15 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "relative",
          zIndex: 1,
          width: 48,
          height: 48,
          borderRadius: 14,
          background: "rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
          transition: "box-shadow 0.25s ease",
        }}
      >
        <social.Icon size={22} color="#fff" />
      </motion.div>

      {/* Label */}
      <p
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: 11,
          fontWeight: 700,
          color: hovered ? "#fff" : "rgba(255,255,255,0.6)",
          fontFamily: "sans-serif",
          letterSpacing: "0.04em",
          margin: 0,
          transition: "color 0.25s ease",
        }}
      >
        {social.label}
      </p>

      {/* Emoji flottant au hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              fontSize: 16,
              zIndex: 2,
            }}
          >
            {social.emoji}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

// ─────────────────────────────────────────────────────────────
// MenuPage — composant principal
// ─────────────────────────────────────────────────────────────

type MenuPageProps = { slug: string };

export default function MenuPage({ slug }: MenuPageProps) {
  const [restaurant, setRestaurant]     = useState<Restaurant | null>(null);
  const [categories, setCategories]     = useState<Category[]>([]);
  const [items, setItems]               = useState<MenuItem[]>([]);
  const [activeCategory, setActive]     = useState<string>("all");
  const [loading, setLoading]           = useState<boolean>(true);
  const [error, setError]               = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery]   = useState<string>("");

  const openModal  = useCallback((item: MenuItem) => setSelectedItem(item), []);
  const closeModal = useCallback(() => setSelectedItem(null), []);

  // ── Data fetching ────────────────────────────────────────────
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

  // ── Couleurs ─────────────────────────────────────────────────
  const colors: Colors = {
    bg:      restaurant?.color_bg      ?? "#0a2e20",
    primary: restaurant?.color_primary ?? "#F5E6C8",
    accent:  restaurant?.color_accent  ?? "#1a5c3a",
    card:    restaurant?.color_card    ?? "#0d3d28",
  };

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: colors.bg }}>
        <style>{GLOBAL_STYLES}</style>
        <StyledBackground colors={colors} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${colors.primary}30`, borderTopColor: colors.primary, animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: 11, letterSpacing: 4, color: `${colors.primary}55`, fontFamily: "sans-serif" }}>CHARGEMENT…</p>
        </div>
      </div>
    );
  }

  if (error !== null || restaurant === null) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: colors.bg }}>
        <style>{GLOBAL_STYLES}</style>
        <StyledBackground colors={colors} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 32px" }}>
          <UtensilsCrossed size={40} style={{ color: `${colors.primary}40`, margin: "0 auto 16px" }} />
          <p style={{ color: colors.primary, fontFamily: "sans-serif" }}>Restaurant introuvable.</p>
        </div>
      </div>
    );
  }

  // ── Filtrage + recherche ─────────────────────────────────────
  const itemsByCategory = categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat.id] = items.filter(i => i.category_id === cat.id);
    return acc;
  }, {});

  const activeCats = categories.filter(c => (itemsByCategory[c.id] ?? []).length > 0);

  // Filtre par recherche
  const searchNorm = searchQuery.trim().toLowerCase();

  let filteredCats = activeCategory === "all"
    ? activeCats
    : activeCats.filter(c => c.id === activeCategory);

  // Si recherche active, override la catégorie active et filtre les items
  const filteredItemsByCategory: Record<string, MenuItem[]> = {};
  for (const cat of filteredCats) {
    const base = itemsByCategory[cat.id] ?? [];
    filteredItemsByCategory[cat.id] = searchNorm
      ? base.filter(
          item =>
            item.name.toLowerCase().includes(searchNorm) ||
            item.description?.toLowerCase().includes(searchNorm) ||
            item.ingredients?.some((ing: { name: string }) => ing.name.toLowerCase().includes(searchNorm))
        )
      : base;
  }

  // Cacher catégories vides après recherche
  const displayCats = filteredCats.filter(c => (filteredItemsByCategory[c.id] ?? []).length > 0);

  // Socials
  const socials = [
    ...SOCIAL_CONFIG
      .filter(s => s.key !== "phone" && Boolean(restaurant[s.key as keyof Restaurant]))
      .map(s => ({
        ...s,
        href: restaurant[s.key as keyof Restaurant] as string,
      })),
    ...(restaurant.phone
      ? [{
          key: "phone" as const,
          label: "Appeler",
          Icon: Phone,
          gradient: "linear-gradient(135deg, #555, #333)",
          emoji: "📞",
          href: `tel:${restaurant.phone}`,
        }]
      : []),
  ];

  let globalIdx = 0;

  // ── Rendu ────────────────────────────────────────────────────
  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <StyledBackground colors={colors} />

      <ItemModal item={selectedItem} colors={colors} onClose={closeModal} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", width: "100%", overflow: "visible" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>

          {/* ── HERO HEADER ── */}
          <HeroHeader restaurant={restaurant} colors={colors} />

          {/* ── NAV CATÉGORIES ── */}
          <CategoryNav
            colors={colors}
            activeCats={activeCats}
            activeCategory={activeCategory}
            setActive={(id) => {
              setActive(id);
              setSearchQuery(""); // reset recherche au changement de catégorie
            }}
          />

          {/* ── BARRE DE RECHERCHE (sticky sous la nav) ── */}
          <SearchBar
            colors={colors}
            value={searchQuery}
            onChange={setSearchQuery}
          />

          {/* ── MENU ── */}
          <main style={{ paddingBottom: 32, paddingTop: 8, overflow: "visible" }}>
            <AnimatePresence mode="wait">
              {displayCats.length === 0 && searchNorm ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: "center", padding: "60px 24px" }}
                >
                  <p style={{ fontSize: 36, marginBottom: 12 }}>🍽️</p>
                  <p style={{ color: `${colors.primary}50`, fontFamily: "sans-serif", fontSize: 13 }}>
                    Aucun plat trouvé pour « {searchQuery} »
                  </p>
                </motion.div>
              ) : (
                displayCats.map(cat => {
                  const catItems = filteredItemsByCategory[cat.id] ?? [];
                  const startIdx = globalIdx;
                  globalIdx += catItems.length;
                  return (
                    <CategorySection
                      key={cat.id + searchQuery}
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

          {/* ── RÉSEAUX SOCIAUX ── */}
          {socials.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              style={{
                margin: "0 16px 24px",
                padding: "28px 20px",
                background: "rgba(0,0,0,0.22)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderRadius: 24,
                border: `1px solid ${colors.primary}10`,
              }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textAlign: "center",
                  color: `${colors.primary}40`,
                  textTransform: "uppercase",
                  fontFamily: "sans-serif",
                  marginBottom: 20,
                }}
              >
                Retrouvez-nous
              </motion.p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: 10,
                }}
              >
                {socials.map((social, i) => (
                  <SocialCard key={social.key} social={social} index={i} />
                ))}
              </div>
            </motion.section>
          )}

          {/* ── FOOTER ── */}
          <footer style={{ textAlign: "center", padding: "24px 16px", borderTop: `1px solid ${colors.primary}08` }}>
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