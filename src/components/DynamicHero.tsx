// DynamicHero.tsx — i18n prop added, translated values threaded through

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import type {
  Restaurant,
  RestaurantConfig,
  HeroBackground,
  HeroLogo,
  HeroTitle,
  HeroSubtitle,
  HeroDivider,
  HeroTagline,
  HeroFooterBand,
  SupportedLang,
} from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroI18n {
  lang:       SupportedLang;
  titleLines: string[];   // stacked lines already translated
  badgeText:  string;     // footer badge already translated
  tagline:    string;     // tagline already translated
  address:    string;     // address already translated
}

type Props = {
  restaurant: Restaurant;
  config:     RestaurantConfig;
  i18n:       HeroI18n;
};

// ─── Helpers fond ─────────────────────────────────────────────────────────────

function buildBackground(bg: HeroBackground): React.CSSProperties {
  if (bg.type === "gradient" && bg.gradient) {
    const stops = bg.gradient.stops.map((s) => `${s.color} ${s.pos}%`).join(", ");
    return { background: `linear-gradient(${bg.gradient.angle ?? 160}deg, ${stops})` };
  }
  if (bg.type === "image" && bg.imageUrl) {
    return {
      backgroundImage: `url(${bg.imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { background: bg.color ?? "#fff" };
}

function ShapeLayer({ bg }: { bg: HeroBackground }) {
  if (!bg.shape || bg.shape === "none" || !bg.shapeColor) return null;
  const cov = bg.shapeCoverage ?? 70;
  if (bg.shape === "arc") return (
    <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: `${cov}%`, background: bg.shapeColor, borderRadius: "0 0 50% 50% / 0 0 80px 80px", zIndex: 0 }} />
  );
  if (bg.shape === "diagonal") return (
    <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, width: `${cov}%`, height: "3px", background: bg.shapeColor, zIndex: 0 }} />
  );
  if (bg.shape === "wave") return (
    <svg aria-hidden viewBox="0 0 1440 160" preserveAspectRatio="none"
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", height: 80, zIndex: 0 }}>
      <path d="M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z" fill={bg.shapeColor} />
    </svg>
  );
  if (bg.shape === "full") return (
    <div aria-hidden style={{ position: "absolute", inset: 0, background: bg.shapeColor, zIndex: 0 }} />
  );
  return null;
}

function PatternLayer({ bg, clip }: { bg: HeroBackground; clip?: boolean }) {
  if (!bg.pattern || bg.pattern === "none") return null;
  const color   = bg.patternColor  ?? "#000";
  const opacity = bg.patternOpacity ?? 0.06;
  const style: React.CSSProperties = {
    position: "absolute", top: 0, left: 0, right: 0,
    width: "100%", height: clip ? `${bg.shapeCoverage ?? 70}%` : "100%",
    opacity, zIndex: 1, pointerEvents: "none",
  };
  if (bg.pattern === "dots") return (
    <svg aria-hidden style={style}>
      <defs><pattern id="hero-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="2" fill={color} /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#hero-dots)" />
    </svg>
  );
  if (bg.pattern === "lines") return (
    <svg aria-hidden style={{ ...style, height: "100%" }}>
      <defs><pattern id="hero-lines" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="32" y2="32" stroke={color} strokeWidth="0.5" /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#hero-lines)" />
    </svg>
  );
  if (bg.pattern === "diamonds") return (
    <svg aria-hidden style={{ ...style, height: "100%" }}>
      <defs><pattern id="hero-diamonds" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><polygon points="16,4 28,16 16,28 4,16" fill="none" stroke={color} strokeWidth="0.8" /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#hero-diamonds)" />
    </svg>
  );
  return null;
}

// ─── Blocs de contenu ─────────────────────────────────────────────────────────

function LogoBlock({ z, restaurant }: { z: HeroLogo; restaurant: Restaurant }) {
  if (!z.show) return null;
  const size = z.size ?? 90;
  const src  = z.src ?? restaurant.logo_url;
  const shapeStyle: React.CSSProperties =
    z.shape === "circle" ? { borderRadius: "50%" } :
    z.shape === "square" ? { borderRadius: 12 } : {};
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {z.pulse && (
        <div style={{ position: "absolute", inset: -8, borderRadius: z.shape === "circle" ? "50%" : 16, border: `2px solid ${z.pulseColor ?? "#fff"}50`, animation: "pulse-ring 2.4s ease-out infinite" }} />
      )}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
        style={{ width: size, height: size, border: `2px solid ${z.borderColor ?? "transparent"}`, background: z.background ?? "transparent", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", ...shapeStyle }}
      >
        {src
          ? <img src={src} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: size * 0.44 }}>{z.fallbackEmoji ?? "🍽️"}</span>
        }
      </motion.div>
    </div>
  );
}

// i18n: receives pre-translated stackedLines via i18n prop
function TitleBlock({
  z, restaurant, i18n,
}: {
  z: HeroTitle; restaurant: Restaurant; i18n: HeroI18n;
}) {
  if (!z.show) return null;
  const style: React.CSSProperties = {
    fontSize:      z.fontSize      ?? "clamp(40px,12vw,80px)",
    fontFamily:    z.fontFamily    ?? restaurant.font_display ?? "serif",
    fontWeight:    z.fontWeight    ?? 900,
    color:         z.color         ?? "#fff",
    letterSpacing: z.letterSpacing ?? "-0.03em",
    lineHeight:    z.lineHeight    ?? 1,
    textShadow:    z.textShadow    ?? "none",
    textTransform: z.uppercase ? "uppercase" : "none",
    textAlign:     (z.align ?? "center") as React.CSSProperties["textAlign"],
    margin: 0,
  };

  // "stacked" uses translated lines from i18n; fallback to z.stackedLines
  const lines = z.mode === "stacked"
    ? (i18n.titleLines.length > 0 ? i18n.titleLines : (z.stackedLines ?? []))
    : null;

  const content =
    z.mode === "big-editorial" ? <><span>ME</span><br /><span>NU</span></> :
    z.mode === "custom"        ? <>{z.customText}</> :
    z.mode === "stacked"       ? <>{lines!.map((l, i) => <span key={i}>{l}<br /></span>)}</> :
    <>{restaurant.name}</>;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {content}
    </motion.div>
  );
}

// i18n: subtitle uses restaurant.name which is already translated upstream in MenuPage
function SubtitleBlock({ z, restaurant }: { z: HeroSubtitle; restaurant: Restaurant }) {
  if (!z.show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.45 }}
      style={{
        fontSize:      z.fontSize      ?? "clamp(14px,4vw,20px)",
        fontFamily:    z.fontFamily    ?? restaurant.font_display ?? "serif",
        color:         z.color         ?? "rgba(255,255,255,0.9)",
        letterSpacing: z.letterSpacing ?? "0.15em",
        fontStyle:     z.fontStyle     ?? "normal",
        marginTop: 8,
      }}
    >
      {/* z.text is a static override; otherwise fall back to the
          (already-translated) restaurant.name passed from MenuPage */}
      {z.text ?? restaurant.name}
    </motion.div>
  );
}

function DividerBlock({ z }: { z: HeroDivider }) {
  if (!z.show) return null;
  if (z.style === "ornament") return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
      style={{ margin: "12px 0", color: z.color ?? "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.3em" }}>
      {z.ornamentChar ?? "◆"}
    </motion.div>
  );
  if (z.style === "dots") return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
      style={{ margin: "12px 0", display: "flex", gap: 6 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: z.color ?? "rgba(255,255,255,0.4)" }} />
      ))}
    </motion.div>
  );
  return (
    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
      style={{ width: z.width ?? 48, height: z.thickness ?? 2, background: z.color ?? "rgba(255,255,255,0.4)", margin: "12px 0", borderRadius: 2 }} />
  );
}

// i18n: uses pre-translated tagline from i18n prop; z.text is still a static override
function TaglineBlock({
  z, i18n,
}: {
  z: HeroTagline; i18n: HeroI18n;
}) {
  if (!z.show) return null;
  const text = z.text ?? i18n.tagline;
  if (!text) return null;
  return (
    <motion.p
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
      style={{
        fontSize:      z.fontSize      ?? "11px",
        letterSpacing: z.letterSpacing ?? "0.12em",
        color:         z.color         ?? "rgba(255,255,255,0.6)",
        fontFamily:    z.fontFamily    ?? "sans-serif",
        fontStyle:     z.fontStyle     ?? "normal",
        margin: 0,
      }}
    >
      {text}
    </motion.p>
  );
}

// i18n: uses pre-translated address + badgeText from i18n prop
function FooterBand({
  z, i18n,
}: {
  z: HeroFooterBand; i18n: HeroI18n;
}) {
  if (!z.show) return null;
  const address   = i18n.address   || undefined;
  const badgeText = i18n.badgeText || z.badgeText || undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background:    z.background ?? "transparent",
        paddingTop:    z.paddingY   ?? 12,
        paddingBottom: z.paddingY   ?? 12,
        paddingLeft: 24, paddingRight: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 8, zIndex: 3,
      }}
    >
      {z.showAddress && address && (
        <p style={{ fontSize: 11, color: z.addressColor ?? "rgba(255,255,255,0.7)", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
          {z.addressIcon && <MapPin size={10} />}
          {address}
        </p>
      )}
      {z.showBadge && badgeText && (
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "4px 10px", borderRadius: 20, background: z.badgeBackground ?? "#fff", color: z.badgeColor ?? "#000", whiteSpace: "nowrap" }}>
          {badgeText}
        </span>
      )}
    </motion.div>
  );
}

// ─── Layout BANNER ────────────────────────────────────────────────────────────

function BannerLayout({
  h, restaurant, i18n,
}: {
  h: RestaurantConfig["header"]; restaurant: Restaurant; i18n: HeroI18n;
}) {
  const px = h.paddingX ?? "32px";
  return (
    <div style={{
      position: "relative", zIndex: 2, flex: 1,
      display: "grid", gridTemplateColumns: "1fr auto",
      alignItems: "center", gap: 24,
      padding: `0 ${px}`,
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
        <TitleBlock    z={h.title}    restaurant={restaurant} i18n={i18n} />
        <SubtitleBlock z={h.subtitle} restaurant={restaurant} />
        <DividerBlock  z={h.divider} />
        <TaglineBlock  z={h.tagline}  i18n={i18n} />
      </div>
      {h.logo.show && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LogoBlock z={h.logo} restaurant={restaurant} />
        </div>
      )}
    </div>
  );
}

// ─── Layout VERTICAL (défaut) ─────────────────────────────────────────────────

function VerticalLayout({
  h, restaurant, i18n,
}: {
  h: RestaurantConfig["header"]; restaurant: Restaurant; i18n: HeroI18n;
}) {
  const isLeft = h.align === "left";
  return (
    <div style={{
      position: "relative", zIndex: 2, flex: 1,
      display: "flex", flexDirection: "column",
      alignItems: isLeft ? "flex-start" : "center",
      justifyContent: "center",
      textAlign: (h.align ?? "center") as React.CSSProperties["textAlign"],
      padding: `clamp(48px,10vw,80px) ${h.paddingX ?? "24px"} 80px`,
      gap: 0,
    }}>
      <LogoBlock     z={h.logo}     restaurant={restaurant} />
      <TitleBlock    z={h.title}    restaurant={restaurant} i18n={i18n} />
      <SubtitleBlock z={h.subtitle} restaurant={restaurant} />
      <DividerBlock  z={h.divider} />
      <TaglineBlock  z={h.tagline}  i18n={i18n} />
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function DynamicHero({ restaurant, config, i18n }: Props) {
  const { header: h } = config;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 180], [1, 0]);
  const y       = useTransform(scrollY, [0, 180], [0, -40]);

  const isBanner = h.layout === "banner";

  const containerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    minHeight: h.minHeight ?? (isBanner ? "260px" : "100svh"),
    display: "flex",
    flexDirection: "column",
    ...buildBackground(h.background),
  };

  return (
    <motion.header
      ref={heroRef}
      style={h.parallax ? { ...containerStyle, opacity, y } : containerStyle}
    >
      <ShapeLayer   bg={h.background} />
      <PatternLayer bg={h.background} clip={!!h.background.shape && h.background.shape !== "none"} />

      {h.background.type === "image" && h.background.imageOverlay && (
        <div aria-hidden style={{ position: "absolute", inset: 0, background: h.background.imageOverlay, zIndex: 1 }} />
      )}

      {isBanner
        ? <BannerLayout  h={h} restaurant={restaurant} i18n={i18n} />
        : <VerticalLayout h={h} restaurant={restaurant} i18n={i18n} />
      }

      <FooterBand z={h.footer} i18n={i18n} />

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.65; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </motion.header>
  );
}