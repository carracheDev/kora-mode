import { CampaignHero } from "@/components/home/CampaignHero";
import { CampaignPromoBanner } from "@/components/home/CampaignPromoBanner";
import {
  CampaignTeasers,
  CategoriesSection,
  FlashOfferSection,
  ProductRail,
  ReviewsSection,
  TrustStrip,
  WhatsAppAndNewsletter,
} from "@/components/home/HomeSections";
import { LookBundle } from "@/components/home/LookBundle";

export default function Home() {
  return (
    <main>
      <CampaignHero />
      <CampaignPromoBanner />
      <TrustStrip />
      <FlashOfferSection />
      <CategoriesSection />
      <ProductRail kind="new" />
      <ProductRail kind="bestseller" />
      <LookBundle />
      <ReviewsSection />
      <CampaignTeasers />
      <WhatsAppAndNewsletter />
    </main>
  );
}
