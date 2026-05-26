// MenuPage.tsx — v5 (i18n complet)
// Résout toutes les traductions ici et les passe en props aux enfants.

import { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { UtensilsCrossed } from "lucide-react";

import CategorySection  from "./CategorySection";
import ItemModal        from "./ItemModal";
import StyledBackground from "./StyledBackground";
import { GLOBAL_STYLES } from "../styles/global";
import DynamicHero      from "./DynamicHero";
import FunSocials       from "./FunSocials";
import StickyBar        from "./StickyBar";
import { useRestaurantConfig } from "../hooks/useRestaurantConfig";
import { useLanguage }         from "../hooks/useLanguage";
import type { Restaurant, Category, MenuItem, Colors } from "./types";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

type MenuPageProps = { slug: string };

export default function MenuPage({ slug }: MenuPageProps) {
  const config = useRestaurantConfig(slug);

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

  // ── i18n ────────────────────────────────────────────────────
  const {
    lang, setLang, t, tField,
    tHeroLines, tBadge, tSocialsLabel,
    availableLangs, isRTL,
  } = useLanguage(restaurant, config);

  // ── Chargement Supabase ──────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const { data: resto, error: e1 } = await supabase
          .from("restaurants").select("*").eq("slug", slug).single<Restaurant>();
        if (e1) throw e1;

        const { data: cats, error: e2 } = await supabase
          .from("categories").select("*").eq("restaurant_id", resto.id).order("sort_order").returns<Category[]>();
        if (e2) throw e2;

        const { data: menuItems, error: e3 } = await supabase
          .from("menu_items").select("*").eq("restaurant_id", resto.id).eq("is_available", true).order("sort_order").returns<MenuItem[]>();
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

  // ── Traductions hero (résolues ici, passées en props) ────────
  const heroI18n = useMemo(() => ({
    lang,
    titleLines: tHeroLines(config),
    badgeText:  tBadge(config.header.footer),
    tagline:    tField(restaurant?.tagline_translations, restaurant?.tagline ?? ""),
    address:    tField(restaurant?.address_translations,  restaurant?.address  ?? ""),
  }), [lang, config, restaurant, tHeroLines, tBadge, tField]);

  // ── Label socials traduit ────────────────────────────────────
  const socialsLabel = useMemo(
    () => tSocialsLabel(config),
    [config, tSocialsLabel],
  );

  // ── Catégories traduites ─────────────────────────────────────
  const translatedCategories = useMemo<Category[]>(() =>
    categories.map(cat => ({
      ...cat,
      name: tField(cat.name_translations, cat.name),
    })),
  [categories, tField]);

  // ── Items traduits ───────────────────────────────────────────
  const translatedItems = useMemo<MenuItem[]>(() =>
    items.map(item => ({
      ...item,
      name:        tField(item.name_translations,        item.name),
      description: tField(item.description_translations, item.description ?? ""),
    })),
  [items, tField]);

  // ── Filtrage ─────────────────────────────────────────────────
  const itemsByCategory = useMemo(() =>
    translatedCategories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = translatedItems.filter(i => i.category_id === cat.id);
      return acc;
    }, {}),
  [translatedCategories, translatedItems]);

  const activeCats = useMemo(() =>
    translatedCategories.filter(c => (itemsByCategory[c.id] ?? []).length > 0),
  [translatedCategories, itemsByCategory]);

  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) return translatedItems;
    const q = searchQuery.toLowerCase().trim();
    return translatedItems.filter(item =>
      item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
    );
  }, [translatedItems, searchQuery]);

  const filteredByCategory = useMemo(() =>
    translatedCategories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = searchedItems.filter(i => i.category_id === cat.id);
      return acc;
    }, {}),
  [translatedCategories, searchedItems]);

  const filteredCats = useMemo(() => {
    const cats = activeCats.filter(c => (filteredByCategory[c.id] ?? []).length > 0);
    if (searchQuery.trim()) return cats;
    return activeCategory === "all" ? cats : cats.filter(c => c.id === activeCategory);
  }, [activeCats, filteredByCategory, searchQuery, activeCategory]);

  const totalResults = useMemo(() =>
    filteredCats.reduce((n, c) => n + (filteredByCategory[c.id] ?? []).length, 0),
  [filteredCats, filteredByCategory]);

  const searchResultsLabel = useCallback((count: number) => {
    const word = count !== 1 ? t("search_results_plural") : t("search_results");
    return `${count} ${word}`;
  }, [t]);

  // ── Écran chargement ─────────────────────────────────────────
  if (loading) return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: colors.bg }}>
      <style>{GLOBAL_STYLES}</style>
      <StyledBackground colors={colors} config={config} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${colors.primary}30`, borderTopColor: colors.primary, animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: 11, letterSpacing: 4, color: `${colors.primary}55`, fontFamily: "sans-serif" }}>{t("loading")}</p>
      </div>
    </div>
  );

  // ── Écran erreur ─────────────────────────────────────────────
  if (error || !restaurant) return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: colors.bg }}>
      <style>{GLOBAL_STYLES}</style>
      <StyledBackground colors={colors} config={config} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <UtensilsCrossed size={40} style={{ color: `${colors.primary}40`, margin: "0 auto 16px" }} />
        <p style={{ color: colors.primary, fontFamily: "sans-serif" }}>{t("restaurant_not_found")}</p>
      </div>
    </div>
  );

  let globalIdx = 0;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <style>{GLOBAL_STYLES}</style>
      <StyledBackground colors={colors} config={config} />

      <ItemModal item={selectedItem} colors={colors} config={config.modal} onClose={closeModal} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", width: "100%", overflow: "visible" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>

          {/* Hero — reçoit les textes déjà traduits */}
          <DynamicHero
            restaurant={restaurant}
            config={config}
            i18n={heroI18n}
          />

          {/* StickyBar : SearchBar + LanguagePicker + CategoryNav */}
          <StickyBar
            colors={colors}
            activeCats={activeCats}
            activeCategory={activeCategory}
            setActive={setActive}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalResults={totalResults}
            lang={lang}
            availableLangs={availableLangs}
            setLang={setLang}
            searchPlaceholder={t("search_placeholder")}
            searchResultsLabel={searchResultsLabel}
            allCategoriesLabel={t("all_categories")}
          />

          <main style={{ paddingBottom: 32, paddingTop: 8, overflow: "visible" }}>
            <AnimatePresence>
              {filteredCats.length === 0 ? (
                <motion.div key="no-result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: "center", padding: "48px 24px", color: `${colors.primary}50`, fontFamily: "sans-serif" }}>
                  <p style={{ fontSize: 36, marginBottom: 12 }}>🔍</p>
                  <p style={{ fontSize: 14 }}>{t("search_empty")} « {searchQuery} »</p>
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
                      config={config.card}
                      globalIndex={startIdx}
                      onOpen={openModal}
                    />
                  );
                })
              )}
            </AnimatePresence>
          </main>

          {/* FunSocials reçoit le label déjà traduit */}
          <FunSocials
            restaurant={restaurant}
            colors={colors}
            config={config}
            overrideSocialsLabel={socialsLabel}
          />

          <footer style={{ textAlign: "center", padding: "24px 16px 40px", borderTop: `1px solid ${colors.primary}08` }}>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", color: `${colors.primary}22`, fontFamily: "sans-serif", textTransform: "uppercase" }}>
              {restaurant.name} · {t("digital_menu")}
            </p>
            <p style={{ fontSize: 9, marginTop: 4, color: `${colors.primary}14`, fontFamily: "sans-serif" }}>
              {t("powered_by")}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}