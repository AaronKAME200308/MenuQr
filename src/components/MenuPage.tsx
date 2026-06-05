// MenuPage.tsx — v6 (i18n complet, typages corrects)
// Résout TOUTES les traductions ici et les distribue aux enfants via props.
// Aucun enfant ne connaît la langue — ils reçoivent des strings prêts.

import { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion }                   from "framer-motion";
import { createClient }                              from "@supabase/supabase-js";
import { UtensilsCrossed }                           from "lucide-react";

import CategorySection         from "./CategorySection";
import ItemModal               from "./ItemModal";
import StyledBackground        from "./StyledBackground";
import { GLOBAL_STYLES }       from "../styles/global";
import DynamicHero             from "./DynamicHero";
import type { DynamicHeroI18n } from "./DynamicHero";
import FunSocials              from "./FunSocials";
import StickyBar               from "./StickyBar";
import { useRestaurantConfig } from "../hooks/useRestaurantConfig";
import { useLanguage }         from "../hooks/useLanguage";
import type {
  Restaurant,
  Category,
  MenuItem,
  Colors,
  TextConfig,
} from "./types";

// ─────────────────────────────────────────────────────────────
// Supabase client (singleton module-level)
// ─────────────────────────────────────────────────────────────

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL  as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface MenuPageProps {
  slug: string;
}

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

export default function MenuPage({ slug }: MenuPageProps) {
  // ── Config resto (merge default + override) ──────────────────
  const config = useRestaurantConfig(slug);

  // ── État local ───────────────────────────────────────────────
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

  // ── i18n — initialisé avec restaurant null (avant fetch) ─────
  // useLanguage lit restaurant.supported_languages / default_language
  // dès que restaurant est chargé, via la dépendance réactive.
  const {
    lang,
    setLang,
    t,
    tField,
    tHeroLines,
    tBadge,
    tSocialsLabel,
    availableLangs,
    isRTL,
  } = useLanguage(restaurant, config);

  // ── Chargement Supabase ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      try {
        const { data: resto, error: e1 } = await supabase
          .from("restaurants")
          .select("*")
          .eq("slug", slug)
          .single<Restaurant>();
        if (e1) throw e1;

        const { data: cats, error: e2 } = await supabase
          .from("categories")
          .select("*")
          .eq("restaurant_id", resto.id)
          .order("sort_order")
          .returns<Category[]>();
        if (e2) throw e2;

        const { data: menuItems, error: e3 } = await supabase
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", resto.id)
          .eq("is_available", true)
          .order("sort_order")
          .returns<MenuItem[]>();
        if (e3) throw e3;

        if (!cancelled) {
          setRestaurant(resto);
          setCategories(cats   ?? []);
          setItems(menuItems   ?? []);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur inconnue");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [slug]);

  // ── Couleurs ─────────────────────────────────────────────────
  const colors: Colors = useMemo<Colors>(() => ({
    bg:      restaurant?.color_bg      ?? "#ffffff",
    primary: restaurant?.color_primary ?? "#1a5c3a",
    accent:  restaurant?.color_accent  ?? "#F5C518",
    card:    restaurant?.color_card    ?? "#ffffff",
    main:    restaurant?.color_main    ?? "#F5E6C8",
  }), [restaurant]);

  // ── Prop i18n du DynamicHero ──────────────────────────────────
  // Tous les textes sont résolus ici — DynamicHero ne voit que des strings.
  const heroI18n = useMemo<DynamicHeroI18n>(() => ({
    lang,
    titleLines:     tHeroLines(config),
    badgeText:      tBadge(config.header.footer),
    tagline:        tField(restaurant?.tagline_translations, restaurant?.tagline ?? ""),
    address:        tField(restaurant?.address_translations, restaurant?.address  ?? ""),
    restaurantName: tField(restaurant?.name_translations,   restaurant?.name     ?? ""),
  }), [lang, config, restaurant, tHeroLines, tBadge, tField]);

  // ── Label socials traduit ─────────────────────────────────────
  const socialsLabel = useMemo<string>(
    () => tSocialsLabel(config),
    [config, tSocialsLabel],
  );

  // ── Nom traduit pour le footer ────────────────────────────────
  const restaurantDisplayName = useMemo<string>(
    () => tField(restaurant?.name_translations, restaurant?.name ?? ""),
    [restaurant, tField],
  );

  // ── Labels traduits pour le modal ───────────────────────────────
  const modalText = useMemo<TextConfig>(() => ({
    prix:        t("label_prix"),
    variants:    t("label_variants"),
    ingredients: t("label_ingredients"),
    description: t("label_description"),
    disponible:  t("label_disponible"),
    vegetarian:  t("label_vegetarian"),
    spicy:       t("label_spicy"),
  }), [t]);

  // ── Labels traduits pour les cartes ──────────────────────────
  const labelVoir        = useMemo(() => t("label_voir"),        [t]);
  const labelTailles     = useMemo(() => t("label_tailles"),     [t]);
  const labelBestseller  = useMemo(() => t("label_bestseller"),  [t]);
  const labelPopular     = useMemo(() => t("label_popular"),     [t]);
  const labelNew         = useMemo(() => t("label_new"),         [t]);
  const labelVegetarian  = useMemo(() => t("label_vegetarian"),  [t]);
  const labelSpicy       = useMemo(() => t("label_spicy"),       [t]);

  // ── Labels traduits pour FunSocials ──────────────────────────
  const labelPhone       = useMemo(() => t("label_appeler"),     [t]);
  const labelMail        = useMemo(() => t("label_email"),       [t]);

  // ── Catégories avec noms traduits ────────────────────────────
  const translatedCategories = useMemo<Category[]>(() =>
    categories.map((cat): Category => ({
      ...cat,
      name: tField(cat.name_translations, cat.name),
    })),
  [categories, tField]);

  // ── Items avec name + description traduits ────────────────────
// Dans MenuPage.tsx — remplacer le useMemo translatedItems existant par ceci :

const translatedItems = useMemo<MenuItem[]>(() =>
  items.map((item): MenuItem => ({
    ...item,
    name:             tField(item.name_translations,        item.name),
    description:      tField(item.description_translations, item.description ?? "") || undefined,
    // Traduction du nom de la promotion
    promotion_name:   item.promotion_name_translations
      ? tField(item.promotion_name_translations, item.promotion_name ?? "")
      : item.promotion_name,
  })),
[items, tField]);

  // ── Index : items par categorie ───────────────────────────────
  const itemsByCategory = useMemo<Record<string, MenuItem[]>>(() =>
    translatedCategories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = translatedItems.filter(i => i.category_id === cat.id);
      return acc;
    }, {}),
  [translatedCategories, translatedItems]);

  // ── Catégories ayant au moins 1 item disponible ───────────────
  const activeCats = useMemo<Category[]>(() =>
    translatedCategories.filter(c => (itemsByCategory[c.id]?.length ?? 0) > 0),
  [translatedCategories, itemsByCategory]);

  // ── Items filtrés par la recherche ────────────────────────────
  const searchedItems = useMemo<MenuItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return translatedItems;
    return translatedItems.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.description?.toLowerCase().includes(q) ?? false),
    );
  }, [translatedItems, searchQuery]);

  // ── Index : items filtrés par catégorie ──────────────────────
  const filteredByCategory = useMemo<Record<string, MenuItem[]>>(() =>
    translatedCategories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
      acc[cat.id] = searchedItems.filter(i => i.category_id === cat.id);
      return acc;
    }, {}),
  [translatedCategories, searchedItems]);

  // ── Catégories visibles (filtre recherche + filtre nav) ───────
  const filteredCats = useMemo<Category[]>(() => {
    const withItems = activeCats.filter(
      c => (filteredByCategory[c.id]?.length ?? 0) > 0,
    );
    if (searchQuery.trim()) return withItems;
    return activeCategory === "all"
      ? withItems
      : withItems.filter(c => c.id === activeCategory);
  }, [activeCats, filteredByCategory, searchQuery, activeCategory]);

  // ── Nombre total de résultats ────────────────────────────────
  const totalResults = useMemo<number>(() =>
    filteredCats.reduce((n, c) => n + (filteredByCategory[c.id]?.length ?? 0), 0),
  [filteredCats, filteredByCategory]);

  // ── Label "N résultat(s)" traduit ─────────────────────────────
  const searchResultsLabel = useCallback((count: number): string => {
    const word = count !== 1 ? t("search_results_plural") : t("search_results");
    return `${count}\u00a0${word}`;
  }, [t]);

  // ─────────────────────────────────────────────────────────────
  // Écran chargement
  // ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: colors.bg }}>
        <style>{GLOBAL_STYLES}</style>
        <StyledBackground colors={colors} config={config} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${colors.primary}30`, borderTopColor: colors.primary, animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: 11, letterSpacing: 4, color: `${colors.primary}55`, fontFamily: "sans-serif" }}>
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Écran erreur
  // ─────────────────────────────────────────────────────────────
  if (error !== null || restaurant === null) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: colors.bg }}>
        <style>{GLOBAL_STYLES}</style>
        <StyledBackground colors={colors} config={config} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <UtensilsCrossed size={40} style={{ color: `${colors.primary}40`, margin: "0 auto 16px" }} />
          <p style={{ color: colors.primary, fontFamily: "sans-serif" }}>
            {t("restaurant_not_found")}
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Rendu principal
  // À ce stade, restaurant est non-null (garanti par le guard ci-dessus).
  // ─────────────────────────────────────────────────────────────

  // Compteur d'index global pour le stagger des cartes
  let globalIdx = 0;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <style>{GLOBAL_STYLES}</style>
      <StyledBackground colors={colors} config={config} />

      {/* Modal item */}
      <ItemModal
        item={selectedItem}
        colors={colors}
        config={config.modal}
        onClose={closeModal}
        text={modalText}
      />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", width: "100%", overflow: "visible" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>

          {/* ── Hero ──────────────────────────────────────────── */}
          <DynamicHero
            restaurant={restaurant}
            config={config}
            i18n={heroI18n}
          />

          {/* ── Barre sticky : search + langue + catégories ───── */}
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

          {/* ── Liste des plats ────────────────────────────────── */}
          <main style={{ paddingBottom: 32, paddingTop: 8, overflow: "visible", background:"transparent", backdropFilter: "blur(2px)" }}>
            <AnimatePresence>
              {filteredCats.length === 0 ? (
                <motion.div
                  key="no-result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: "center", padding: "48px 24px", color: `${colors.primary}50`, fontFamily: "sans-serif" }}
                >
                  <p style={{ fontSize: 36, marginBottom: 12 }}>🔍</p>
                  <p style={{ fontSize: 14 }}>
                    {t("search_empty")} « {searchQuery} »
                  </p>
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
                      labelVoir={labelVoir}
                      labelTailles={labelTailles}
                      labelBestseller={labelBestseller}
                      labelPopular={labelPopular}
                      labelNew={labelNew}
                      labelVegetarian={labelVegetarian}
                      labelSpicy={labelSpicy}
                    />
                  );
                })
              )}
            </AnimatePresence>
          </main>

          <div style={{background: `${colors.main}`, padding: "24px 16px"}} >

          {/* ── Réseaux sociaux ────────────────────────────────── */}
          <FunSocials
            restaurant={restaurant}
            colors={colors}
            config={config}
            sectionLabel={socialsLabel}
            labelPhone={labelPhone}
            labelMail={labelMail}
          />

          {/* ── Footer ─────────────────────────────────────────── */}
          <footer style={{ textAlign: "center", padding: "24px 16px 40px", borderTop: `1px solid ${colors.primary}08` }}>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", color: `${colors.primary}80`, fontFamily: "sans-serif", textTransform: "uppercase" }}>
              {/* Nom traduit depuis la BD */}
              {restaurantDisplayName} · {t("digital_menu")}
            </p>
            <p style={{ fontSize: 9, marginTop: 4, color: `${colors.primary}60`, fontFamily: "sans-serif" }}>
              {t("powered_by")}
            </p>
            <p style={{ fontSize: 16, color: `${colors.primary}80`, fontFamily: "sans-serif" }}>
              {restaurant.address && (
                <span style={{ color: `${colors.primary}` }}>
                  {t("Address")} :{tField(restaurant.address_translations, restaurant.address)}<br />
                </span>
              )}
            </p>
          </footer>
              </div>
        </div>
      </div>
    </div>
  );
}