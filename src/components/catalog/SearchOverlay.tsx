"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { products } from "@/brands/mode/products";
import { formatFCFA } from "@/core/lib/format";
import { normalizeCatalogText } from "@/core/lib/catalog";
import { SmartImage } from "@/components/ui/SmartImage";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const normalized = normalizeCatalogText(query);
  const suggestions = normalized
    ? products.filter((product) => normalizeCatalogText(`${product.name} ${product.category} ${product.subcategory} ${product.tags.join(" ")}`).includes(normalized)).slice(0, 5)
    : [];

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", onKeyDown); };
  }, [onClose, open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/boutique${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button animate={{ opacity: 1 }} aria-label="Fermer la recherche" className="fixed inset-0 z-[95] bg-ink/45 backdrop-blur-sm" exit={{ opacity: 0 }} initial={{ opacity: 0 }} onClick={onClose} type="button" />
          <motion.section animate={{ opacity: 1, y: 0 }} aria-label="Recherche dans la boutique" aria-modal="true" className="fixed inset-x-0 top-0 z-[96] max-h-[85dvh] overflow-y-auto rounded-b-[var(--radius-card)] bg-surface p-4 shadow-[var(--shadow-popover)] sm:mx-auto sm:mt-5 sm:max-w-2xl sm:p-6" exit={{ opacity: 0, y: -12 }} initial={{ opacity: 0, y: -12 }} role="dialog">
            <form className="flex items-center gap-3" onSubmit={submit}>
              <Search aria-hidden="true" className="shrink-0 text-muted" size={21} />
              <label className="sr-only" htmlFor="global-search">Rechercher un article</label>
              <input autoComplete="off" className="min-h-12 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted" id="global-search" onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un article…" ref={inputRef} type="search" value={query} />
              <button aria-label="Fermer la recherche" className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-soft" onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button>
            </form>
            {suggestions.length ? (
              <ul aria-label="Suggestions" className="mt-4 grid gap-2">
                {suggestions.map((product) => (
                  <li key={product.id}>
                    <Link className="flex min-h-[72px] items-center gap-3 rounded-[var(--radius-button)] p-2 hover:bg-surface-soft" href={`/produit/${product.slug}`} onClick={onClose}>
                      <span className="relative block size-14 shrink-0 overflow-hidden rounded-[var(--radius-button)] bg-surface-soft"><SmartImage alt="" sizes="56px" src={product.images[0] ?? ""} /></span>
                      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{product.name}</span><span className="mt-1 block text-sm text-muted">{formatFCFA(product.price)}</span></span>
                      <ArrowRight aria-hidden="true" className="shrink-0 text-muted" size={17} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : query.trim() ? <p className="mt-4 text-sm text-muted">Aucune suggestion pour le moment.</p> : null}
            <button className="mt-4 min-h-11 w-full rounded-[var(--radius-button)] bg-primary px-4 text-sm font-bold text-primary-ink" onClick={() => { router.push(`/boutique${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`); onClose(); }} type="button">Voir tous les résultats</button>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}