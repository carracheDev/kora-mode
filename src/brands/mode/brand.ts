export const modeBrand = {
  name: "KORA MODE",
  logoText: "KORA",
  logoDescriptor: "MODE",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  navLinks: [
    { label: "Nouveautés", href: "/boutique?tri=nouveautes" },
    { label: "Vêtements", href: "/boutique?categorie=vetements" },
    { label: "Accessoires", href: "/boutique?categorie=accessoires" },
    { label: "Promos", href: "/boutique?promo=1" },
  ],
  footer: {
    columns: [
      {
        title: "Boutique",
        links: ["Nouveautés", "Vêtements", "Accessoires", "Promotions"],
      },
      {
        title: "Aide",
        links: ["Livraison", "Retours", "Paiement", "Questions fréquentes"],
      },
      {
        title: "Contact",
        links: ["WhatsApp", "Instagram", "TikTok"],
      },
    ],
    paymentMethods: ["MTN Mobile Money", "Moov Money", "Celtiis", "Paiement à la livraison"],
    socialLinks: ["Instagram", "TikTok"],
    newsletter: {
      title: "La lettre KORA",
      description: "Les nouvelles collections, sans bruit inutile.",
    },
  },
  deliveryInfo: "Livraison disponible au Bénin",
} as const;