"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCampaign } from "@/providers/CampaignProvider";
import { isOfferActive } from "@/core/lib/promo";
import { images } from "@/brands/mode/images";
import { SmartImage } from "@/components/ui/SmartImage";
import { CampaignCountdown } from "@/components/home/CampaignCountdown";

export function CampaignHero() {
  const { campaign } = useCampaign();
  const offerActive = isOfferActive(campaign.flashOffer.endsAt);
  const endsAt = campaign.hero.endsAt ?? campaign.flashOffer.endsAt;

  return (
    <section aria-labelledby="campaign-hero-title" className="campaign-block overflow-hidden" id="campagne">
      <div className="mx-auto grid max-w-7xl items-center gap-0 px-4 pt-3 pb-1 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:px-8 md:py-10 lg:gap-16 lg:py-14">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="order-2 py-1 md:order-1 md:py-8"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <p className="eyebrow text-campaign-ink">{campaign.hero.eyebrow}</p>
          <h1 className="mt-2 max-w-[12ch] font-heading font-extrabold tracking-[-0.02em] md:mt-3">
            {campaign.hero.title}
          </h1>
          <p className="mt-2 max-w-xl text-base leading-7 text-campaign-ink/85 md:mt-4">
            {offerActive ? campaign.hero.subtitle : `La campagne ${campaign.name} est terminée. Parcourez la sélection KORA MODE.`}
          </p>
          <CampaignCountdown className="mt-2 sm:mt-6" endsAt={endsAt} variant="campaign" />
          <div className="mt-1 flex flex-wrap items-center gap-3 sm:mt-7 sm:gap-4">
            <Link className="campaign-accent inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-button)] px-5 text-sm font-bold" href={campaign.hero.ctaHref}>
              {offerActive ? campaign.hero.ctaLabel : "Voir la sélection"} <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link className="inline-flex min-h-12 items-center text-sm font-semibold text-campaign-ink underline underline-offset-4" href={campaign.hero.secondaryHref}>
              {campaign.hero.secondaryLabel}
            </Link>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="order-1 relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-campaign-ink/10 p-2 md:order-2 md:aspect-[5/4] md:p-0"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="relative size-full overflow-hidden rounded-[calc(var(--radius-card)-4px)] md:rounded-[var(--radius-card)]">
            <SmartImage alt="Silhouette de la campagne KORA MODE" className="object-cover" focus={images.focus.hero[campaign.id]} priority sizes="(max-width: 767px) 92vw, 55vw" src={campaign.hero.image} />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/25 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}