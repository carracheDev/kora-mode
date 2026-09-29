"use client";

import { useEffect, type ReactNode } from "react";
import type { Campaign } from "@/campaigns/types";
import { useCartStore } from "@/core/store/cart";
import { useFavoritesStore } from "@/core/store/favorites";
import { useOrdersStore } from "@/core/store/orders";
import { CampaignProvider } from "@/providers/CampaignProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

export function AppProviders({
  initialCampaign,
  children,
}: {
  initialCampaign: Campaign;
  children: ReactNode;
}) {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useFavoritesStore.persist.rehydrate();
    void useOrdersStore.persist.rehydrate();
  }, []);

  return (
    <CampaignProvider initialCampaign={initialCampaign}>
      <ToastProvider>{children}</ToastProvider>
    </CampaignProvider>
  );
}