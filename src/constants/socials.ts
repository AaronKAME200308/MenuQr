// constants/socials.ts
// Métadonnées des réseaux sociaux — partagé entre FunSocials et tout autre composant

import { MapPin, Phone, Globe, MessageCircle, Music2 } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export const SOCIAL_META = [
  { key: "social_facebook",   label: "Facebook",  emoji: "👥", bg: "#1877F2", Icon: FaFacebook   },
  { key: "social_instagram",  label: "Instagram", emoji: "📸", bg: "#E1306C", Icon: FaInstagram   },
  { key: "social_whatsapp",   label: "WhatsApp",  emoji: "💬", bg: "#25D366", Icon: MessageCircle },
  { key: "social_tiktok",     label: "TikTok",    emoji: "🎵", bg: "#010101", Icon: Music2        },
  { key: "social_googlemaps", label: "Maps",      emoji: "📍", bg: "#EA4335", Icon: MapPin        },
  { key: "social_website",    label: "Site web",  emoji: "🌐", bg: "#6366f1", Icon: Globe         },
  { key: "phone",             label: "Appeler",   emoji: "📞", bg: "#555555", Icon: Phone         },
] as const;