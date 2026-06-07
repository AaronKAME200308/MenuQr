// App.tsx — v3
// Route / → HomePage, /:slug → MenuPage

import type { FC } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import MenuPage from "./components/MenuPage";
import HomePage from "./components/HomePage";

const MenuPageWrapper: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <NotFound />;
  return <MenuPage slug={slug} />;
};

const NotFound: FC = () => (
  <div style={{
    position: "fixed", inset: 0,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "#0a2e20", gap: 16, fontFamily: "sans-serif",
  }}>
    <span style={{ fontSize: 48 }}>🍽️</span>
    <p style={{ color: "#F5E6C8", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>
      Restaurant introuvable
    </p>
    <p style={{ color: "#F5E6C840", fontSize: 12, letterSpacing: "0.1em" }}>
      Vérifie l'URL ou scanne le QR code
    </p>
    <a href="/" style={{ fontSize: 11, color: "#F5C518", letterSpacing: "0.1em", textDecoration: "none", marginTop: 8 }}>
      ← Retour à l'accueil
    </a>
  </div>
);

const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/"      element={<HomePage />} />
      <Route path="/:slug" element={<MenuPageWrapper />} />
      <Route path="*"      element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;