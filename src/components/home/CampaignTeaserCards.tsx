"use client";

import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { campaigns } from "@/campaigns";
import { Card } from "@/components/ui/Card";
import { useCampaign } from "@/providers/CampaignProvider";

export function CampaignTeaserCards() {
  const { campaign: activeCampaign, selectCampaign } = useCampaign();

  function chooseCampaign(id: string) {
    selectCampaign(id);
    document.getElementById("promos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="py-10 sm:py-14" aria-labelledby="campaigns-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 sm:mb-7">
          <p className="eyebrow">Au fil des saisons</p>
          <h2 className="mt-1 font-heading font-bold" id="campaigns-title">Trois temps forts, une même boutique</h2>
        </div>
        <div aria-label="Campagnes saisonnières" aria-roledescription="carrousel" className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0" role="region">
          {Object.values(campaigns).map((option) => (
            <div className="min-w-[84%] snap-start sm:min-w-0" key={option.id}>
              <Card
                aria-current={activeCampaign.id === option.id ? "true" : undefined}
                className={`campaign-block campaign-card !p-4 sm:!p-5 ${activeCampaign.id === option.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
                style={{
                  "--camp-bg": option.colors.bg,
                  "--camp-ink": option.colors.ink,
                  "--camp-accent": option.colors.accent,
                  "--camp-accent-ink": option.colors.accentInk,
                } as CSSProperties & Record<`--${string}`, string>}
                variant="interactive"
              >
                <p className="eyebrow text-campaign-ink">Campagne KORA</p>
                <h3 className="mt-2 font-heading font-bold">{option.name}</h3>
                <p className="mt-2 text-sm leading-6 opacity-85">{option.collectionTitle}</p>
                <button
                  aria-pressed={activeCampaign.id === option.id}
                  className="campaign-accent mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] px-4 text-sm font-bold"
                  onClick={() => chooseCampaign(option.id)}
                  type="button"
                >
                  {activeCampaign.id === option.id ? "Campagne active" : "Choisir cette campagne"}
                  <ArrowRight aria-hidden="true" size={16} />
                </button>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
