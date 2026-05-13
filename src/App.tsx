// App.tsx
// Routing React Router v6 : /:slug → MenuPage
// Page d'accueil si pas de slug (404 ou landing)

import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import MenuPage from "./components/MenuPage";

// ─────────────────────────────────────────────────────────────
// Wrapper : extrait le slug depuis l'URL et le passe à MenuPage
// ─────────────────────────────────────────────────────────────

function MenuPageWrapper() {
  const { slug } = useParams<{ slug: string }>();

  // Slug absent ou vide → page introuvable
  if (!slug) return <NotFound />;

  return <MenuPage slug={slug} />;
}

// ─────────────────────────────────────────────────────────────
// Page 404 / accueil sans slug
// ─────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a2e20",
        gap: 16,
        fontFamily: "sans-serif",
      }}
    >
      <span style={{ fontSize: 48 }}>🍽️</span>
      <p style={{ color: "#F5E6C8", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>
        Restaurant introuvable
      </p>
      <p style={{ color: "#F5E6C840", fontSize: 12, letterSpacing: "0.1em" }}>
        Vérifie l'URL ou scanne le QR code
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// App — arbre de routes
//
//   /              → NotFound (ou une landing page si tu en as une)
//   /:slug         → MenuPage du restaurant
//   /*             → NotFound
//
// ─────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route principale : /:slug */}
        <Route path="/:slug" element={<MenuPageWrapper />} />

        {/* Accueil sans slug → page 404 */}
        <Route path="/" element={<NotFound />} />

        {/* Tout le reste */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// ─────────────────────────────────────────────────────────────
// NOTES D'INSTALLATION
// ─────────────────────────────────────────────────────────────
//
// 1. Installer React Router si pas encore fait :
//    npm install react-router-dom
//
// 2. Dans vite.config.ts, activer le fallback HTML pour le routing SPA :
//
//    export default defineConfig({
//      plugins: [react()],
//      server: {
//        // dev : toutes les routes → index.html
//      },
//    })
//
//    Pour le déploiement (Netlify, Vercel, etc.) ajouter un fichier
//    de redirection selon la plateforme :
//
//    Netlify → public/_redirects :
//      /* /index.html 200
//
//    Vercel → vercel.json :
//      { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
//
// 3. Accès au menu d'un restaurant :
//    https://ton-domaine.com/mon-restaurant
//    → slug = "mon-restaurant"
//    → MenuPage charge le resto depuis Supabase via ce slug