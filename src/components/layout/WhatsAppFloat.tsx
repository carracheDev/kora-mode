"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { modeBrand } from "@/brands/mode/brand";
import { buildWhatsAppUrl } from "@/core/lib/whatsapp";

export function WhatsAppFloat({ hideWhatsAppFloat = false }: { hideWhatsAppFloat?: boolean }) {
  const [scrollingDown, setScrollingDown] = useState(false);
  const number = process.env.NEXT_PUBLIC_WHATSAPP ?? modeBrand.whatsappNumber;
  const href = buildWhatsAppUrl(number, "Bonjour, je souhaite en savoir plus sur KORA MODE.");

  useEffect(() => {
    let previousScrollY = window.scrollY;
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      setScrollingDown(currentScrollY > previousScrollY && currentScrollY > 80);
      previousScrollY = currentScrollY;
    };
    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, []);

  if (hideWhatsAppFloat) return null;

  return (
    <a
      aria-label="Contacter KORA MODE sur WhatsApp"
      className={`fixed bottom-[calc(env(safe-area-inset-bottom)+12px)] right-[calc(env(safe-area-inset-right)+12px)] z-40 grid size-12 place-items-center rounded-[var(--radius-pill)] bg-whatsapp text-surface shadow-[var(--shadow-popover)] transition-[opacity,transform] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${scrollingDown ? "opacity-90" : "opacity-100"} sm:bottom-[calc(env(safe-area-inset-bottom)+24px)] sm:right-[calc(env(safe-area-inset-right)+24px)] sm:size-14`}
      href={href}
      rel="noreferrer"
      target="_blank"
      title="Discuter sur WhatsApp"
    >
      <MessageCircle aria-hidden="true" size={23} />
    </a>
  );
}
