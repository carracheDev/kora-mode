"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { campaigns } from "@/campaigns";
import { useCampaign } from "@/providers/CampaignProvider";

export function DemoCampaignSwitcher() {
  const enabled = process.env.NEXT_PUBLIC_DEMO === "true";
  const [open, setOpen] = useState(false);
  const { campaign, selectCampaign } = useCampaign();

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[60] sm:bottom-6 sm:left-6">
      <button
        aria-expanded={open}
        aria-label="Changer la campagne de démonstration"
        className="grid size-12 place-items-center rounded-[var(--radius-pill)] border border-line bg-surface text-ink shadow-[var(--shadow-popover)] hover:bg-bg"
        onClick={() => setOpen((value) => !value)}
        title="Campagne de démonstration"
        type="button"
      >
        <SlidersHorizontal aria-hidden="true" size={18} />
      </button>
      {open ? (
        <label className="absolute bottom-14 left-0 grid min-w-48 gap-2 rounded-[var(--radius-card)] border border-line bg-surface p-3 text-xs font-semibold shadow-[var(--shadow-popover)]">
          Campagne active
          <select
            className="min-h-11 rounded-[var(--radius-button)] border border-line bg-bg px-3 text-sm font-normal text-ink"
            onChange={(event) => selectCampaign(event.target.value)}
            value={campaign.id}
          >
            {Object.values(campaigns).map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}