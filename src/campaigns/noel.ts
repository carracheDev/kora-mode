import type { Campaign } from "./types";
import { images } from "@/brands/mode/images";

export const noel: Campaign = {
  id: "noel",
  name: "Noël",
  colors: {
    bg: "#4A1220",
    ink: "#F7F0E8",
    accent: "#E2C071",
    accentInk: "#2A0A10",
  },
  announcement: {
    text: "NOËL — Trouvez le cadeau parfait",
    link: "#campagne",
  },
  hero: {
    eyebrow: "NOËL · ATTENTIONS CHOISIES",
    title: "Trouvez le cadeau parfait.",
    subtitle: "Des pièces à offrir, à porter et à garder longtemps.",
    ctaLabel: "Découvrir les idées cadeaux",
    ctaHref: "#promos",
    secondaryLabel: "Voir les nouveautés",
    image: images.hero.noel,
    endsAt: "2026-12-25T23:59:59+01:00",
  },
  flashOffer: {
    title: "Une attention de 15% pour les fêtes",
    discountPercent: 15,
    endsAt: "2026-12-25T23:59:59+01:00",
  },
  popup: {
    title: "Un cadeau pour vous aussi",
    text: "Profitez de 15% sur votre sélection de fêtes.",
    promoCode: "NOEL15",
  },
  collectionTitle: "Les idées cadeaux KORA",
  promoCode: { code: "NOEL15", percent: 15 },
};