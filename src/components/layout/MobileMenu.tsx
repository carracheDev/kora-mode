"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Heart,
    MessageCircle,
  PackageSearch,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useCampaign } from "@/providers/CampaignProvider";
import { modeBrand } from "@/brands/mode/brand";
import { useFavoritesStore } from "@/core/store/favorites";
import { buildWhatsAppUrl } from "@/core/lib/whatsapp";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type NavLink = { label: string; href: string };
type MenuCategoryLink = { label: string; href: string };
const categoryLinks: Record<string, MenuCategoryLink[]> = {
  Vêtements: [
    { label: "Femme", href: "/boutique?categorie=vetements&genre=femme" },
    { label: "Homme", href: "/boutique?categorie=vetements&genre=homme" },
    { label: "Robes", href: "/boutique?categorie=vetements&genre=femme&sous=Hauts" },
    { label: "Ensembles", href: "/boutique?categorie=vetements&sous=Hauts" },
    { label: "Vestes", href: "/boutique?categorie=vetements&sous=Vestes" },
    { label: "T-shirts", href: "/boutique?categorie=vetements&sous=Hauts" },
  ],
  Accessoires: [
    { label: "Sacs", href: "/boutique?categorie=accessoires&sous=Sacs" },
    { label: "Sneakers", href: "/boutique?categorie=accessoires&sous=Chaussures" },
    { label: "Bijoux", href: "/boutique?categorie=accessoires" },
    { label: "Casquettes", href: "/boutique?categorie=accessoires" },
  ],
};

export function MobileMenu({
  open,
  links,
  onClose,
}: {
  open: boolean;
  links: readonly NavLink[];
  onClose: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { campaign } = useCampaign();
  const favoriteCount = useFavoritesStore((state) => state.productIds.length);
  const whatsappUrl = buildWhatsAppUrl(
    modeBrand.whatsappNumber,
    "Bonjour, je souhaite en savoir plus sur KORA MODE.",
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const drawer = drawerRef.current;
    const focusable = () =>
      Array.from(
        drawer?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    focusable()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[80] bg-ink/60 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.aside
          animate={{ x: 0 }}
          aria-labelledby="mobile-menu-title"
          aria-modal="true"
          className="fixed inset-y-0 left-0 z-[81] flex h-[100dvh] w-[88%] max-w-[380px] flex-col overflow-y-auto overscroll-contain bg-bg pl-4 pr-4 pt-[max(16px,env(safe-area-inset-top))] pb-[calc(env(safe-area-inset-bottom)+88px)] shadow-[var(--shadow-popover)] sm:pl-6 sm:pr-6"
          exit={{ x: "-100%" }}
          initial={{ x: "-100%" }}
          ref={drawerRef}
          role="dialog"
        >
          <div className="flex min-h-12 items-center justify-between">
            <p className="font-heading text-xl font-extrabold" id="mobile-menu-title">
              {modeBrand.logoText} <span className="font-sans text-xs tracking-normal">{modeBrand.logoDescriptor}</span>
            </p>
            <button aria-label="Fermer le menu" className="grid size-11 place-items-center rounded-[var(--radius-pill)] hover:bg-surface" onClick={onClose} type="button">
              <X aria-hidden="true" size={22} />
            </button>
          </div>

          <label className="relative mt-4 block">
            <span className="sr-only">Rechercher un article</span>
            <Search aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input className="min-h-12 w-full rounded-[var(--radius-pill)] border border-line bg-surface pl-11 pr-4 text-base text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" placeholder="Rechercher" type="search" />
          </label>

          <nav aria-label="Catégories" className="mt-5">
            <ul className="grid gap-2">
              {links.map((link, index) => {
                const children = categoryLinks[link.label];
                const expanded = expandedCategory === link.label;
                return (
                  <motion.li animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 8 }} key={link.label} transition={{ delay: index * 0.03 }}>
                    <Card className="card--menu-row" variant="interactive">
                      <div className="px-4">
                        <div className="flex min-h-14 items-center gap-3">
                          {children ? (
                            <button aria-expanded={expanded} className="flex min-h-14 min-w-0 flex-1 items-center justify-between gap-2 text-left text-base font-semibold" onClick={() => setExpandedCategory(expanded ? null : link.label)} type="button">
                              <span>{link.label}</span>
                              <ChevronDown aria-hidden="true" className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} size={18} />
                            </button>
                          ) : (
                            <a className="flex min-h-14 min-w-0 flex-1 items-center justify-between gap-2 text-base font-semibold" href={link.href} onClick={onClose}>
                              <span>{link.label}</span>
                              <ChevronDown aria-hidden="true" className="shrink-0 -rotate-90 text-muted" size={18} />
                            </a>
                          )}
                          {link.label === "Nouveautés" ? <Badge variant="new">Nouveau</Badge> : null}
                          {link.label === "Promos" ? <Badge variant="promo">-{campaign.promoCode.percent}%</Badge> : null}
                        </div>
                        <AnimatePresence initial={false}>
                          {children && expanded ? (
                            <motion.ul
                              animate={{ height: "auto", opacity: 1 }}
                              className="grid w-full grid-cols-2 gap-2 overflow-hidden border-t border-line py-3"
                              exit={{ height: 0, opacity: 0 }}
                              initial={{ height: 0, opacity: 0 }}
                              key={`${link.label}-submenu`}
                              transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
                            >
                              {children.map((child) => <li key={child.label}><a className="flex min-h-11 items-center rounded-[var(--radius-pill)] border border-line bg-surface-soft px-3 text-sm font-medium text-ink hover:border-primary hover:text-primary" href={child.href} onClick={onClose}>{child.label}</a></li>)}
                            </motion.ul>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </Card>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <section aria-label="Campagne en cours" className="campaign-block mt-5 rounded-[var(--radius-card)] p-4">
            <p className="eyebrow opacity-80">{campaign.name}</p>
            <p className="mt-1 font-heading text-xl font-bold">{campaign.collectionTitle}</p>
            <p className="mt-1 text-sm">Code {campaign.promoCode.code} · -{campaign.promoCode.percent}%</p>
            <a className="campaign-accent mt-3 inline-flex min-h-11 items-center rounded-[var(--radius-button)] px-4 text-sm font-bold" href={campaign.hero.ctaHref} onClick={onClose}>Voir les offres</a>
          </section>

          <div aria-label="Actions rapides" className="mt-4 grid grid-cols-3 gap-2">
            <Card className="!p-2" variant="soft"><a className="flex min-h-[76px] flex-col items-center justify-center gap-1 text-center text-sm font-semibold" href="/favoris" onClick={onClose}><Heart aria-hidden="true" size={18} />Favoris ({favoriteCount})</a></Card>
            <Card className="!p-2" variant="soft"><a className="flex min-h-[76px] flex-col items-center justify-center gap-1 text-center text-sm font-semibold" href="/compte" onClick={onClose}><UserRound aria-hidden="true" size={18} />Mon compte</a></Card>
            <Card className="!p-2" variant="soft"><a className="flex min-h-[76px] flex-col items-center justify-center gap-1 text-center text-sm font-semibold" href="/commandes" onClick={onClose}><PackageSearch aria-hidden="true" size={18} />Suivre ma commande</a></Card>
          </div>

          <div className="mt-5 grid gap-3">
            <a className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-whatsapp px-4 text-sm font-bold text-surface" href={whatsappUrl} rel="noreferrer" target="_blank"><MessageCircle aria-hidden="true" size={18} />WhatsApp</a>
            <p className="text-center text-sm text-muted">Livraison au Bénin · Paiement à la livraison</p>
          </div>
        </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}