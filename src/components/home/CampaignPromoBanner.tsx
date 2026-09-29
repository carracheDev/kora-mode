"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCampaign } from "@/providers/CampaignProvider";

export function CampaignPromoBanner() {
  const { campaign } = useCampaign();

  return (
    <section className="campaign-block" aria-label={`Offre ${campaign.name}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8">
        <div>
          <p className="eyebrow text-campaign-ink">{campaign.name} · offre sélectionnée</p>
          <h2 className="mt-1 font-heading font-bold">{campaign.flashOffer.title}</h2>
          <p className="mt-1 text-sm text-campaign-ink/85">Utilisez le code <strong>{campaign.promoCode.code}</strong> à la commande.</p>
        </div>
        <Link className="campaign-accent inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-button)] px-5 text-sm font-bold" href="#promos">
          Voir les offres <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>
  );
}