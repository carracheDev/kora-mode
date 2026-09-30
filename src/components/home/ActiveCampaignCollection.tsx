"use client";

import { useCampaign } from "@/providers/CampaignProvider";
import { isOfferActive } from "@/core/lib/promo";
import { products } from "@/brands/mode/products";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { ActiveCampaignCountdown } from "@/components/home/CampaignCountdown";

export function ActiveCampaignCollection() {
  const { campaign } = useCampaign();
  const offerActive = isOfferActive(campaign.flashOffer.endsAt);
  const campaignProducts = campaign.productIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product) => product !== undefined);

  return (
    <section className="bg-surface-soft py-10 sm:py-14" id="promos" aria-labelledby="active-campaign-title">
      <Container>
        <div className="mb-5 grid gap-4 sm:mb-7 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="eyebrow">Sélection {campaign.name}</p>
            <h2 className="mt-1 font-heading font-bold" id="active-campaign-title">{campaign.collectionTitle}</h2>
            <p className="mt-2 text-sm text-muted">{offerActive ? `${campaign.flashOffer.title} · Code ${campaign.promoCode.code}` : "Campagne terminée · sélection consultable sans remise"}</p>
          </div>
          <ActiveCampaignCountdown />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {campaignProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Container>
    </section>
  );
}
