export type CampaignId = "blackfriday" | "noel" | "nouvelan";

export type CampaignColors = {
  bg: string;
  ink: string;
  accent: string;
  accentInk: string;
};

export type Campaign = {
  id: CampaignId;
  name: string;
  colors: CampaignColors;
  announcement: {
    text: string;
    link: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    secondaryLabel: string;
    image: string;
    endsAt?: string;
  };
  flashOffer: {
    title: string;
    discountPercent: number;
    endsAt: string;
  };
  popup: {
    title: string;
    text: string;
    promoCode: string;
  };
  collectionTitle: string;
  promoCode: {
    code: string;
    percent: number;
  };
};