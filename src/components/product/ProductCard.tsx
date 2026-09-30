"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/core/types";
import { formatFCFA } from "@/core/lib/format";
import { useCartStore } from "@/core/store/cart";
import { useFavoritesStore } from "@/core/store/favorites";
import { images } from "@/brands/mode/images";
import { useToast } from "@/components/ui/ToastProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { ProductVariantSelector, useProductVariantSelection } from "@/components/product/ProductVariantSelector";

const catalogReferenceTime = Date.now();

export function ProductCard({ product }: { product: Product }) {
  const { size, color, setSize, setColor } = useProductVariantSelection();
  const [sheetOpen, setSheetOpen] = useState(false);
  const favorite = useFavoritesStore((state) => state.productIds.includes(product.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const addItem = useCartStore((state) => state.addItem);
  const quantityInCart = useCartStore((state) => state.items.reduce((sum, item) => item.productId === product.id ? sum + item.quantity : sum, 0));
  const { showToast } = useToast();
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const createdAt = Date.parse(product.createdAt);
  const isNew = Number.isFinite(createdAt) && catalogReferenceTime >= createdAt && catalogReferenceTime - createdAt < 30 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (!sheetOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sheetOpen]);

  function addToCart() {
    if (quantityInCart >= product.stock) {
      showToast("Le stock disponible pour cet article est déjà dans votre panier.");
      return;
    }
    addItem({ productId: product.id, quantity: 1, size, color: color || undefined });
    setSheetOpen(false);
    showToast(`${product.name} ajouté au panier.`);
  }

  function toggle() {
    toggleFavorite(product.id);
    showToast(
      favorite ? `${product.name} retiré des favoris.` : `${product.name} ajouté aux favoris.`,
      "favorite",
    );
  }

  return (
    <>
      <Card className="group relative flex h-full flex-col !p-2 sm:!p-3" variant="interactive">
  		<article className="flex h-full min-w-0 flex-1 flex-col">
          <Link aria-label={`Voir ${product.name}`} className="absolute inset-0 z-[1] rounded-[var(--radius-card)]" href={`/produit/${product.slug}`} />
          <div className="relative aspect-square overflow-hidden rounded-[calc(var(--radius-card)-6px)] bg-surface-soft sm:aspect-[4/5]">
            <SmartImage
              alt={product.name}
              className="transition-transform duration-300 group-hover:scale-[1.02]"
              focus={images.focus.products[product.id as keyof typeof images.focus.products] ?? "50% 10%"}
              priority={false}
              sizes="(max-width: 639px) 44vw, (max-width: 1023px) 30vw, 22vw"
              src={product.images[0] ?? images.products.placeholder}
            />
            <div className="absolute left-2 top-2 flex max-w-[75%] flex-wrap gap-1.5 sm:left-3 sm:top-3">
              {discount > 0 ? <Badge variant="promo">-{discount}%</Badge> : isNew ? <Badge variant="new">Nouveau</Badge> : null}
            </div>
            <button
              aria-label={favorite ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
              aria-pressed={favorite}
              className="absolute right-2 top-2 z-[2] grid size-10 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-soft)] hover:text-primary sm:right-3 sm:top-3"
              onClick={toggle}
              type="button"
            >
              <Heart aria-hidden="true" className={favorite ? "fill-primary text-primary" : ""} size={19} />
            </button>
          </div>

          <div className="pointer-events-none relative z-[2] mt-3 flex min-h-5 items-center justify-between gap-2 text-xs">
            <p className="truncate text-muted">{product.category}</p>
            <span aria-label={`Note de démonstration ${product.rating} sur 5`} title="Note fictive de démonstration" className="flex shrink-0 items-center gap-1 font-semibold text-ink">
              <span aria-hidden="true" className="text-star">★</span>{product.rating.toFixed(1)} <span className="text-[10px] font-normal text-muted">démo</span>
            </span>
          </div>

          <h3 className="pointer-events-none relative z-[2] mt-1 line-clamp-2 min-h-[3.1rem] text-base font-semibold leading-[1.55] tracking-normal">{product.name}</h3>

          <div className="relative z-[2] mt-2 flex min-h-8 flex-wrap items-baseline gap-x-2 gap-y-1 pt-2">
            <span className="text-sm font-bold text-ink">{formatFCFA(product.price)}</span>
            {product.oldPrice ? <del className="text-xs text-promo">{formatFCFA(product.oldPrice)}</del> : null}
          </div>

          <p aria-hidden={product.stock >= 5} className="mt-1 min-h-[18px] text-xs text-muted">
            {product.stock < 5 ? `Stock démo · ${product.stock} unité${product.stock === 1 ? "" : "s"}` : ""}
          </p>

          <Button className="relative z-[2] mt-auto w-full !text-sm" disabled={product.stock <= 0 || quantityInCart >= product.stock} onClick={() => setSheetOpen(true)} size="sm" variant="primary">
            {product.stock <= 0 ? "Rupture de stock" : quantityInCart >= product.stock ? "Stock dans le panier" : "Ajouter"}
          </Button>
        </article>
      </Card>

      <AnimatePresence>
        {sheetOpen ? (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Fermer le choix des variantes"
              className="fixed inset-0 z-[100] bg-ink/50 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              type="button"
            />
            <motion.section
              animate={{ y: 0 }}
              aria-labelledby={`add-sheet-title-${product.id}`}
              aria-modal="true"
              className="fixed inset-x-0 bottom-0 z-[101] max-h-[85dvh] overflow-y-auto rounded-t-[var(--radius-card)] bg-surface px-5 pt-5 pb-[calc(env(safe-area-inset-bottom)+24px)] shadow-[var(--shadow-popover)] sm:left-1/2 sm:right-auto sm:bottom-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:translate-y-1/2 sm:rounded-[var(--radius-card)] sm:p-6"
              exit={{ y: "100%" }}
              initial={{ y: "100%" }}
              role="dialog"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Ajouter au panier</p>
                  <h2 className="mt-1 text-xl font-bold" id={`add-sheet-title-${product.id}`}>{product.name}</h2>
                  <p className="mt-1 text-sm font-semibold">{formatFCFA(product.price)}</p>
                </div>
                <button aria-label="Fermer" className="grid size-10 place-items-center rounded-full bg-surface-soft" onClick={() => setSheetOpen(false)} type="button"><X aria-hidden="true" size={19} /></button>
              </div>

              <div className="mt-5">
                <ProductVariantSelector color={color} onColorChange={setColor} onSizeChange={setSize} product={product} size={size} />
              </div>

              <Button className="mt-6 w-full" disabled={!size} onClick={addToCart}>
                Ajouter au panier
              </Button>
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}