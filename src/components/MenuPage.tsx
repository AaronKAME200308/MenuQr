/**
 * MenuPage.tsx
 * Page menu restaurant QR code — Responsive tous écrans
 * Cartes cliquables → modal cinématique (expansion in-place + overlay centré)
 */

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  MapPin, Phone, Globe,
  MessageCircle, Music2, Star, Flame, Leaf,
  ChevronRight, Sparkles, UtensilsCrossed, X,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type MenuPageProps = { slug: string };

type Restaurant = {
  id: string; name: string; slug: string;
  tagline?: string; address?: string; phone?: string; logo_url?: string;
  color_bg?: string; color_primary?: string; color_accent?: string; color_card?: string;
  font_display?: string;
  social_facebook?: string; social_instagram?: string; social_whatsapp?: string;
  social_tiktok?: string; social_googlemaps?: string; social_website?: string;
};

type Category = {
  id: string; restaurant_id: string; name: string; icon?: string; sort_order: number;
};

type MenuItemVariant = {
  label: string;   // ex: "Petit", "Grand", "250ml", "500ml"
  price: number;
  currency: string;
};

type MenuItem = {
  id: string; restaurant_id: string; category_id: string;
  name: string; description?: string; price: number; currency: string;
  image_url?: string;
  is_bestseller?: boolean; is_popular?: boolean; is_new?: boolean;
  is_vegetarian?: boolean; is_spicy?: boolean; is_available?: boolean;
  sort_order?: number;
  variants?: MenuItemVariant[];
};

type Colors = { bg: string; primary: string; accent: string; card: string };

type SocialConfig = {
  key: keyof Restaurant | "phone";
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  bg: string;
};

// ─────────────────────────────────────────────────────────────
// Supabase
// ─────────────────────────────────────────────────────────────

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const fmt = (price: number, currency = "EUR"): string =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(price);

const SOCIAL_CONFIG: SocialConfig[] = [
  { key: "social_facebook",   label: "Facebook",     Icon: FaFacebook,    bg: "#1877F2" },
  { key: "social_instagram",  label: "Instagram",    Icon: FaInstagram,   bg: "#E1306C" },
  { key: "social_whatsapp",   label: "WhatsApp",     Icon: MessageCircle, bg: "#25D366" },
  { key: "social_tiktok",     label: "TikTok",       Icon: Music2,        bg: "#010101" },
  { key: "social_googlemaps", label: "Nous trouver", Icon: MapPin,        bg: "#EA4335" },
  { key: "social_website",    label: "Site web",     Icon: Globe,         bg: "#4A4A4A" },
];

// const LIST_CATEGORIES = ["Boissons", "Vins & Spiritueux", "Desserts", "Accompagnements", "Entrées"];

// ─────────────────────────────────────────────────────────────
// Global styles
// ─────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
  @keyframes spin      { to { transform: rotate(360deg) } }
  @keyframes slideUp   { from { transform: translateY(40px) scale(0.97); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }
  @keyframes modalIn   { from { opacity: 0; transform: scale(0.93) } to { opacity: 1; transform: scale(1) } }
  @keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }

  nav::-webkit-scrollbar { display: none }

  .item-card {
    cursor: pointer;
    transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
  }
  .item-card:hover  { transform: translateY(-5px) scale(1.025); box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
  .item-card:active { transform: scale(0.96); }

  .item-row { cursor: pointer; transition: background 0.18s; }
  .item-row:hover { background: rgba(255,255,255,0.04) !important; }
`;

// ─────────────────────────────────────────────────────────────
// Arrière-plan
// ─────────────────────────────────────────────────────────────

function StyledBackground({ colors }: { colors: Colors }) {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0, pointerEvents: "none" }}>
      <div className="absolute inset-0" style={{ background: colors.bg }} />
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bg-kente" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,2 58,30 30,58 2,30" fill="none" stroke={colors.primary} strokeWidth="0.8" opacity="1" />
            <polygon points="30,14 46,30 30,46 14,30" fill="none" stroke={colors.primary} strokeWidth="0.4" opacity="1" />
            <circle cx="30" cy="30" r="3" fill={colors.primary} opacity="0.4" />
          </pattern>
          <pattern id="bg-leaves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10,50 Q25,10 40,50 Q25,90 10,50 Z" fill="none" stroke={colors.primary} strokeWidth="0.6" opacity="1" />
            <line x1="10" y1="50" x2="40" y2="50" stroke={colors.primary} strokeWidth="0.4" opacity="1" />
            <path d="M60,20 Q75,5 85,20 Q75,35 60,20 Z" fill="none" stroke={colors.primary} strokeWidth="0.5" opacity="1" />
            <path d="M65,70 Q80,55 90,70 Q80,85 65,70 Z" fill="none" stroke={colors.primary} strokeWidth="0.5" opacity="1" />
          </pattern>
          <pattern id="bg-wax" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect x="12" y="0" width="6" height="30" fill={colors.primary} opacity="0.15" />
            <rect x="0" y="12" width="30" height="6" fill={colors.primary} opacity="0.15" />
          </pattern>
          <filter id="bg-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
            <feBlend in="SourceGraphic" in2="grey" mode="soft-light" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <rect x="0" y="0" width="100%" height="45%" fill="url(#bg-kente)" opacity="0.06" />
        <rect x="0" y="30%" width="100%" height="45%" fill="url(#bg-wax)" opacity="0.07" />
        <rect x="0" y="55%" width="100%" height="45%" fill="url(#bg-leaves)" opacity="0.07" />
        <rect x="0" y="0" width="100%" height="100%" fill={colors.bg} filter="url(#bg-grain)" opacity="0.07" />
      </svg>
      <div className="absolute" style={{ top: "-15%", left: "-15%", width: "55%", height: "55%", background: `radial-gradient(ellipse, ${colors.accent}60 0%, transparent 65%)`, filter: "blur(70px)" }} />
      <div className="absolute" style={{ bottom: "5%", right: "-10%", width: "50%", height: "45%", background: `radial-gradient(ellipse, ${colors.accent}35 0%, transparent 65%)`, filter: "blur(90px)" }} />
      <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "200px 200px", opacity: 0.035, mixBlendMode: "overlay" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────────────────────

function DishBadge({ item }: { item: MenuItem }) {
  const base = "inline-flex items-center gap-1 rounded-full font-bold";
  const s: React.CSSProperties = { fontSize: 9, padding: "2px 8px" };
  if (item.is_bestseller) return <span className={base} style={{ ...s, background: "linear-gradient(135deg,#c8a84b,#f5d98b)", color: "#3a2800" }}><Star size={8} fill="#3a2800" strokeWidth={0} /> Best Seller</span>;
  if (item.is_popular)    return <span className={base} style={{ ...s, background: "rgba(255,100,50,0.18)", color: "#ff9060" }}><Flame size={8} /> Populaire</span>;
  if (item.is_new)        return <span className={base} style={{ ...s, background: "rgba(80,200,120,0.18)", color: "#50c878" }}><Sparkles size={8} /> Nouveau</span>;
  return null;
}

// ─────────────────────────────────────────────────────────────
// Modal détail cinématique
// ─────────────────────────────────────────────────────────────

function ItemModal({ item, colors, onClose }: { item: MenuItem; colors: Colors; onClose: () => void }) {
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const displayPrice    = selectedVariant !== null && item.variants ? item.variants[selectedVariant].price    : item.price;
  const displayCurrency = selectedVariant !== null && item.variants ? item.variants[selectedVariant].currency : item.currency;

  // Couleur accent derivée pour le prix (évite l'invisible si accent == primary)
  const priceColor = "#f5d98b";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        animation: "overlayIn 0.25s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%", maxWidth: 500,
          maxHeight: "88vh",
          borderRadius: 24,
          overflow: "hidden",
          background: colors.card,
          border: `1px solid ${colors.primary}18`,
          boxShadow: `0 40px 100px rgba(0,0,0,0.65), inset 0 1px 0 ${colors.primary}12`,
          animation: "modalIn 0.32s cubic-bezier(.34,1.4,.64,1)",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* ── Image cinématique plein cadre ── */}
        <div style={{ position: "relative", width: "100%", paddingTop: "60%", flexShrink: 0 }}>
          {item.image_url ? (
            <img
              src={item.image_url} alt={item.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, background: `${colors.bg}90` }}>🍽️</div>
          )}

          {/* Vignette latérale + dégradé bas cinématique */}
          <div style={{
            position: "absolute", inset: 0,
            background: `
              linear-gradient(to top,  ${colors.card} 0%, ${colors.card}dd 22%, transparent 55%),
              linear-gradient(to right, ${colors.card}55 0%, transparent 25%),
              linear-gradient(to left,  ${colors.card}33 0%, transparent 20%)
            `,
          }} />

          {/* Titre + prix superposés */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 22px 14px" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
              <DishBadge item={item} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
              <h2 style={{
                flex: 1, fontSize: "clamp(19px,5vw,25px)", fontWeight: 900,
                lineHeight: 1.15, color: colors.primary,
                letterSpacing: "-0.025em",
                textShadow: "0 2px 16px rgba(0,0,0,0.5)",
              }}>{item.name}</h2>
              <p style={{
                flexShrink: 0,
                fontSize: "clamp(20px,5vw,26px)", fontWeight: 900,
                color: priceColor, letterSpacing: "-0.02em",
                textShadow: `0 0 24px ${priceColor}50`,
                animation: "slideUp 0.35s ease 0.1s both",
              }}>
                {fmt(displayPrice, displayCurrency)}
              </p>
            </div>
          </div>

          {/* Icônes diète */}
          <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6 }}>
            {item.is_vegetarian && <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#50c878dd", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}><Leaf size={13} color="#fff" /></span>}
            {item.is_spicy      && <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#ff4500dd", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}><Flame size={13} color="#fff" /></span>}
          </div>
        </div>

        {/* ── Corps scrollable ── */}
        <div style={{ overflowY: "auto", flex: 1, padding: "4px 22px 28px", scrollbarWidth: "none" }}>

          {/* Description */}
          {item.description && (
            <div style={{ marginTop: 14, animation: "slideUp 0.35s ease 0.12s both" }}>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: `${colors.primary}80`, fontFamily: "sans-serif" }}>
                {item.description}
              </p>
            </div>
          )}

          {/* Variantes */}
          {item.variants && item.variants.length > 0 && (
            <div style={{ marginTop: 20, animation: "slideUp 0.35s ease 0.18s both" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: `${colors.primary}40`, fontFamily: "sans-serif", marginBottom: 10 }}>
                Taille / Variante
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {item.variants.map((v, i) => {
                  const isSelected = selectedVariant === i;
                  return (
                    <button key={i} onClick={() => setSelectedVariant(isSelected ? null : i)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        padding: "10px 18px", borderRadius: 12,
                        border: `1.5px solid ${isSelected ? colors.primary : `${colors.primary}20`}`,
                        background: isSelected ? `${colors.primary}18` : "rgba(255,255,255,0.04)",
                        cursor: "pointer", transition: "all 0.18s", minWidth: 72,
                      }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: colors.primary }}>{v.label}</span>
                      <span style={{ fontSize: 11, marginTop: 2, color: `${colors.primary}65`, fontFamily: "sans-serif" }}>{fmt(v.price, v.currency)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ margin: "20px 0 0", height: 1, background: `linear-gradient(to right, transparent, ${colors.primary}18, transparent)` }} />
        </div>

        {/* ── Fermer ── */}
        <button onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "transform 0.18s, background 0.18s", zIndex: 10,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          <X size={16} color="rgba(255,255,255,0.85)" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Carte grille
// ─────────────────────────────────────────────────────────────

function ItemCard({ item, colors, index, onOpen }: { item: MenuItem; colors: Colors; index: number; onOpen: (item: MenuItem) => void }) {
  return (
    <div
      className="item-card"
      onClick={() => onOpen(item)}
      role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onOpen(item); }}
      style={{
        display: "flex", flexDirection: "column",
        background: `${colors.card}d0`,
        border: `1px solid ${colors.primary}14`,
        borderRadius: 16,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        overflow: "hidden", outline: "none",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", width: "100%", paddingTop: "72%" }}>
        {item.image_url
          ? <img src={item.image_url} alt={item.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, background: `${colors.bg}60` }}>🍽️</div>
        }
        {/* Gradient bas */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: `linear-gradient(to top, ${colors.card}e0, transparent)` }} />

        {/* Numéro */}
        <div style={{ position: "absolute", top: 8, left: 8, width: 22, height: 22, borderRadius: "50%", background: `${colors.accent}cc`, backdropFilter: "blur(4px)", color: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, border: `1px solid ${colors.primary}25` }}>
          {index + 1}
        </div>

        {/* Badge */}
        <div style={{ position: "absolute", bottom: 8, left: 8 }}><DishBadge item={item} /></div>

        {/* Icônes diète */}
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
          {item.is_vegetarian && <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#50c878cc", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}><Leaf size={10} color="#fff" /></span>}
          {item.is_spicy      && <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#ff4500cc", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}><Flame size={10} color="#fff" /></span>}
        </div>

        {/* Indicator variantes */}
        {item.variants && item.variants.length > 0 && (
          <div style={{ position: "absolute", bottom: 8, right: 8, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", color: `${colors.primary}bb`, border: `1px solid ${colors.primary}20` }}>
            {item.variants.length} tailles
          </div>
        )}
      </div>

      {/* Infos */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "10px 12px 12px", flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.25, color: colors.primary, letterSpacing: "-0.01em" }}>{item.name}</p>
        {item.description && (
          <p style={{ fontSize: 10, lineHeight: 1.5, color: `${colors.primary}50`, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
            {item.description}
          </p>
        )}
        <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: colors.primary, letterSpacing: "-0.02em" }}>{fmt(item.price, item.currency)}</p>
          <span style={{ fontSize: 9, fontWeight: 600, color: `${colors.primary}32`, fontFamily: "sans-serif", letterSpacing: "0.05em" }}>voir →</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Ligne liste
// ─────────────────────────────────────────────────────────────

// function ItemRow({ item, colors, index, onOpen }: { item: MenuItem; colors: Colors; index: number; onOpen: (item: MenuItem) => void }) {
//   return (
//     <div
//       className="item-row"
//       onClick={() => onOpen(item)}
//       role="button" tabIndex={0}
//       onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onOpen(item); }}
//       style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${colors.primary}08`, outline: "none", cursor: "pointer" }}
//     >
//       <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: `${colors.accent}cc`, color: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
//         {index + 1}
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
//           <p style={{ fontSize: 13, fontWeight: 700, color: colors.primary }}>{item.name}</p>
//           <DishBadge item={item} />
//           {item.is_vegetarian && <Leaf size={11} color="#50c878" />}
//           {item.is_spicy      && <Flame size={11} color="#ff6030" />}
//         </div>
//         {item.description && <p style={{ fontSize: 10, marginTop: 2, lineHeight: 1.5, color: `${colors.primary}50`, fontFamily: "sans-serif" }}>{item.description}</p>}
//         {item.variants && item.variants.length > 0 && <p style={{ fontSize: 9, marginTop: 3, color: `${colors.primary}35`, fontFamily: "sans-serif" }}>{item.variants.map(v => v.label).join(" · ")}</p>}
//       </div>
//       <div style={{ flexShrink: 0, textAlign: "right" }}>
//         <p style={{ fontSize: 14, fontWeight: 800, color: colors.primary }}>{fmt(item.price, item.currency)}</p>
//         <p style={{ fontSize: 9, color: `${colors.primary}30`, fontFamily: "sans-serif", marginTop: 1 }}>voir →</p>
//       </div>
//     </div>
//   );
// }

// ─────────────────────────────────────────────────────────────
// Section catégorie
// ─────────────────────────────────────────────────────────────

function CategorySection({ category, items, colors, globalIndex, onOpen }: { category: Category; items: MenuItem[]; colors: Colors; globalIndex: number; onOpen: (item: MenuItem) => void }) {
  return (
    <section style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", borderTop: `1px solid ${colors.primary}10` }}>
        {category.icon && <span style={{ fontSize: 18 }}>{category.icon}</span>}
        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: `${colors.primary}45`, fontFamily: "sans-serif" }}>{category.name}</h2>
      </div>
        <div style={{ padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: 14 }}>
            {items.map((item, i) => <ItemCard key={item.id} item={item} colors={colors} index={globalIndex + i} onOpen={onOpen} />)}
          </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────

export default function MenuPage({ slug }: MenuPageProps) {
  const [restaurant, setRestaurant]   = useState<Restaurant | null>(null);
  const [categories, setCategories]   = useState<Category[]>([]);
  const [items, setItems]             = useState<MenuItem[]>([]);
  const [activeCategory, setActive]   = useState<string>("all");
  const [loading, setLoading]         = useState<boolean>(true);
  const [error, setError]             = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const openModal  = useCallback((item: MenuItem) => setSelectedItem(item), []);
  const closeModal = useCallback(() => setSelectedItem(null), []);

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

  if (error !== null || restaurant === null) return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: colors.bg }}>
      <style>{GLOBAL_STYLES}</style>
      <StyledBackground colors={colors} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 32px" }}>
        <UtensilsCrossed size={40} style={{ color: `${colors.primary}40`, margin: "0 auto 16px" }} />
        <p style={{ color: colors.primary, fontFamily: "sans-serif" }}>Restaurant introuvable.</p>
      </div>
    </div>
  );

  const itemsByCategory = categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat.id] = items.filter(i => i.category_id === cat.id);
    return acc;
  }, {});

  const activeCats   = categories.filter(c => (itemsByCategory[c.id] ?? []).length > 0);
  const filteredCats = activeCategory === "all" ? activeCats : activeCats.filter(c => c.id === activeCategory);

  const socials: Array<SocialConfig & { href: string }> = [
    ...SOCIAL_CONFIG
      .filter(s => s.key !== "phone" && Boolean(restaurant[s.key as keyof Restaurant]))
      .map(s => ({ ...s, href: restaurant[s.key as keyof Restaurant] as string })),
    ...(restaurant.phone ? [{ key: "phone" as const, label: "Appeler", Icon: Phone, bg: "#555", href: `tel:${restaurant.phone}` }] : []),
  ];

  let globalIdx = 0;

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <StyledBackground colors={colors} />

      {selectedItem && <ItemModal item={selectedItem} colors={colors} onClose={closeModal} />}

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", width: "100%" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>

          {/* ── HERO ── */}
          <header style={{ padding: "clamp(32px,8vw,64px) 24px clamp(24px,6vw,48px)", textAlign: "center" }}>
            <div style={{ width: 84, height: 84, borderRadius: "50%", border: `2px solid ${colors.primary}30`, background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {restaurant.logo_url ? <img src={restaurant.logo_url} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 38 }}>🍽️</span>}
            </div>
            <p style={{ fontSize: 10, letterSpacing: 4, color: `${colors.primary}45`, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: 6 }}>Restaurant</p>
            <div style={{ fontSize: "clamp(60px, 18vw, 96px)", lineHeight: 0.82, fontWeight: 900, letterSpacing: "-0.03em", color: colors.primary, fontFamily: restaurant.font_display ?? "Georgia, serif", userSelect: "none" }}>ME<br />NU</div>
            <h1 style={{ marginTop: 14, fontSize: "clamp(15px, 4vw, 22px)", letterSpacing: "0.15em", color: colors.primary, fontFamily: restaurant.font_display ?? "Georgia, serif", fontWeight: 400 }}>{restaurant.name}</h1>
            <div style={{ width: 40, height: 1, background: `${colors.primary}30`, margin: "14px auto" }} />
            {restaurant.tagline && <p style={{ fontSize: 11, letterSpacing: "0.1em", color: `${colors.primary}42`, fontFamily: "sans-serif" }}>{restaurant.tagline}</p>}
            {restaurant.address && <p style={{ fontSize: 11, color: `${colors.primary}38`, fontFamily: "sans-serif", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}><MapPin size={11} /> {restaurant.address}</p>}
          </header>

          {/* ── NAV CATÉGORIES ── */}
         <nav
  style={{
    position: "sticky",
    top: 0,
    zIndex: 20,
    padding: "10px 12px",
    overflowX: "auto",
    display: "flex",
    gap: 10,
    scrollbarWidth: "none",
    background: `${colors.bg}cc`,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: `1px solid ${colors.primary}12`,
  }}
>
  {([{ id: "all", name: "Tout" } as Pick<Category, "id" | "name" | "icon">, ...activeCats]).map((cat) => {
    const isActive = activeCategory === cat.id;

    return (
      <button
        key={cat.id}
        onClick={() => setActive(cat.id)}
        style={{
          position: "relative",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: isActive ? 700 : 500,
          background: isActive
            ? `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`
            : "rgba(255,255,255,0.06)",
          color: isActive ? "#fff" : `${colors.primary}80`,
          border: isActive
            ? "none"
            : `1px solid ${colors.primary}18`,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.25s ease",
          boxShadow: isActive
            ? "0 4px 14px rgba(0,0,0,0.2)"
            : "none",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          }
        }}
      >
        {cat.icon && <span style={{ fontSize: 14 }}>{cat.icon}</span>}
        {cat.name}

        {/* petit indicateur actif */}
        {isActive && (
          <span
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 18,
              height: 3,
              borderRadius: 10,
              background: colors.accent,
            }}
          />
        )}
      </button>
    );
  })}
</nav>

          {/* ── MENU ── */}
          <main style={{ paddingBottom: 32, paddingTop: 8 }}>
            {filteredCats.map(cat => {
              const catItems = itemsByCategory[cat.id] ?? [];
              const startIdx = globalIdx;
              globalIdx += catItems.length;
              return <CategorySection key={cat.id} category={cat} items={catItems} colors={colors} globalIndex={startIdx} onOpen={openModal} />;
            })}
          </main>

          {/* ── RÉSEAUX SOCIAUX ── */}
          {socials.length > 0 && (
            <section style={{ margin: "0 16px 24px", padding: "28px 20px", background: "rgba(0,0,0,0.22)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 20, border: `1px solid ${colors.primary}10` }}>
              <p style={{ fontSize: 10, letterSpacing: 3, textAlign: "center", color: `${colors.primary}38`, textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 20 }}>Retrouvez-nous sur</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {socials.map(({ key, label, Icon, bg, href }) => (
                  <a key={key} href={href} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: `1px solid ${colors.primary}12`, textDecoration: "none" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={17} color="#fff" /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: colors.primary }}>{label}</p>
                      {key !== "phone" && <p style={{ fontSize: 10, color: `${colors.primary}38`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{href}</p>}
                    </div>
                    <ChevronRight size={15} style={{ color: `${colors.primary}28`, flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ── FOOTER ── */}
          <footer style={{ textAlign: "center", padding: "24px 16px", borderTop: `1px solid ${colors.primary}08` }}>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", color: `${colors.primary}22`, fontFamily: "sans-serif", textTransform: "uppercase" }}>{restaurant.name} · Menu numérique</p>
            <p style={{ fontSize: 9, marginTop: 4, color: `${colors.primary}14`, fontFamily: "sans-serif" }}>Propulsé par MenuQR</p>
          </footer>

        </div>
      </div>
    </>
  );
}