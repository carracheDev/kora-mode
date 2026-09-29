"use client";

import { useEffect, useState } from "react";
import { useCampaign } from "@/providers/CampaignProvider";

function getTimeLeft(endsAt: string) {
  const seconds = Math.max(0, Math.floor((Date.parse(endsAt) - Date.now()) / 1000));
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export function CampaignCountdown({
  endsAt,
  variant = "surface",
  className = "",
}: {
  endsAt: string;
  variant?: "surface" | "campaign";
  className?: string;
}) {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);
  const campaignStyle = variant === "campaign";

  useEffect(() => {
    const refresh = () => {
      const endTime = Date.parse(endsAt);
      if (!Number.isFinite(endTime)) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        window.clearInterval(timer);
        return;
      }
      setTime(getTimeLeft(endsAt));
      if (endTime <= Date.now()) window.clearInterval(timer);
    };
    const initialRefresh = window.setTimeout(refresh, 0);
    const timer = window.setInterval(refresh, 1000);
    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(timer);
    };
  }, [endsAt]);

  const ended = time !== null && time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;

  if (ended) {
    return <p className={`text-sm font-semibold ${campaignStyle ? "text-campaign-ink" : "text-muted"}`}>Offre terminée</p>;
  }

  const labels = [
    [time?.days, "Jours"],
    [time?.hours, "Heures"],
    [time?.minutes, "Min"],
    [time?.seconds, "Sec"],
  ] as const;

  return (
    <div aria-label="Temps restant pour cette campagne" className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {labels.map(([value, label]) => (
        <div className={`min-w-[54px] rounded-[var(--radius-button)] border px-2 py-2 text-center sm:min-w-[62px] ${campaignStyle ? "border-campaign-ink/15 text-campaign-ink" : "border-line bg-surface text-ink"}`} key={label}>
          <span className="block font-heading text-xl font-bold tabular-nums sm:text-2xl">{value === undefined ? "--" : String(value).padStart(2, "0")}</span>
          <span className={`mt-0.5 block text-sm ${campaignStyle ? "text-campaign-ink/75" : "text-muted"}`}>{label}</span>
        </div>
      ))}
    </div>
  );
}

export function ActiveCampaignCountdown({ className = "" }: { className?: string }) {
  const { campaign } = useCampaign();
  return <CampaignCountdown className={className} endsAt={campaign.flashOffer.endsAt} />;
}