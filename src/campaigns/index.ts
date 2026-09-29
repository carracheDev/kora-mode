import { blackfriday } from "./blackfriday";
import { noel } from "./noel";
import { nouvelan } from "./nouvelan";
import type { Campaign, CampaignId } from "./types";

export { blackfriday, noel, nouvelan };
export type { Campaign, CampaignColors, CampaignId } from "./types";

export const campaigns: Record<CampaignId, Campaign> = {
  blackfriday,
  noel,
  nouvelan,
};

export function getCampaign(id: string | undefined): Campaign {
  return id && id in campaigns
    ? campaigns[id as CampaignId]
    : campaigns.blackfriday;
}

export function getActiveCampaign(): Campaign {
  return getCampaign(process.env.NEXT_PUBLIC_CAMPAIGN ?? "blackfriday");
}