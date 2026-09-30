"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Copy, Search, SlidersHorizontal, X } from "lucide-react";
import { products } from "@/brands/mode/products";
import { buildQuery, filterProducts, readCatalogFilters, sortProducts, type CatalogFilters, type CatalogQueryPatch } from "@/core/lib/catalog";
import { useCampaign } from "@/providers/CampaignProvider";
import { isOfferActive } from "@/core/lib/promo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { useToast } from "@/components/ui/ToastProvider";

const pageSize = 12;
const filterKeys = ["q", "categorie", "genre", "sous", "prix_min", "prix_max", "taille", "couleur", "promo", "stock", "tri"] as const;
const categoryOptions = [{ value: "vetements", label: "Vêtements" }, { value: "accessoires", label: "Accessoires" }];
const genderOptions = [{ value: "femme", label: "Femme" }, { value: "homme", label: "Homme" }, { value: "mixte", label: "Mixte" }];
const subcategoryOptions = ["Vestes", "Pantalons", "Hauts", "Jeans", "Sacs", "Chaussures"];
const sortOptions = [
  ["pertinence", "Pertinence"], ["nouveautes", "Nouveautés"], ["prix-croissant", "Prix croissant"],
  ["prix-decroissant", "Prix décroissant"], ["populaires", "Populaires"], ["meilleures-remises", "Meilleures remises"],
] as const;

function getCatalogTitle(filters: CatalogFilters) {
  if (filters.promo) return "Promos";
  if (filters.tri === "nouveautes" && !filters.categorie && !filters.genre) return "Nouveautés";
  if (filters.categorie === "vetements" && filters.genre) {
    const gender = genderOptions.find((option) => option.value === filters.genre)?.label.toLocaleLowerCase("fr-BJ");
    return `Vêtements ${gender}`;
  }
  if (filters.categorie === "accessoires") return "Accessoires";
  if (filters.genre) return genderOptions.find((option) => option.value === filters.genre)?.label ?? "Boutique";
  if (filters.categorie === "vetements") return "Vêtements";
  return "Toute la collection";
}

function getActiveFilterCount(filters: CatalogFilters) {
  return [filters.categorie, filters.genre, filters.sous, filters.prix_min || filters.prix_max, filters.taille, filters.couleur, filters.promo, filters.stock].filter(Boolean).length;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="border-b border-line pb-3 last:border-0">
      <button aria-expanded={open} className="flex min-h-11 w-full items-center justify-between text-left text-sm font-semibold" onClick={() => setOpen((current) => !current)} type="button">
        {title}<ChevronDown aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} size={17} />
      </button>
      <AnimatePresence initial={false}>
        {open ? <motion.div animate={{ height: "auto", opacity: 1 }} className="overflow-hidden pb-2" exit={{ height: 0, opacity: 0 }} initial={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}>{children}</motion.div> : null}
      </AnimatePresence>
    </section>
  );
}

function FilterChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button aria-pressed={active} className={`inline-flex min-h-10 items-center justify-center rounded-[var(--radius-pill)] border px-3 text-sm font-medium transition-colors ${active ? "border-ink bg-ink text-surface" : "border-line bg-surface text-ink hover:bg-surface-soft"}`} onClick={onClick} type="button">{children}</button>;
}

function FilterToggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <button aria-checked={checked} className="flex min-h-11 w-full items-center justify-between gap-3 text-sm" onClick={() => onChange(!checked)} role="switch" type="button">
      {label}
      <span className={`relative h-6 w-11 shrink-0 rounded-[var(--radius-pill)] transition-colors ${checked ? "bg-primary" : "bg-line"}`}>
        <span className={`absolute top-1 size-4 rounded-full bg-surface shadow-[var(--shadow-soft)] transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </span>
    </button>
  );
}

function isLightColor(hex: string) {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return (red * 299 + green * 587 + blue * 114) / 1000 > 180;
}

function CatalogFilterControls({
  value,
  onChange,
  onPriceRange,
  idPrefix,
}: {
  value: CatalogFilters;
  onChange: <K extends keyof CatalogFilters>(key: K, nextValue: CatalogFilters[K]) => void;
  onPriceRange: (minimum: string, maximum: string) => void;
  idPrefix: string;
}) {
  const sizes = Array.from(new Set(products.flatMap((product) => product.sizes)));
  const colors = Array.from(new Map(products.flatMap((product) => product.colors.map((color) => [color.name, color] as const))).values());

  return (
    <div className="grid gap-1">
      <FilterSection title="Catégorie">
        <div className="flex flex-wrap gap-2 pt-1">
          {categoryOptions.map((option) => <FilterChip active={value.categorie === option.value} key={option.value} onClick={() => onChange("categorie", value.categorie === option.value ? "" : option.value)}>{option.label}</FilterChip>)}
        </div>
      </FilterSection>

      <FilterSection title="Genre">
        <div className="flex flex-wrap gap-2 pt-1">
          {genderOptions.map((option) => <FilterChip active={value.genre === option.value} key={option.value} onClick={() => onChange("genre", value.genre === option.value ? "" : option.value)}>{option.label}</FilterChip>)}
        </div>
      </FilterSection>

      <FilterSection title="Sous-catégorie">
        <div className="flex flex-wrap gap-2 pt-1">
          {subcategoryOptions.map((option) => <FilterChip active={value.sous === option} key={option} onClick={() => onChange("sous", value.sous === option ? "" : option)}>{option}</FilterChip>)}
        </div>
      </FilterSection>

      <FilterSection title="Prix (FCFA)">
        <div className="grid grid-cols-2 gap-2 pt-1">
          {([["prix_min", "Min"], ["prix_max", "Max"]] as const).map(([key, label]) => (
            <label className="grid gap-1 text-xs text-muted" htmlFor={`${idPrefix}-${key}`} key={key}>
              {label}
              <span className="relative">
                <input className="h-10 w-full min-w-0 rounded-[var(--radius-button)] border border-line bg-surface px-2 pr-9 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" id={`${idPrefix}-${key}`} inputMode="numeric" onChange={(event) => onChange(key, event.target.value)} type="number" value={value[key]} />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px]">FCFA</span>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterChip active={value.prix_min === "" && value.prix_max === "19999"} onClick={() => onPriceRange("", "19999")}>Moins de 20 000</FilterChip>
          <FilterChip active={value.prix_min === "20000" && value.prix_max === "30000"} onClick={() => onPriceRange("20000", "30000")}>20 000 – 30 000</FilterChip>
          <FilterChip active={value.prix_min === "30001" && value.prix_max === ""} onClick={() => onPriceRange("30001", "")}>Plus de 30 000</FilterChip>
        </div>
      </FilterSection>

      <FilterSection title="Taille">
        <div className="flex flex-wrap gap-2 pt-1">
          {sizes.map((size) => <FilterChip active={value.taille === size} key={size} onClick={() => onChange("taille", value.taille === size ? "" : size)}>{size}</FilterChip>)}
        </div>
      </FilterSection>

      <FilterSection title="Couleur">
        <div className="grid grid-cols-4 gap-x-2 gap-y-3 pt-1">
          {colors.map((color) => {
            const selected = value.couleur === color.name;
            return (
              <button aria-label={`Couleur ${color.name}`} aria-pressed={selected} className="flex min-h-14 flex-col items-center justify-center gap-1" key={color.name} onClick={() => onChange("couleur", selected ? "" : color.name)} type="button">
                <span className={`relative grid size-8 place-items-center rounded-full ${isLightColor(color.hex) ? "border border-line" : ""} ${selected ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""}`} style={{ backgroundColor: color.hex }}>
                  {selected ? <Check aria-hidden="true" className={isLightColor(color.hex) ? "text-ink" : "text-surface"} size={15} strokeWidth={3} /> : null}
                </span>
                <span className="max-w-full truncate text-[11px] text-muted">{color.name}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Disponibilité">
        <div className="grid gap-1 pt-1">
          <FilterToggle checked={value.promo} label="En promotion" onChange={(checked) => onChange("promo", checked)} />
          <FilterToggle checked={value.stock} label="En stock" onChange={(checked) => onChange("stock", checked)} />
        </div>
      </FilterSection>
    </div>
  );
}

function CatalogSkeleton() {
  return <div aria-hidden="true" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div className="card !p-2 sm:!p-3" key={index}><div className="aspect-[4/5] animate-pulse rounded-[var(--radius-button)] bg-surface-soft" /><div className="mt-3 h-4 animate-pulse rounded bg-surface-soft" /><div className="mt-2 h-5 w-2/3 animate-pulse rounded bg-surface-soft" /><div className="mt-3 h-11 animate-pulse rounded-[var(--radius-button)] bg-surface-soft" /></div>)}</div>;
}

function SortDropdown({ value, onChange, className = "" }: { value: string; onChange: (value: string) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const selected = sortOptions.find(([option]) => option === value)?.[1] ?? "Pertinence";

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className={`relative ${className}`}>
      <button aria-controls="catalog-sort-options" aria-expanded={open} aria-haspopup="listbox" className="flex min-h-11 w-full items-center justify-between gap-2 rounded-[var(--radius-button)] border border-line bg-surface px-3 text-sm font-medium lg:min-w-[190px]" onClick={() => setOpen((current) => !current)} type="button">
        <span>{selected}</span><ChevronDown aria-hidden="true" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} size={17} />
      </button>
      <AnimatePresence>
        {open ? <motion.div animate={{ opacity: 1, y: 0 }} className="absolute right-0 top-[calc(100%+8px)] z-40 w-full min-w-[220px]" exit={{ opacity: 0, y: -4 }} initial={{ opacity: 0, y: -4 }}><Card className="grid gap-1 !p-2 shadow-[var(--shadow-popover)]" id="catalog-sort-options" role="listbox" aria-label="Trier les articles">{sortOptions.map(([option, label]) => <button aria-selected={value === option} className={`flex min-h-10 items-center justify-between rounded-[var(--radius-button)] px-3 text-left text-sm ${value === option ? "bg-surface-soft font-semibold text-ink" : "text-muted hover:bg-surface-soft hover:text-ink"}`} key={option} onClick={() => { onChange(option); setOpen(false); }} role="option" type="button">{label}{value === option ? <Check aria-hidden="true" size={16} /> : null}</button>)}</Card></motion.div> : null}
      </AnimatePresence>
    </div>
  );
}

export function CatalogClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = readCatalogFilters(new URLSearchParams(searchParams.toString()));
  const { campaign } = useCampaign();
  const { showToast } = useToast();
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(filters);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const [isPending, startTransition] = useTransition();
  const filteredProducts = sortProducts(filterProducts(products, filters), filters.tri);
  const activeCount = getActiveFilterCount(filters);
  const activeQuery = searchParams.toString();

  useEffect(() => {
    window.dispatchEvent(new Event("kora:location-change"));
  }, [activeQuery]);

  useEffect(() => {
    if (!filterSheetOpen) return;
    const previousOverflow = document.body.style.overflow;
    const triggerButton = filterButtonRef.current;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(sheetRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFilterSheetOpen(false);
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.requestAnimationFrame(() => triggerButton?.focus());
    };
  }, [filterSheetOpen]);

  const updateQuery = useCallback((patch: CatalogQueryPatch) => {
    const next = buildQuery(new URLSearchParams(searchParams.toString()), patch);
    setVisibleCount(pageSize);
    startTransition(() => router.replace(`${pathname}${next ? `?${next}` : ""}`, { scroll: false }));
  }, [pathname, router, searchParams]);

  function updateFilter<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) {
    updateQuery({ [key]: value });
  }

  function updatePriceRange(minimum: string, maximum: string) {
    updateQuery({ prix_min: minimum, prix_max: maximum });
  }

  function updateDraft<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    const reset = Object.fromEntries(filterKeys.map((key) => [key, ""])) as Record<string, string>;
    updateQuery(reset);
    setDraftFilters(readCatalogFilters(new URLSearchParams()));
  }

  const title = getCatalogTitle(filters);
  const activeChips = [
    filters.q ? { key: "q", label: `Recherche : ${filters.q}`, value: "" } : null,
    filters.categorie ? { key: "categorie", label: filters.categorie === "vetements" ? "Vêtements" : "Accessoires", value: "" } : null,
    filters.genre ? { key: "genre", label: genderOptions.find((item) => item.value === filters.genre)?.label ?? filters.genre, value: "" } : null,
    filters.sous ? { key: "sous", label: filters.sous, value: "" } : null,
    filters.taille ? { key: "taille", label: `Taille ${filters.taille}`, value: "" } : null,
    filters.couleur ? { key: "couleur", label: filters.couleur, value: "" } : null,
    filters.promo ? { key: "promo", label: "Promotions", value: false } : null,
    filters.stock ? { key: "stock", label: "En stock", value: false } : null,
    filters.prix_min || filters.prix_max ? { key: "prix_min", label: `Prix ${filters.prix_min || "0"} – ${filters.prix_max || "∞"} FCFA`, value: "" } : null,
  ].filter((chip): chip is { key: string; label: string; value: string | boolean } => chip !== null);
  const previewCount = filterProducts(products, draftFilters).length;

  const offerActive = isOfferActive(campaign.flashOffer.endsAt);

  async function copyCampaignCode() {
    if (!isOfferActive(campaign.flashOffer.endsAt)) {
      showToast("Cette offre est terminée.");
      return;
    }
    try {
      await navigator.clipboard.writeText(campaign.promoCode.code);
      showToast("Code copié");
    } catch {
      showToast("Copie indisponible");
    }
  }

  return (
    <main className="pb-0">
      <section className="campaign-block" aria-label={`Campagne ${campaign.name}`}>
        <Container className="flex min-h-12 flex-wrap items-center justify-between gap-3 py-2 text-sm">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-semibold">{campaign.name}</span>
            <span className="text-campaign-ink/85">{offerActive ? `Code ${campaign.promoCode.code} : -${campaign.promoCode.percent}% à la commande` : `Campagne ${campaign.name} terminée · sélection consultable sans offre`}</span>
          </div>
          {offerActive ? <button className="campaign-accent inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-pill)] px-3 text-xs font-semibold" onClick={copyCampaignCode} type="button"><Copy aria-hidden="true" size={14} />Copier le code</button> : null}
        </Container>
      </section>
      <Container className="py-7 pb-2 sm:py-10">
        <nav aria-label="Fil d’Ariane" className="mb-4 text-sm text-muted"><Link className="hover:text-primary" href="/">Accueil</Link><span aria-hidden="true" className="mx-2">/</span><span className="text-ink">Boutique</span></nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">La sélection KORA</p><h1 className="mt-1 font-heading font-extrabold">{title}</h1><p aria-live="polite" className="mt-2 text-sm text-muted">{filteredProducts.length} article{filteredProducts.length === 1 ? "" : "s"}</p><p className="mt-1 text-xs text-muted">Notes et niveaux de stock affichés pour la démonstration.</p></div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 lg:flex lg:items-center lg:gap-3">
          <div className="relative col-span-2 min-w-0 lg:max-w-[420px] lg:flex-1">
            <label className="sr-only" htmlFor="catalog-search">Rechercher dans la boutique</label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input className="min-h-11 w-full rounded-[var(--radius-pill)] border border-line bg-surface pl-10 pr-10 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" id="catalog-search" onChange={(event) => updateFilter("q", event.target.value)} placeholder="Rechercher un article…" type="search" value={filters.q} />
            {filters.q ? <button aria-label="Effacer la recherche" className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface-soft hover:text-ink" onClick={() => updateFilter("q", "")} type="button"><X aria-hidden="true" size={16} /></button> : null}
          </div>
          <button className="col-start-1 row-start-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-line bg-surface px-3 text-sm font-semibold lg:hidden" onClick={() => { setDraftFilters(filters); setFilterSheetOpen(true); }} ref={filterButtonRef} type="button"><SlidersHorizontal aria-hidden="true" size={17} />Filtres ({activeCount})</button>
          <SortDropdown className="col-start-2 row-start-2 w-full lg:ml-auto lg:w-auto" onChange={(tri) => updateFilter("tri", tri)} value={filters.tri} />
        </div>
        <div className="mt-6 flex items-start gap-6">
          <aside className="hidden w-[250px] shrink-0 lg:block"><Card className="sticky top-28 !p-4"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Filtres</h2><button className="text-sm font-semibold text-primary" onClick={resetFilters} type="button">Réinitialiser</button></div><CatalogFilterControls idPrefix="desktop-catalog" onChange={updateFilter} onPriceRange={updatePriceRange} value={filters} /></Card></aside>
          <div className="min-w-0 flex-1">
            {activeChips.length ? <div aria-label="Filtres actifs" className="mb-4 flex flex-wrap gap-2">{activeChips.map((chip) => <button className="inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-pill)] bg-surface-soft px-3 text-sm" key={chip.key} onClick={() => updateQuery({ [chip.key]: chip.value, ...(chip.key === "prix_min" ? { prix_max: "" } : {}) })} type="button">{chip.label}<span aria-hidden="true">×</span></button>)}<button className="min-h-9 px-2 text-sm font-semibold text-primary" onClick={resetFilters} type="button">Tout effacer</button></div> : null}
            {isPending ? <CatalogSkeleton /> : filteredProducts.length ? <><div className={`grid ${filteredProducts.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4`}>{filteredProducts.slice(0, visibleCount).map((product) => <ProductCard key={product.id} product={product} />)}</div><div aria-label={`${Math.min(visibleCount, filteredProducts.length)} articles affichés sur ${filteredProducts.length}`} className="mx-auto mt-4 max-w-md sm:mt-6"><div aria-hidden="true" className="h-1 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${(Math.min(visibleCount, filteredProducts.length) / filteredProducts.length) * 100}%` }} /></div><p className="mt-2 text-center text-sm text-muted">{Math.min(visibleCount, filteredProducts.length)} sur {filteredProducts.length} articles</p></div>{visibleCount < filteredProducts.length ? <div className="mt-4 flex justify-center"><Button onClick={() => setVisibleCount((count) => count + pageSize)} variant="secondary">Charger plus</Button></div> : null}</> : <div className="py-8"><Card className="mx-auto max-w-xl text-center"><h2 className="font-heading font-bold">Aucun article ne correspond à votre recherche</h2><p className="mt-2 text-sm text-muted">Essayez d’élargir vos filtres ou explorez ces pièces.</p><Button className="mt-4" onClick={resetFilters}>Réinitialiser les filtres</Button></Card><h3 className="mt-8 font-heading font-bold">Vous pourriez aimer</h3><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div></div>}
          </div>
        </div>
      </Container>
      <AnimatePresence>
        {filterSheetOpen ? <><motion.div animate={{ opacity: 1 }} aria-hidden="true" className="fixed inset-0 z-[90] bg-ink/50 backdrop-blur-sm" exit={{ opacity: 0 }} initial={{ opacity: 0 }} onClick={() => setFilterSheetOpen(false)} /><motion.section animate={{ y: 0 }} aria-labelledby="mobile-filters-title" aria-modal="true" className="fixed inset-x-0 bottom-0 z-[91] flex max-h-[90dvh] flex-col rounded-t-[var(--radius-card)] bg-surface shadow-[var(--shadow-popover)]" exit={{ y: "100%" }} initial={{ y: "100%" }} ref={sheetRef} role="dialog"><header className="flex items-center justify-between border-b border-line px-5 py-4"><h2 className="font-heading font-bold" id="mobile-filters-title">Filtres</h2><button aria-label="Fermer les filtres" className="grid size-10 place-items-center rounded-full bg-surface-soft" onClick={() => setFilterSheetOpen(false)} type="button"><X aria-hidden="true" size={18} /></button></header><div className="catalog-filter-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5"><CatalogFilterControls idPrefix="mobile-catalog" onChange={updateDraft} onPriceRange={(minimum, maximum) => setDraftFilters((current) => ({ ...current, prix_min: minimum, prix_max: maximum }))} value={draftFilters} /></div><footer className="relative grid grid-cols-[1fr_2fr] gap-3 border-t border-line bg-surface px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)] before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-6 before:bg-gradient-to-t before:from-surface before:to-transparent"><Button className="!min-h-12 !pl-4" fullWidth onClick={() => { resetFilters(); setFilterSheetOpen(false); }} variant="ghost">Réinitialiser</Button><Button className="!min-h-12 !whitespace-nowrap !text-sm !font-semibold !text-white" fullWidth onClick={() => { updateQuery(draftFilters as unknown as CatalogQueryPatch); setFilterSheetOpen(false); }}>Voir {previewCount} articles</Button></footer></motion.section></> : null}
      </AnimatePresence>
    </main>
  );
}

export function CatalogPageFallback() {
  return <main className="py-8"><Container><CatalogSkeleton /></Container></main>;
}
