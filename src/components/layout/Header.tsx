"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { modeBrand } from "@/brands/mode/brand";
import { useCartStore } from "@/core/store/cart";
import { useFavoritesStore } from "@/core/store/favorites";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/components/catalog/SearchOverlay";

function CountLink({
  label,
  count,
  href,
  children,
}: {
  label: string;
  count?: number;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      aria-label={count ? `${label}, ${count} article${count === 1 ? "" : "s"}` : label}
      className="relative grid size-11 place-items-center rounded-[var(--radius-pill)] text-ink hover:bg-surface"
      href={href}
      title={label}
    >
      {children}
      {count ? (
        <span className="absolute right-0 top-0 grid min-h-5 min-w-5 place-items-center rounded-[var(--radius-pill)] bg-surface-mint px-1 text-[10px] font-bold text-primary">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </a>
  );
}

function subscribeToLocation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("kora:location-change", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("kora:location-change", onChange);
  };
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const locationSearch = useSyncExternalStore(subscribeToLocation, () => window.location.search, () => "");
  const activeParams = new URLSearchParams(locationSearch);
  const activeNavLabel = pathname === "/boutique"
    ? activeParams.get("promo") === "1"
      ? "Promos"
      : activeParams.get("tri") === "nouveautes"
        ? "Nouveautés"
        : activeParams.get("categorie") === "vetements"
          ? "Vêtements"
          : activeParams.get("categorie") === "accessoires"
            ? "Accessoires"
            : ""
    : "";
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const favoriteCount = useFavoritesStore((state) => state.productIds.length);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 0);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => menuTriggerRef.current?.focus());
  }, []);

  return (
    <>
      <header className={`site-header sticky top-0 z-50 border-b border-line transition-shadow ${isScrolled ? "shadow-[var(--shadow-soft)]" : ""}`}>
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
          <button
            ref={menuTriggerRef}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-pill)] hover:bg-surface lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            type="button"
          >
            <Menu aria-hidden="true" size={23} />
          </button>

          <Link aria-label="KORA MODE, accueil" className="shrink-0 leading-none" href="/">
            <span className="font-heading text-2xl font-extrabold tracking-[-0.04em] sm:text-[28px]">{modeBrand.logoText}</span>
            <span className="ml-1.5 text-[10px] font-bold tracking-[0.12em]">{modeBrand.logoDescriptor}</span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-sm font-medium xl:gap-9">
              {modeBrand.navLinks.map((link) => (
                <li key={link.label}>
                  <Link aria-current={activeNavLabel === link.label ? "page" : undefined} className={`rounded-sm py-2 transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 ${activeNavLabel === link.label ? "font-bold text-primary underline underline-offset-8" : ""}`} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <button aria-label="Ouvrir la recherche" className="relative grid size-11 place-items-center rounded-[var(--radius-pill)] text-ink hover:bg-surface" onClick={() => setSearchOpen(true)} title="Rechercher" type="button"><Search aria-hidden="true" size={20} strokeWidth={1.8} /></button>
            <CountLink href="/favoris" label="Favoris" count={favoriteCount}><Heart aria-hidden="true" size={20} strokeWidth={1.8} /></CountLink>
            <div className="hidden sm:block"><CountLink href="/compte" label="Mon compte"><UserRound aria-hidden="true" size={20} strokeWidth={1.8} /></CountLink></div>
            <CountLink href="/panier" label="Panier" count={cartCount}><ShoppingBag aria-hidden="true" size={20} strokeWidth={1.8} /></CountLink>
          </div>
        </div>
      </header>
      <MobileMenu
        links={modeBrand.navLinks}
        onClose={closeMobileMenu}
        open={mobileMenuOpen}
      />
      <SearchOverlay onClose={() => setSearchOpen(false)} open={searchOpen} />
    </>
  );
}