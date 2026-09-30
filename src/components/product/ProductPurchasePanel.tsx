"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Minus, Plus, Share2 } from "lucide-react";
import type { Product } from "@/core/types";
import { modeBrand } from "@/brands/mode/brand";
import { formatFCFA } from "@/core/lib/format";
import { buildWhatsAppUrl } from "@/core/lib/whatsapp";
import { useCartStore } from "@/core/store/cart";
import { useFavoritesStore } from "@/core/store/favorites";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/ToastProvider";
import { ProductVariantSelector, useProductVariantSelection } from "@/components/product/ProductVariantSelector";
import { ProductServiceInfo } from "@/components/product/ProductServiceInfo";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { size, color, setSize, setColor } = useProductVariantSelection();
  const [quantity, setQuantity] = useState(1);
  const [mainCtaVisible, setMainCtaVisible] = useState(true);
  const [purchasePanelVisible, setPurchasePanelVisible] = useState(true);
  const purchasePanelRef = useRef<HTMLElement>(null);
  const mainCtaRef = useRef<HTMLDivElement>(null);
  const variantSelectorRef = useRef<HTMLDivElement>(null);
  const favorite = useFavoritesStore((state) => state.productIds.includes(product.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const addItem = useCartStore((state) => state.addItem);
  const quantityInCart = useCartStore((state) => state.items.reduce((sum, item) => item.productId === product.id ? sum + item.quantity : sum, 0));
  const { showToast } = useToast();
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const hasVariants = Boolean(size && color);
  const available = product.stock > 0;
  const quantityLimit = Math.max(product.stock, 1);
  const total = product.price * quantity;
  const whatsappMessage = [
    "Bonjour, je souhaite commander :",
    "",
    `Produit : ${product.name}`,
    `Taille : ${size}`,
    `Couleur : ${color}`,
    `Quantité : ${quantity}`,
    `Prix : ${formatFCFA(total)}`,
  ].join("\n");
  const whatsappUrl = buildWhatsAppUrl(modeBrand.whatsappNumber, whatsappMessage);
  const showStickyCta = available && !mainCtaVisible && purchasePanelVisible;

  useEffect(() => {
    const panel = purchasePanelRef.current;
    const cta = mainCtaRef.current;
    if (!panel || !cta || typeof IntersectionObserver === "undefined") return;
    const panelObserver = new IntersectionObserver(([entry]) => setPurchasePanelVisible(entry.isIntersecting), { threshold: 0 });
    const ctaObserver = new IntersectionObserver(([entry]) => setMainCtaVisible(entry.isIntersecting), { threshold: 0.1 });
    panelObserver.observe(panel);
    ctaObserver.observe(cta);
    return () => {
      panelObserver.disconnect();
      ctaObserver.disconnect();
    };
  }, []);

  function handleStickyCta() {
    if (!hasVariants) {
      variantSelectorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addToCart();
  }

  function addToCart() {
    if (!hasVariants || !available) return;
    if (quantityInCart + quantity > product.stock) {
      showToast(`Stock disponible : ${Math.max(0, product.stock - quantityInCart)} article(s).`);
      return;
    }
    addItem({ productId: product.id, quantity, size, color });
    showToast(`${product.name} ajouté au panier.`);
  }

  async function shareProduct() {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: product.name, text: product.description, url });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        showToast("Partage indisponible");
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Lien copié");
    } catch {
      showToast("Copie indisponible");
    }
  }

  function updateQuantity(next: number) {
    setQuantity(Math.min(quantityLimit, Math.max(1, Math.floor(next))));
  }

  const selectionMessage = !available
    ? "Article indisponible."
    : !size && !color
      ? "Sélectionnez une taille et une couleur pour continuer."
      : !size
        ? "Sélectionnez une taille pour continuer."
        : !color
          ? "Sélectionnez une couleur pour continuer."
          : "";

  return (
    <section ref={purchasePanelRef} className="grid content-start gap-5" aria-label="Acheter ce produit">
      <div>
        <p className="eyebrow">{product.category}</p>
        <h1 className="mt-2 font-heading font-extrabold">{product.name}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-2xl font-bold text-ink">{formatFCFA(product.price)}</span>
          {product.oldPrice ? <del className="text-base text-promo">{formatFCFA(product.oldPrice)}</del> : null}
          {product.oldPrice ? <Badge variant="promo">-{discount}%</Badge> : null}
        </div>
        <p className="mt-3 text-sm text-ink">Note de démonstration : {product.rating.toFixed(1)} / 5</p>
        <p aria-live="polite" className="mt-2 text-sm text-muted">
          {product.stock <= 0 ? "Indisponible dans ce scénario de démonstration" : `Stock de démonstration : ${product.stock} unité${product.stock === 1 ? "" : "s"}${product.stock < 5 ? " · faible" : ""}`}
        </p>
        <p className="mt-4 leading-7 text-muted">{product.description}</p>
      </div>

      <ProductServiceInfo />

      <div id="product-variants" ref={variantSelectorRef}>
        <ProductVariantSelector
          color={color}
          onColorChange={setColor}
          onSizeChange={setSize}
          product={product}
          size={size}
        />
      </div>

      <div>
        <span className="text-sm font-semibold text-ink">Quantité</span>
        <div className="mt-2 inline-flex min-h-11 items-center rounded-[var(--radius-button)] border border-line">
          <button aria-label="Diminuer la quantité" className="grid size-11 place-items-center text-ink disabled:text-muted" disabled={quantity <= 1 || !available} onClick={() => updateQuantity(quantity - 1)} type="button"><Minus aria-hidden="true" size={16} /></button>
          <input aria-label="Quantité" className="w-12 bg-transparent text-center text-ink" disabled={!available} max={product.stock} min={1} step={1} onChange={(event) => updateQuantity(Number(event.target.value) || 1)} type="number" value={quantity} />
          <button aria-label="Augmenter la quantité" className="grid size-11 place-items-center text-ink disabled:text-muted" disabled={quantity >= product.stock || !available} onClick={() => updateQuantity(quantity + 1)} type="button"><Plus aria-hidden="true" size={16} /></button>
        </div>
      </div>

      <p aria-live="polite" className="min-h-5 text-sm text-muted">{selectionMessage}</p>
      <div ref={mainCtaRef}>
        <Button className="w-full" disabled={!hasVariants || !available} onClick={addToCart}>
          Ajouter au panier
        </Button>
      </div>
      <Button className="w-full" disabled={!hasVariants || !available || !whatsappUrl} onClick={() => { if (whatsappUrl) window.open(whatsappUrl, "_blank", "noopener,noreferrer"); }} variant="secondary">
        Commander via WhatsApp
      </Button>
      {!whatsappUrl ? <p className="text-xs text-muted">Numéro WhatsApp de démonstration non configuré.</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button className="!px-3" onClick={() => { toggleFavorite(product.id); showToast(favorite ? "Retiré des favoris." : "Ajouté aux favoris.", "favorite"); }} variant="ghost">
          <Heart aria-hidden="true" className={favorite ? "fill-primary text-primary" : ""} size={18} />
          {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        </Button>
        <Button className="!px-3" onClick={shareProduct} variant="ghost">
          <Share2 aria-hidden="true" size={18} />Partager
        </Button>
      </div>
      <p aria-live="polite" className="text-sm font-semibold text-ink">Total : {formatFCFA(total)}</p>
      {showStickyCta ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 p-3 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-[var(--shadow-popover)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-1 pr-14">
            <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink">{formatFCFA(total)}</span>
            <Button className="min-h-12 flex-1 !text-sm" disabled={!available} onClick={handleStickyCta}>
              {hasVariants ? "Ajouter au panier" : "Choisir mes variantes"}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
