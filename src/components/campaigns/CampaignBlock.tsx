"use client";

import { useCampaign } from "@/providers/CampaignProvider";

export function CampaignBlock() {
  const { campaign } = useCampaign();

  return (
    <section aria-labelledby="campaign-preview-title" className="campaign-block rounded-[var(--radius-card)] p-5 sm:p-8">
      <p className="eyebrow text-campaign-ink opacity-75">
        {campaign.name} · aperçu de campagne
      </p>
      <h2 className="mt-3 max-w-2xl font-heading font-extrabold" id="campaign-preview-title">
        {campaign.hero.title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 opacity-85 sm:text-base">
        {campaign.hero.subtitle}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          className="campaign-accent inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] px-5 text-sm font-semibold"
          href={campaign.hero.ctaHref}
        >
          {campaign.hero.ctaLabel}
        </a>
        <span className="campaign-accent rounded-[var(--radius-pill)] px-3 py-2 text-xs font-bold">
          Code {campaign.promoCode.code} · -{campaign.promoCode.percent}%
        </span>
      </div>
    </section>
  );
}