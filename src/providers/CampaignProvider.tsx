"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { getCampaign } from "@/campaigns";
import type { Campaign } from "@/campaigns/types";

const CampaignContext = createContext<{
  campaign: Campaign;
  selectCampaign: (id: string) => void;
} | null>(null);

const campaignProperties = {
  bg: "--camp-bg",
  ink: "--camp-ink",
  accent: "--camp-accent",
  accentInk: "--camp-accent-ink",
} as const;
const campaignStorageKey = "kora-mode-demo-campaign";
const campaignChangeEvent = "kora-mode-campaign-change";

function subscribeToCampaign(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(campaignChangeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(campaignChangeEvent, onChange);
  };
}

function applyCampaignColors(campaign: Campaign) {
  for (const [key, property] of Object.entries(campaignProperties)) {
    document.documentElement.style.setProperty(property, campaign.colors[key as keyof typeof campaignProperties]);
  }
}

export function CampaignProvider({
  initialCampaign,
  children,
}: {
  initialCampaign: Campaign;
  children: ReactNode;
}) {
  const demoEnabled = process.env.NEXT_PUBLIC_DEMO === "true";
  const campaignId = useSyncExternalStore(
    demoEnabled ? subscribeToCampaign : () => () => {},
    () => (demoEnabled ? window.localStorage.getItem(campaignStorageKey) ?? initialCampaign.id : initialCampaign.id),
    () => initialCampaign.id,
  );
  const campaign = getCampaign(campaignId);

  useEffect(() => {
    applyCampaignColors(campaign);
  }, [campaign]);

  function selectCampaign(id: string) {
    if (!demoEnabled) return;
    window.localStorage.setItem(campaignStorageKey, getCampaign(id).id);
    window.dispatchEvent(new Event(campaignChangeEvent));
  }

  return (
    <CampaignContext.Provider value={{ campaign, selectCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const value = useContext(CampaignContext);
  if (!value) throw new Error("useCampaign must be used within CampaignProvider");
  return value;
}