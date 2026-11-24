// RestaurantsMap.tsx — Carte MenuQr avec itinéraire
// Dépendances : npm i leaflet react-leaflet && npm i -D @types/leaflet
// Fond de carte : CARTO dark (gratuit, sans clé API)
// Itinéraire : OSRM (serveur public de démo, voiture) + lien Google Maps en secours

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { Navigation, ExternalLink, X } from "lucide-react";

const C = {
  bg: "#0F2A1F", surface: "#173A2B", surface2: "#1F4A37",
  line: "rgba(255,255,255,0.16)", text: "#F4F8F4", muted: "#B9CFC1",
  terracotta: "#C2562F", terraLight: "#F29B77", sage: "#8FC27A", white: "#FFFFFF",
};
const FONT_TITLE = "'Fraunces', Georgia, serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";

export interface MapRestaurant {
  id: string;
  slug: string;
  name: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  types?: { slug: string; icon?: string }[];
}

type LatLng = [number, number];
interface Route { id: string; coords: LatLng[]; km: number; min: number; }

// ── Marqueur : carré terracotta + ombre franche ──────────────
const restoIcon = (emoji: string, active: boolean) =>
  L.divIcon({
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22],
    html: `<div style="
      width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;
      font-size:19px;background:${active ? C.sage : C.terracotta};border:3px solid ${C.white};
      box-shadow:3px 3px 0 ${C.bg};">${emoji}</div>`,
  });

const userIcon = L.divIcon({
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  html: `<div style="width:18px;height:18px;border-radius:4px;background:${C.sage};
    border:3px solid ${C.white};box-shadow:0 0 0 4px rgba(143,194,122,.35);"></div>`,
});

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) map.setView(points[0], 15);
    else map.fitBounds(points, { padding: [50, 50] });
  }, [points, map]);
  return null;
}

const TYPE_ICON: Record<string, string> = {
  "restaurant": "🍽️", "street-food": "🌮", "bar": "🍺", "café": "☕", "boulangerie": "🥐",
  "food-truck": "🚚", "pizzeria": "🍕", "sushi": "🍣", "végétarien": "🥗",
  "burger": "🍔", "brasserie": "🥂", "traiteur": "👨‍🍳",
};

export default function RestaurantsMap({
  restaurants, height = 460, bare = false, autoRoute = false,
}: { restaurants: MapRestaurant[]; height?: number; bare?: boolean; autoRoute?: boolean }) {
  const [user, setUser] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const located = useMemo(
    () => restaurants.filter(r => typeof r.latitude === "number" && typeof r.longitude === "number"),
    [restaurants],
  );
  const points = useMemo<LatLng[]>(
    () => [...located.map(r => [r.latitude!, r.longitude!] as LatLng), ...(route ? route.coords : [])],
    [located, route],
  );

  function drawRoute(r: MapRestaurant) {
    setError(null);
    if (!navigator.geolocation) return setError("La géolocalisation n'est pas disponible sur cet appareil.");
    setLoadingId(r.id);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const from: LatLng = [pos.coords.latitude, pos.coords.longitude];
        setUser(from);
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${r.longitude},${r.latitude}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          const json = await res.json();
          const best = json.routes?.[0];
          if (!best) throw new Error("no route");
          setRoute({
            id: r.id,
            coords: best.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as LatLng),
            km: best.distance / 1000,
            min: Math.round(best.duration / 60),
          });
        } catch {
          setError("Impossible de calculer l'itinéraire. Essayez « Ouvrir dans Maps ».");
        } finally {
          setLoadingId(null);
        }
      },
      () => { setLoadingId(null); setError("Autorisez la localisation pour tracer l'itinéraire."); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  // Mode fenêtre : trace l'itinéraire automatiquement à l'ouverture
  useEffect(() => {
    if (autoRoute && located.length === 1) drawRoute(located[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (located.length === 0) return null;

  return (
    <section aria-label="Carte des restaurants" style={{ marginBottom: bare ? 0 : 56 }}>
      {!bare && (
        <h2 style={{ margin: "0 0 18px", fontFamily: FONT_TITLE, fontSize: "clamp(24px,5vw,32px)", fontWeight: 600, color: C.text }}>
          Trouvez-nous sur la carte
        </h2>
      )}

      <div style={{
        position: "relative", borderRadius: 24, overflow: "hidden", border: `2px solid ${C.line}`,
        boxShadow: bare ? "none" : `8px 8px 0 ${C.terracotta}`, background: C.surface,
      }}>
        <MapContainer center={[points[0]?.[0] ?? 0, points[0]?.[1] ?? 0]} zoom={13} scrollWheelZoom={false}
          style={{ height, width: "100%", background: C.bg }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <FitBounds points={points} />

          {route && (
            <>
              <Polyline positions={route.coords} pathOptions={{ color: C.bg, weight: 10, opacity: 0.9 }} />
              <Polyline positions={route.coords} pathOptions={{ color: C.terraLight, weight: 5, lineCap: "round" }} />
            </>
          )}

          {user && <Marker position={user} icon={userIcon} />}

          {located.map(r => {
            const emoji = TYPE_ICON[r.types?.[0]?.slug ?? ""] ?? "🍽️";
            return (
              <Marker key={r.id} position={[r.latitude!, r.longitude!]} icon={restoIcon(emoji, route?.id === r.id)}>
                <Popup closeButton={false} minWidth={220}>
                  <div style={{ fontFamily: FONT_BODY, color: C.text }}>
                    <p style={{ margin: "0 0 4px", fontFamily: FONT_TITLE, fontSize: 18, fontWeight: 600 }}>{r.name}</p>
                    {r.address && <p style={{ margin: "0 0 12px", fontSize: 13, color: C.muted }}>{r.address}</p>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <a href={`/${r.slug}`} className="mqr-map-btn mqr-map-btn--primary">Voir le menu</a>
                      <button className="mqr-map-btn" onClick={() => drawRoute(r)} disabled={loadingId === r.id}>
                        <Navigation size={16} aria-hidden="true" />
                        {loadingId === r.id ? "Calcul…" : "Tracer l'itinéraire"}
                      </button>
                      <a className="mqr-map-btn" target="_blank" rel="noopener noreferrer"
                        href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${r.latitude}%2C${r.longitude}`}>
                        <ExternalLink size={16} aria-hidden="true" /> Ouvrir dans OpenStreetMap
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Bandeau distance / durée */}
        {route && (
          <div role="status" style={{
            position: "absolute", left: 12, bottom: 12, zIndex: 1000, display: "flex", alignItems: "center", gap: 12,
            background: C.bg, color: C.text, border: `2px solid ${C.line}`, borderRadius: 14,
            padding: "8px 8px 8px 14px", boxShadow: `4px 4px 0 ${C.terracotta}`, fontFamily: FONT_BODY, fontSize: 14, fontWeight: 700,
          }}>
            <span>{route.km.toFixed(1)} km · {route.min} min</span>
            <button aria-label="Effacer l'itinéraire" onClick={() => setRoute(null)}
              style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: C.surface2, color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {error && <p role="alert" style={{ margin: "14px 0 0", fontSize: 14, color: C.terraLight }}>{error}</p>}

      <style>{`
        /* Teinte verte sur le fond de carte */
        /* Tuiles OSM claires -> sombres + teinte vert forêt (ajustez hue-rotate/brightness au goût) */
        .leaflet-tile-pane { filter: invert(1) hue-rotate(290deg) saturate(.8) brightness(.9) contrast(.95); }
        .leaflet-container { font-family: ${FONT_BODY}; }
        .leaflet-popup-content-wrapper {
          background: ${C.surface}; color: ${C.text}; border: 2px solid ${C.line}; border-radius: 16px;
          box-shadow: 5px 5px 0 ${C.terracotta};
        }
        .leaflet-popup-tip { background: ${C.surface}; }
        .leaflet-popup-content { margin: 14px 16px; }
        .leaflet-control-attribution { background: rgba(15,42,31,.85) !important; color: ${C.muted} !important; }
        .leaflet-control-attribution a { color: ${C.terraLight} !important; }
        .leaflet-bar a { background: ${C.surface} !important; color: ${C.text} !important; border-color: ${C.line} !important; }
        .mqr-map-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 14px;
          border-radius: 12px; border: 2px solid ${C.line}; background: transparent; color: ${C.text} !important;
          font: 700 14px ${FONT_BODY}; text-decoration: none; cursor: pointer;
        }
        .mqr-map-btn:hover { border-color: ${C.sage}; }
        .mqr-map-btn--primary { background: ${C.terracotta}; border-color: ${C.terracotta}; color: ${C.white} !important; }
        .mqr-map-btn:disabled { opacity: .6; cursor: progress; }
      `}</style>
    </section>
  );
}