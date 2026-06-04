// components/ItemCard.tsx — v2 (typages stricts)

import { motion, useAnimationControls } from "framer-motion";
import { useEffect }                    from "react";
import { Star, Flame, Sparkles, Leaf }  from "lucide-react";
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
        border:       `3px solid ${colors.accent}`,
        boxShadow:    `0 8px 28px ${colors.accent}20, 0 0 0 5px ${colors.bg}`,
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
}

const ItemCard: FC<ItemCardProps> = ({
  item, colors, index, onOpen,
  labelVoir, labelTailles,
  labelBestseller, labelPopular, labelNew,
  labelVegetarian, labelSpicy,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(item);
    }
  };

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
        width:               148,
        display:             "flex",
        flexDirection:       "column",
        alignItems:          "center",
        paddingTop:          OVERHANG,
        marginTop:           OVERHANG,
        background:          `${colors.accent}10`,
        backdropFilter: "blur(12px)",
        border:              `3px solid ${colors.accent}90`,
        borderRadius:        20,
        overflow:            "visible",
        position:            "relative",
        outline:             "none",
        cursor:              "pointer",
        boxShadow:           `0 4px 16px ${colors.accent}0c`,
      }}
    >
      {/* Image flottante */}
      <FloatingImage src={item.image_url} alt={item.name} colors={colors} delay={index} />

      {/* Numéro */}
      <div style={{
        position:        "absolute",
        top:             -OVERHANG + 4,
        right:           10,
        width:           20,
        height:          20,
        borderRadius:    "50%",
        background:      colors.accent,
        color:           colors.primary,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        fontSize:        8,
        fontWeight:      800,
        zIndex:          3,
      }}>
        {index + 1}
      </div>

      {/* Corps */}
      <div style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            4,
        padding:        `${CIRCLE_SIZE / 2 - OVERHANG + 14}px 14px 16px`,
        width:          "100%",
        textAlign:      "center",
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
            fontSize:          10,
            lineHeight:        1.5,
            color:             `${colors.accent}90`,
            display:           "-webkit-box",
            WebkitLineClamp:   2,
            WebkitBoxOrient:   "vertical",
            overflow:          "hidden",
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
        <div style={{ width: 28, height: 1, background: `${colors.primary}12`, margin: "6px 0" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <p style={{ fontSize: 15, fontWeight: 900, color: colors.primary, letterSpacing: "-0.02em" }}>
            {fmt(item.price, item.currency)}
          </p>
          <motion.span
            whileHover={{ x: 3 }}
            style={{ fontSize: 10, color: `${colors.accent}`, fontFamily: "sans-serif" }}
          >
            {labelVoir}
          </motion.span>
        </div>

        {item.variants && item.variants.length > 0 && (
          <p style={{ fontSize: 9, color: `${colors.primary}35`, fontFamily: "sans-serif" }}>
            {item.variants.length} {labelTailles}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ItemCard;