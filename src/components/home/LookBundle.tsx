"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { products } from "@/brands/mode/products";
import { images } from "@/brands/mode/images";
import { formatFCFA } from "@/core/lib/format";
import { useCartStore } from "@/core/store/cart";
import { useToast } from "@/components/ui/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SmartImage } from "@/components/ui/SmartImage";

const lookProductSlugs = ["blazer-oversize-nova", "pantalon-wide-leg-atlas", "sneakers-blanc-studio"];

export function LookBundle() {
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();
  const look = lookProductSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product) => product !== undefined);
  const total = look.reduce((sum, product) => sum + product.price, 0);
  const bundlePrice = Math.round(total * 0.9);

  function addLook() {
    setAdding(true);
    look.forEach((product) => {
      const size = product.sizes.includes("M") ? "M" : product.sizes[0] ?? "Unique";
      addItem({
        productId: product.id,
        quantity: 1,
        size,
        color: product.colors[0]?.name,
        bundleId: "complete-look-10",
        discountPercent: 10,
      });
    });
    setAdding(false);
    showToast("Le look a été ajouté à votre panier.");
  }

  return (
    <section className="bg-surface-soft py-10 sm:py-14" id="look-complet">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5">
          <p className="eyebrow">Le look KORA</p>
          <h2 className="mt-1 font-heading font-bold">Complétez votre look</h2>
        </div>
        <Card className="grid gap-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {look.map((product) => (
              <Link className="min-w-0" href={`/produit/${product.slug}`} key={product.id}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-button)] bg-surface-soft">
                  <SmartImage alt={product.name} focus={images.focus.products[product.id as keyof typeof images.focus.products] ?? "50% 10%"} sizes="(max-width: 639px) 28vw, 18vw" src={product.images[0] ?? ""} />
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-semibold sm:text-sm">{product.name}</p>
                <p className="mt-1 text-xs text-muted">{formatFCFA(product.price)}</p>
              </Link>
            ))}
          </div>
          <div className="lg:pl-4">
            <span className="inline-flex rounded-[var(--radius-pill)] bg-surface-mint px-3 py-1 text-sm font-bold text-primary">-10% sur le look</span>
            <p className="mt-4 text-sm text-muted">Les pièces qui s’accordent, réunies en une seule sélection.</p>
            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              <strong className="text-xl">{formatFCFA(bundlePrice)}</strong>
              <del className="text-sm text-promo">{formatFCFA(total)}</del>
            </div>
            <Button className="mt-5 w-full sm:w-auto" loading={adding} onClick={addLook}>
              Ajouter le look au panier <ArrowRight aria-hidden="true" size={17} />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}