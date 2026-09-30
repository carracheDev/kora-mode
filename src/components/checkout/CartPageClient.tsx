"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useCampaign } from "@/providers/CampaignProvider";
import { products } from "@/brands/mode/products";
import { images } from "@/brands/mode/images";
import { formatFCFA } from "@/core/lib/format";
import { getCartItemTotal, getCartSubtotal, getEligibleSubtotal, getPromoDiscount } from "@/core/lib/pricing";
import { useCartStore } from "@/core/store/cart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";

type PromoState = { code: string; message: string; valid: boolean };

export function CartPageClient() {
  const hydrated = useSyncExternalStore(
    (onChange) => {
      const unsubscribeHydration = useCartStore.persist.onHydrate(onChange);
      const unsubscribeFinish = useCartStore.persist.onFinishHydration(onChange);
      return () => {
        unsubscribeHydration();
        unsubscribeFinish();
      };
    },
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
  const [promoInput, setPromoInput] = useState("");
  const [promoState, setPromoState] = useState<PromoState | null>(null);
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { campaign } = useCampaign();

  const productById = useMemo(() => new Map(products.map((product) => [product.id, product])), []);
  const getProduct = (productId: string) => productById.get(productId);
  const subtotal = getCartSubtotal(items, getProduct);
  const eligibleSubtotal = getEligibleSubtotal(items, campaign.productIds, getProduct);
  const promoDiscount = promoState?.valid ? getPromoDiscount(subtotal, eligibleSubtotal, campaign.promoCode.percent) : 0;
  const total = Math.max(0, subtotal - promoDiscount);
  const checkoutHref = `/checkout${promoState?.valid ? `?code=${encodeURIComponent(campaign.promoCode.code)}` : ""}`;

  function applyPromo() {
    const enteredCode = promoInput.trim().toLocaleUpperCase("fr-BJ");
    if (!enteredCode || enteredCode !== campaign.promoCode.code.toLocaleUpperCase("fr-BJ")) {
      setPromoState({ code: enteredCode, valid: false, message: "Ce code ne correspond pas à la campagne active." });
      return;
    }
    if (eligibleSubtotal <= 0) {
      setPromoState({ code: enteredCode, valid: false, message: "Aucun article de la campagne active dans le panier." });
      return;
    }
    setPromoState({ code: enteredCode, valid: true, message: `${campaign.promoCode.code} appliqué aux articles éligibles.` });
  }



  if (!hydrated) {
    return <main className="py-10 sm:py-14"><Container><p aria-live="polite" className="text-muted">Chargement du panier…</p></Container></main>;
  }

  return (
    <main className="py-8 sm:py-12">
      <Container>
        <Link className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary" href="/boutique"><ArrowLeft aria-hidden="true" size={17} />Continuer mes achats</Link>
        <div className="mb-7">
          <p className="eyebrow">Votre sélection</p>
          <h1 className="mt-2 font-heading font-extrabold">Mon panier</h1>
          <p className="mt-2 text-sm text-muted">{items.reduce((count, item) => count + item.quantity, 0)} article{items.reduce((count, item) => count + item.quantity, 0) === 1 ? "" : "s"}</p>
        </div>

        {items.length === 0 ? (
          <Card className="grid justify-items-center gap-4 py-12 text-center sm:py-16">
            <p className="font-heading text-xl font-bold">Votre panier est vide</p>
            <p className="max-w-md text-sm text-muted">Parcourez la sélection KORA MODE et ajoutez les pièces qui vous plaisent.</p>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-primary px-5 text-sm font-bold text-primary-ink hover:bg-primary-hover" href="/boutique">Découvrir la boutique</Link>
          </Card>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
            <section aria-label="Articles du panier" className="grid gap-3">
              {items.map((item, index) => {
                const product = productById.get(item.productId);
                if (!product) {
                  return <Card className="flex items-center justify-between gap-4" key={`${item.productId}-${item.size}-${item.color}-${index}`}><p className="text-sm text-muted">Cet article n’est plus disponible dans le catalogue.</p><button aria-label="Supprimer cet article" className="grid size-11 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-soft hover:text-error" onClick={() => removeItem(item.productId, item.size, item.color, item.bundleId)} type="button"><Trash2 aria-hidden="true" size={18} /></button></Card>;
                }
                const lineTotal = getCartItemTotal(item, product);
                const productQuantity = items.reduce((sum, cartItem) => cartItem.productId === item.productId ? sum + cartItem.quantity : sum, 0);
                return (
                  <Card className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 !p-3 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-4 sm:!p-4" key={`${item.productId}-${item.size}-${item.color}-${index}`}>
                    <Link aria-label={`Voir ${product.name}`} className="relative block aspect-[4/5] overflow-hidden rounded-[calc(var(--radius-card)-6px)] bg-surface-soft" href={`/produit/${product.slug}`}>
                      <SmartImage alt={product.name} sizes="112px" src={product.images[0] ?? images.products.placeholder} />
                    </Link>
                    <div className="flex min-w-0 flex-col justify-between gap-3 py-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-muted">{product.category}</p>
                          <Link className="mt-1 line-clamp-2 font-semibold text-ink hover:text-primary" href={`/produit/${product.slug}`}>{product.name}</Link>
                          <p className="mt-1 text-xs text-muted">{[item.size ? `Taille : ${item.size}` : null, item.color ? `Couleur : ${item.color}` : null].filter(Boolean).join(" · ")}</p>
                        </div>
                        <button aria-label={`Supprimer ${product.name} du panier`} className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-soft hover:text-error" onClick={() => removeItem(item.productId, item.size, item.color)} title="Supprimer" type="button"><Trash2 aria-hidden="true" size={17} /></button>
                      </div>
                      <div className="flex flex-wrap items-end justify-between gap-3">
                        <div aria-label="Quantité" className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] border border-line">
                          <button aria-label={`Diminuer la quantité de ${product.name}`} className="grid size-10 place-items-center text-ink disabled:text-muted" disabled={item.quantity <= 1} onClick={() => setQuantity(item.productId, item.quantity - 1, item.size, item.color, item.bundleId)} type="button"><Minus aria-hidden="true" size={15} /></button>
                          <span aria-live="polite" className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button aria-label={`Augmenter la quantité de ${product.name}`} className="grid size-10 place-items-center text-ink disabled:text-muted" disabled={productQuantity >= product.stock} onClick={() => setQuantity(item.productId, item.quantity + 1, item.size, item.color, item.bundleId)} type="button"><Plus aria-hidden="true" size={15} /></button>
                        </div>
                        <p className="text-sm font-bold text-ink">{formatFCFA(lineTotal)}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </section>

            <aside aria-label="Récapitulatif du panier" className="lg:sticky lg:top-24">
              <Card className="grid gap-4">
                <h2 className="font-heading text-xl font-bold">Récapitulatif</h2>
                <form className="grid gap-2" onSubmit={(event) => { event.preventDefault(); applyPromo(); }}>
                  <label className="text-sm font-semibold" htmlFor="cart-promo">Code promo</label>
                  <div className="flex gap-2">
                    <input autoCapitalize="characters" autoComplete="off" className="min-h-11 min-w-0 flex-1 rounded-[var(--radius-button)] border border-line bg-surface px-3 text-sm uppercase text-ink placeholder:normal-case focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" id="cart-promo" onChange={(event) => { setPromoInput(event.target.value); setPromoState(null); }} placeholder="Ex. BF40" value={promoInput} />
                    <Button className="!px-3 !text-sm" type="submit" variant="secondary">Appliquer</Button>
                  </div>
                  <p aria-live="polite" className={`min-h-5 text-xs ${promoState?.valid ? "text-success" : promoState ? "text-error" : "text-muted"}`}>{promoState?.message ?? `Code actif : ${campaign.promoCode.code} (−${campaign.promoCode.percent}% sur la sélection éligible).`}</p>
                </form>
                <div className="grid gap-3 border-t border-line pt-4 text-sm">
                  <div className="flex justify-between gap-3"><span className="text-muted">Sous-total</span><span className="font-semibold">{formatFCFA(subtotal)}</span></div>
                  {promoDiscount > 0 ? <div className="flex justify-between gap-3 text-success"><span>Remise {campaign.promoCode.code}</span><span>−{formatFCFA(promoDiscount)}</span></div> : null}
                  <div className="flex justify-between gap-3"><span className="text-muted">Livraison</span><span className="text-right text-xs text-muted">Confirmée selon la zone</span></div>
                  <div className="flex justify-between gap-3 border-t border-line pt-3 text-base"><span className="font-bold">Total articles</span><span className="font-bold">{formatFCFA(total)}</span></div>
                </div>
                <Link className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-primary px-5 text-center text-sm font-bold text-primary-ink hover:bg-primary-hover" href={checkoutHref}>Passer à la commande</Link>
                <p className="text-xs leading-5 text-muted">Le total final inclura les frais de livraison affichés au checkout.</p>
              </Card>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}
