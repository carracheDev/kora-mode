import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

export function StorefrontLayout({ children, hideWhatsAppFloat = false }: { children: ReactNode; hideWhatsAppFloat?: boolean }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="pb-6 sm:pb-8">{children}</div>
      <Footer />
      <WhatsAppFloat hideWhatsAppFloat={hideWhatsAppFloat} />
    </>
  );
}