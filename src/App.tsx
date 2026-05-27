// App.tsx — v2 (typages stricts)
// Routing React Router v6 : /:slug → MenuPage

import type { FC } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import MenuPage from "./components/MenuPage";

// ─────────────────────────────────────────────────────────────
// Wrapper : extrait le slug depuis l'URL
// ─────────────────────────────────────────────────────────────

const MenuPageWrapper: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <NotFound />;
  return <MenuPage slug={slug} />;
};

// ─────────────────────────────────────────────────────────────
// Page 404
// ─────────────────────────────────────────────────────────────

const NotFound: FC = () => (
  <div style={{
    position:       "fixed",
    inset:          0,
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    background:     "#0a2e20",
    gap:            16,
    fontFamily:     "sans-serif",
  }}>
    <span style={{ fontSize: 48 }}>🍽️</span>
    <p style={{ color: "#F5E6C8", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>
      Restaurant introuvable
    </p>
    <p style={{ color: "#F5E6C840", fontSize: 12, letterSpacing: "0.1em" }}>
      Vérifie l'URL ou scanne le QR code
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────

const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/:slug" element={<MenuPageWrapper />} />
      <Route path="/"      element={<NotFound />} />
      <Route path="*"      element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;