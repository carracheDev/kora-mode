"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCampaign } from "@/providers/CampaignProvider";

export function AnnouncementBar() {
  const { campaign } = useCampaign();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative flex min-h-10 items-center justify-center gap-3 bg-ink px-12 py-2 text-center text-sm font-semibold text-surface">
      <a className="hover:underline" href={campaign.announcement.link}>
        {campaign.announcement.text}
      </a>
      <button
        aria-label="Masquer l’annonce"
        className="absolute right-2 grid size-9 place-items-center rounded-[var(--radius-pill)] text-surface/80 hover:bg-surface/10 hover:text-surface sm:right-6"
        onClick={() => setVisible(false)}
        type="button"
      >
        <X aria-hidden="true" size={16} />
      </button>
    </div>
  );
}