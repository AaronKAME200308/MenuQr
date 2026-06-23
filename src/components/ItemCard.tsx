// components/ItemCard.tsx — v3 (promotions)

import { motion, useAnimationControls } from "framer-motion";
import { useEffect }                    from "react";
import { Star, Flame, Sparkles, Leaf, Tag }  from "lucide-react";
import type { FC }                      from "react";
import type { MenuItem, Colors }        from "./types";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

export function fmt(price: number, currency = "XAF"): string {
  return new Intl.NumberFormat("fr-FR", {
    style:    "currency",
    currency,
  }).format(price);
}

/** Calcule le prix après promotion */
export function promoPrice(price: number, pct: number): number {
  return Math.round(price * (1 - pct / 100) * 100) / 100;
}

// ─────────────────────────────────────────────────────────────
// DishBadge
// ─────────────────────────────────────────────────────────────

interface DishBadgeProps {
  item:            MenuItem;
  labelBestseller: string;
  labelPopular:    string;
  labelNew:        string;
}

export const DishBadge: FC<DishBadgeProps> = ({ item, labelBestseller, labelPopular, labelNew }) => {
  const base: React.CSSProperties = {
    display:     "inline-flex",
    alignItems:  "center",
    gap:         4,
    borderRadius: 999,
    fontWeight:  700,
    fontSize:    9,
    padding:     "3px 9px",
  };
  if (item.is_bestseller) return (
    <span style={{ ...base, background: "linear-gradient(135deg,#c8a84b,#f5d98b)", color: "#3a2800" }}>
      <Star size={8} fill="#3a2800" strokeWidth={0} /> {labelBestseller}
    </span>
  );
  if (item.is_popular) return (
    <span style={{ ...base, background: "rgba(255,100,50,0.18)", color: "#ff9060" }}>
      <Flame size={8} /> {labelPopular}
    </span>
  );
  if (item.is_new) return (
    <span style={{ ...base, background: "rgba(80,200,120,0.18)", color: "#50c878" }}>
      <Sparkles size={8} /> {labelNew}
    </span>
  );
  return null;
};

// ─────────────────────────────────────────────────────────────
// PromoBadge — coin bas-gauche de la carte
// ─────────────────────────────────────────────────────────────

interface PromoBadgeProps {
  pct:       number;
  freeLabel: string;
}

const PromoBadge: FC<PromoBadgeProps> = ({ pct, freeLabel }) => {
  const isFree = pct >= 100;

  if (isFree) {
    // Badge rond style "sunburst" avec pointes triangulaires
    const spikes = 8;
    const cx = 22, cy = 22, r1 = 18, r2 = 13;
    const points: string[] = [];
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const r = i % 2 === 0 ? r1 : r2;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1,   rotate: 0   }}
        transition={{ delay: 0.18, type: "spring", stiffness: 340, damping: 18 }}
        style={{
          position:      "absolute",
          bottom:        -14,
          left:          -8,
          zIndex:        4,
          pointerEvents: "none",
          width:         44,
          height:        44,
        }}
      >
        <svg width={44} height={44} viewBox="0 0 44 44">
          <defs>
            <radialGradient id="free-grad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff5252" />
              <stop offset="100%" stopColor="#c62828" />
            </radialGradient>
            <filter id="free-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#c6282866" />
            </filter>
          </defs>
          <polygon
            points={points.join(" ")}
            fill="url(#free-grad)"
            filter="url(#free-shadow)"
          />
          <text
            x={cx} y={cy + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="7"
            fontWeight="900"
            fontFamily="sans-serif"
            letterSpacing="-0.3"
          >
            {freeLabel.toUpperCase()}
          </text>
        </svg>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, x: -6 }}
      animate={{ opacity: 1, scale: 1,   x: 0  }}
      transition={{ delay: 0.18, type: "spring", stiffness: 340, damping: 22 }}
      style={{
        position:      "absolute",
        bottom:        -12,
        left:          -4,
        zIndex:        4,
        pointerEvents: "none",
      }}
    >
      <span style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           3,
        background:    "linear-gradient(135deg, #e53935 0%, #ff5252 100%)",
        color:         "#fff",
        fontSize:      9,
        fontWeight:    900,
        padding:       "3px 7px 3px 5px",
        borderRadius:  "0 8px 8px 0",
        boxShadow:     "0 3px 10px rgba(229,57,53,0.40)",
        letterSpacing: "-0.01em",
      }}>
        <Tag size={8} color="#fff" />
        -{pct}%
      </span>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// FloatingImage
// ─────────────────────────────────────────────────────────────

const CIRCLE_SIZE = 112;
const OVERHANG    = 38;

interface FloatingImageProps {
  src?:   string;
  alt:    string;
  colors: Colors;
  delay?: number;
}

const FloatingImage: FC<FloatingImageProps> = ({ src, alt, colors, delay = 0 }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    const timer = setTimeout(() => {
      void controls.start({
        y:       [0, -11, 0],
        rotate:  [-1, 1.2, -1],
        transition: {
          duration:   3.6 + delay * 0.3,
          ease:       "easeInOut",
          repeat:     Infinity,
          repeatType: "loop",
        },
      });
    }, delay * 80 + 200);
    return () => clearTimeout(timer);
  }, [controls, delay]);

  return (
    <motion.div
      animate={controls}
      style={{
        position:     "absolute",
        top:          -OVERHANG,
        left:         "50%",
        x:            "-50%",
        width:        CIRCLE_SIZE,
        height:       CIRCLE_SIZE,
        borderRadius: "50%",
        overflow:     "hidden",
        border:       `3px solid ${colors.main}`,
        boxShadow:    `0 8px 28px ${colors.main}20, 0 0 0 5px ${colors.bg}`,
        zIndex:       2,
        cursor:       "pointer",
      }}
    >
      {src ? (
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, background: `${colors.primary}0a` }}>
          🍽️
        </div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// ItemCard
// ─────────────────────────────────────────────────────────────

interface ItemCardProps {
  item:            MenuItem;
  colors:          Colors;
  /** Index global dans la liste (stagger + numéro affiché) */
  index:           number;
  onOpen:          (item: MenuItem) => void;
  /** Labels traduits par MenuPage */
  labelVoir:       string;
  labelTailles:    string;
  labelBestseller: string;
  labelPopular:    string;
  labelNew:        string;
  labelVegetarian: string;
  labelSpicy:      string;
  labelOffert:     string;
}

const ItemCard: FC<ItemCardProps> = ({
  item, colors, index, onOpen,
  labelVoir, labelTailles,
  labelBestseller, labelPopular, labelNew,
  labelVegetarian, labelSpicy, labelOffert,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(item);
    }
  };

  const hasPromo = item.promotion_active && (item.promotion ?? 0) > 0;
  const discountedPrice = hasPromo
    ? promoPrice(item.price, item.promotion!)
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, scale: 0.92          }}
      transition={{
        delay:    (index % 6) * 0.07,
        duration: 0.45,
        ease:     [0.34, 1.3, 0.64, 1],
      }}
      whileHover={{ y: -7, boxShadow: `0 18px 44px ${colors.primary}1a`, transition: { duration: 0.28, ease: "easeOut" } }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onOpen(item)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        width:          148,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        paddingTop:     OVERHANG,
        marginTop:      OVERHANG,
        background:     `${colors.accent}10`,
        backdropFilter: "blur(12px)",
        border:         hasPromo
          ? "3px solid #e53935"
          : `3px solid ${colors.main}90`,
        borderRadius:   20,
        overflow:       "visible",
        position:       "relative",
        outline:        "none",
        cursor:         "pointer",
        boxShadow:      hasPromo
          ? "0 4px 16px rgba(229,57,53,0.12)"
          : `0 4px 16px ${colors.accent}0c`,
      }}
    >
      {/* Image flottante */}
      <FloatingImage src={item.image_url} alt={item.name} colors={colors} delay={index} />

      {/* Numéro */}
      <div style={{
        position:       "absolute",
        top:            -OVERHANG + 4,
        right:          10,
        width:          20,
        height:         20,
        borderRadius:   "50%",
        background:     colors.accent,
        color:          colors.primary,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontSize:       8,
        fontWeight:     800,
        zIndex:         3,
      }}>
        {index + 1}
      </div>

      {/* Badge promo bas-gauche */}
      {hasPromo && <PromoBadge pct={item.promotion!} freeLabel={labelOffert} />}

      {/* Corps */}
      <div style={{
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        gap:           4,
        padding:       `${CIRCLE_SIZE / 2 - OVERHANG + 14}px 14px ${hasPromo ? 28 : 16}px`,
        width:         "100%",
        textAlign:     "center",
      }}>
        <DishBadge
          item={item}
          labelBestseller={labelBestseller}
          labelPopular={labelPopular}
          labelNew={labelNew}
        />

        <p style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.2, color: colors.primary, letterSpacing: "-0.01em", marginTop: 4 }}>
          {item.name}
        </p>

        {item.description && (
          <p style={{
            fontSize:        10,
            lineHeight:      1.5,
            color:           `${colors.main}90`,
            display:         "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow:        "hidden",
          } as React.CSSProperties}>
            {item.description}
          </p>
        )}

        {/* Icônes régime */}
        <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
          {item.is_vegetarian && (
            <span title={labelVegetarian} style={{ width: 18, height: 18, borderRadius: "50%", background: "#50c878cc", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={10} color="#fff" />
            </span>
          )}
          {item.is_spicy && (
            <span title={labelSpicy} style={{ width: 18, height: 18, borderRadius: "50%", background: "#ff4500cc", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flame size={10} color="#fff" />
            </span>
          )}
        </div>

        {/* Séparateur */}
        <div style={{ width: 28, height: 1, background: `${colors.main}12`, margin: "6px 0" }} />

        {/* Prix */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
            {hasPromo ? (
              <>
                {/* Prix original barré */}
                <span style={{
                  fontSize:       10,
                  fontWeight:     600,
                  color:          `${colors.main}`,
                  textDecoration: "line-through",
                  letterSpacing:  "-0.01em",
                }}>
                  {fmt(item.price, item.currency)}
                </span>
                {/* Prix promoé */}
                <motion.span
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  style={{
                    fontSize:     15,
                    fontWeight:   900,
                    color:        "#e53935",
                    letterSpacing: "-0.02em",
                    lineHeight:   1,
                  }}
                >
                  {fmt(discountedPrice!, item.currency)}
                </motion.span>
              </>
            ) : (
              <p style={{ fontSize: 15, fontWeight: 900, color: colors.main, letterSpacing: "-0.02em" }}>
                {fmt(item.price, item.currency)}
              </p>
            )}
          </div>
          <motion.span
            whileHover={{ x: 3 }}
            style={{ fontSize: 10, color: `${colors.main}`, fontFamily: "sans-serif" }}
          >
            {labelVoir}
          </motion.span>
        </div>

        {item.variants && item.variants.length > 0 && (
          <p style={{ fontSize: 9, color: `${colors.main}`, fontFamily: "sans-serif" }}>
            {item.variants.length} {labelTailles}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ItemCard;