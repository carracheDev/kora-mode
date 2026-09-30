import type { Campaign } from "./types";
import { images } from "@/brands/mode/images";

export const blackfriday: Campaign = {
  id: "blackfriday",
  name: "Black Friday",
  colors: {
    bg: "#0A1220",
    ink: "#F4F7F9",
    accent: "#FFC83D",
    accentInk: "#0E1B2C",
  },
  announcement: {
    text: "BLACK FRIDAY — Jusqu'à -40% · Offre limitée",
    link: "#campagne",
  },
  hero: {
    eyebrow: "BLACK FRIDAY · SÉLECTION EXCLUSIVE",
    title: "Les pièces que vous aimez, à prix singulier.",
    subtitle: "Jusqu'à -40% sur une sélection de pièces, pendant quelques jours.",
    ctaLabel: "Voir les offres",
    ctaHref: "#promos",
    secondaryLabel: "Explorer la collection",
    secondaryHref: "#categories",
    image: images.hero.blackfriday,
    endsAt: "2026-11-30T23:59:59+01:00",
  },
  flashOffer: {
    title: "Jusqu'à -40% sur une sélection",
    discountPercent: 40,
    endsAt: "2026-11-30T23:59:59+01:00",
  },
  popup: {
    title: "Un avantage pour votre sélection",
    text: "Profitez de 40% de remise sur une sélection de pièces Black Friday.",
    promoCode: "BF40",
  },
  collectionTitle: "La sélection Black Friday",
  productIds: ["urban-bomber", "dakar-relaxed-jean", "ayo-structured-bag"],
  promoCode: { code: "BF40", percent: 40 },
};