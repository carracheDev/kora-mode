import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { getActiveCampaign } from "@/campaigns";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { DemoCampaignSwitcher } from "@/components/campaigns/DemoCampaignSwitcher";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KORA MODE | Boutique de mode",
  description: "La boutique de démonstration KORA MODE.",
};

const activeCampaign = getActiveCampaign();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-brand="mode"
      className={`${plusJakarta.variable} ${inter.variable}`}
      style={{
        "--camp-bg": activeCampaign.colors.bg,
        "--camp-ink": activeCampaign.colors.ink,
        "--camp-accent": activeCampaign.colors.accent,
        "--camp-accent-ink": activeCampaign.colors.accentInk,
      } as CSSProperties & Record<`--${string}`, string>}
    >
      <body className="font-sans">
        <AppProviders initialCampaign={activeCampaign}>
          <DemoCampaignSwitcher />
          <StorefrontLayout>{children}</StorefrontLayout>
        </AppProviders>
      </body>
    </html>
  );
}
