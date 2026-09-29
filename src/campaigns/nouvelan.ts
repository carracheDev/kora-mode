import type { Campaign } from "./types";
import { images } from "@/brands/mode/images";

export const nouvelan: Campaign = {
  id: "nouvelan",
  name: "Nouvel An",
  colors: {
    bg: "#0E1B2C",
    ink: "#F4EEDD",
    accent: "#DCC28E",
    accentInk: "#0E1B2C",
  },
  announcement: {
    text: "NOUVELLE ANNÉE — Nouveau style, nouvelle allure",
    link: "#campagne",
  },
  hero: {
    eyebrow: "NOUVEL AN · NOUVEAU CHAPITRE",
    title: "Nouvelle année, nouveau style.",
    subtitle: "Commencez l'année avec les pièces qui vous ressemblent.",
    ctaLabel: "Voir la nouvelle sélection",
    ctaHref: "#promos",
    secondaryLabel: "Découvrir KORA",
    image: images.hero.nouvelan,
    endsAt: "2027-01-05T23:59:59+01:00",
  },
  flashOffer: {
    title: "Un nouveau départ avec 10% de remise",
    discountPercent: 10,
    endsAt: "2027-01-05T23:59:59+01:00",
  },
  popup: {
    title: "Bienvenue dans la nouvelle année",
    text: "Profitez de 10% sur votre première sélection de l'année.",
    promoCode: "2027",
  },
  collectionTitle: "La nouvelle sélection",
  promoCode: { code: "2027", percent: 10 },
};