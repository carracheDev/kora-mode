"use client";

import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Smartphone, Wallet } from "lucide-react";
import { products } from "@/brands/mode/products";
import { useCampaign } from "@/providers/CampaignProvider";
import { formatFCFA } from "@/core/lib/format";
import { deliveryOptions } from "@/core/lib/delivery";
import { getCartItemTotal, getCartSubtotal, getEligibleSubtotal, getPromoDiscount } from "@/core/lib/pricing";
import { useCartStore } from "@/core/store/cart";
import { useOrdersStore } from "@/core/store/orders";
import type { Order } from "@/core/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";

function createOrderId() {
  return `KORA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

const paymentOptions = [
  { id: "mtn", label: "MTN Mobile Money", type: "mobile" },
  { id: "moov", label: "Moov Money", type: "mobile" },
  { id: "celtiis", label: "Celtiis", type: "mobile" },
  { id: "cod", label: "Paiement à la livraison", type: "delivery" },
] as const;

export function CheckoutClient({ initialCode }: { initialCode: string }) {
  const router = useRouter();
  const hydrated = useSyncExternalStore(
    (onChange) => {
      const unsubscribeHydration = useCartStore.persist.onHydrate(onChange);
      const unsubscribeFinish = useCartStore.persist.onFinishHydration(onChange);
      return () => { unsubscribeHydration(); unsubscribeFinish(); };
    },
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrdersStore((state) => state.addOrder);
  const { campaign } = useCampaign();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState<string>(deliveryOptions[0].city);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentOptions)[number]["id"]>("cod");
  const [promoCode, setPromoCode] = useState(initialCode.toUpperCase());
  const [promoApplied, setPromoApplied] = useState(Boolean(initialCode));
  const [promoMessage, setPromoMessage] = useState("");
  const [formError, setFormError] = useState("");

  const productById = useMemo(() => new Map(products.map((product) => [product.id, product])), []);
  const validItems = items.filter((item) => productById.has(item.productId));
  const stockIssues = [...new Set(validItems.map((item) => item.productId))].filter((productId) => {
    const product = productById.get(productId)!;
    const requested = validItems.reduce((sum, item) => item.productId === productId ? sum + item.quantity : sum, 0);
    return product.stock <= 0 || requested > product.stock;
  });
  const getProduct = (productId: string) => productById.get(productId);
  const subtotal = getCartSubtotal(validItems, getProduct);
  const eligibleSubtotal = getEligibleSubtotal(validItems, campaign.productIds, getProduct);
  const validPromo = promoApplied && promoCode.trim().toUpperCase() === campaign.promoCode.code.toUpperCase() && eligibleSubtotal > 0;
  const discount = validPromo ? getPromoDiscount(subtotal, eligibleSubtotal, campaign.promoCode.percent) : 0;
  const delivery = deliveryOptions.find((option) => option.city === city) ?? deliveryOptions[0];
  const total = Math.max(0, subtotal - discount) + delivery.fee;

  function applyPromo() {
    const entered = promoCode.trim().toUpperCase();
    if (entered !== campaign.promoCode.code.toUpperCase()) {
      setPromoApplied(false);
      setPromoMessage("Ce code ne correspond pas à la campagne active.");
    } else if (eligibleSubtotal <= 0) {
      setPromoApplied(false);
      setPromoMessage("Le panier ne contient aucun article éligible à cette offre.");
    } else {
      setPromoApplied(true);
      setPromoMessage(`${campaign.promoCode.code} appliqué à la sélection éligible.`);
    }
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validItems.length) return;
    if (stockIssues.length) {
      setFormError("Une quantité demandée dépasse le stock disponible. Ajustez votre panier avant de continuer.");
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setFormError("Renseignez votre nom, votre téléphone et votre adresse complète.");
      return;
    }
    setFormError("");
    const id = createOrderId();
    const order: Order = {
      id,
      items: validItems,
      subtotal,
      deliveryFee: delivery.fee,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerCity: city,
      customerAddress: address.trim(),
      paymentMethod,
      paymentStatus: "pending",
      promoCode: discount ? campaign.promoCode.code : undefined,
      promoDiscount: discount || undefined,
    };
    addOrder(order);
    clearCart();
    router.push(`/commande/${id}`);
  }

  if (!hydrated) {
    return <main className="py-10 sm:py-14"><Container><p aria-live="polite" className="text-muted">Préparation du checkout…</p></Container></main>;
  }

  if (!validItems.length) {
    return <main className="py-8 sm:py-12"><Container><Card className="grid justify-items-center gap-4 py-12 text-center"><h1 className="font-heading text-2xl font-bold">Votre panier est vide</h1><p className="text-sm text-muted">Ajoutez des articles avant de passer commande.</p><Link className="inline-flex min-h-12 items-center rounded-[var(--radius-button)] bg-primary px-5 text-sm font-bold text-primary-ink" href="/boutique">Retourner à la boutique</Link></Card></Container></main>;
  }

  return (
    <main className="py-8 sm:py-12">
      <Container>
        <Link className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary" href="/panier"><ArrowLeft aria-hidden="true" size={17} />Retour au panier</Link>
        <div className="mb-7"><p className="eyebrow">Commande sans compte</p><h1 className="mt-2 font-heading font-extrabold">Livraison et paiement</h1><p className="mt-2 max-w-2xl text-sm text-muted">Renseignez les informations nécessaires. Les tarifs et paiements affichés sont simulés pour cette démo.</p></div>

        <form className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8" onSubmit={submitOrder}>
          <div className="grid gap-5">
            <Card className="grid gap-4">
              <h2 className="font-heading text-xl font-bold">Vos coordonnées</h2>
              <Input autoComplete="name" label="Nom complet" name="name" onChange={(event) => setName(event.target.value)} placeholder="Ex. Aïcha Soglo" required value={name} />
              <Input autoComplete="tel" label="Téléphone" name="phone" onChange={(event) => setPhone(event.target.value)} placeholder="Ex. +229 01 90 00 00 00" required type="tel" value={phone} />
            </Card>

            <Card className="grid gap-4">
              <h2 className="font-heading text-xl font-bold">Adresse de livraison</h2>
              <label className="grid gap-2 text-base font-medium text-ink" htmlFor="checkout-city">Ville / zone
                <select className="min-h-12 w-full rounded-[var(--radius-button)] border border-line bg-surface px-4 text-base text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" id="checkout-city" onChange={(event) => setCity(event.target.value)} value={city}>{deliveryOptions.map((option) => <option key={option.city} value={option.city}>{option.label} — {formatFCFA(option.fee)}</option>)}</select>
              </label>
              <label className="grid gap-2 text-base font-medium text-ink" htmlFor="checkout-address">Quartier, rue et repère
                <textarea autoComplete="street-address" className="min-h-28 w-full resize-y rounded-[var(--radius-button)] border border-line bg-surface px-4 py-3 text-base text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" id="checkout-address" onChange={(event) => setAddress(event.target.value)} placeholder="Quartier, rue, repère proche…" required value={address} />
              </label>
              <p className="text-xs leading-5 text-muted">Délai indicatif de démonstration pour {delivery.label} : {delivery.delay}. Les modalités réelles restent à confirmer.</p>
            </Card>

            <Card className="grid gap-3">
              <h2 className="font-heading text-xl font-bold">Mode de paiement</h2>
              <p className="text-sm text-muted">Simulation uniquement : aucun paiement réel ne sera déclenché.</p>
              {paymentOptions.map((option) => {
                const Icon = option.type === "mobile" ? Smartphone : Wallet;
                return <label className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-[var(--radius-button)] border px-4 py-3 ${paymentMethod === option.id ? "border-primary bg-surface-mint" : "border-line bg-surface"}`} key={option.id}>
                  <input checked={paymentMethod === option.id} className="size-4 accent-primary" name="payment" onChange={() => setPaymentMethod(option.id)} type="radio" value={option.id} />
                  <Icon aria-hidden="true" className="text-primary" size={18} /><span className="flex-1 text-sm font-semibold">{option.label}</span>{paymentMethod === option.id ? <Check aria-hidden="true" className="text-primary" size={18} /> : null}
                </label>;
              })}
            </Card>
          </div>

          <aside aria-label="Récapitulatif de commande" className="lg:sticky lg:top-24">
            <Card className="grid gap-4">
              <h2 className="font-heading text-xl font-bold">Votre commande</h2>
              <ul className="grid gap-3 border-b border-line pb-4">{validItems.map((item, index) => { const product = productById.get(item.productId)!; return <li className="flex justify-between gap-4 text-sm" key={`${item.productId}-${item.size}-${item.color}-${index}`}><span className="text-muted">{product.name} × {item.quantity}{item.size ? ` · ${item.size}` : ""}{item.color ? ` · ${item.color}` : ""}</span><span className="shrink-0 font-semibold">{formatFCFA(getCartItemTotal(item, product))}</span></li>; })}</ul>
              {campaign.productIds.some((id) => validItems.some((item) => item.productId === id)) ? <div className="grid gap-2"><label className="text-sm font-semibold" htmlFor="checkout-promo">Code promo</label><div className="flex gap-2"><input autoComplete="off" className="min-h-11 min-w-0 flex-1 rounded-[var(--radius-button)] border border-line bg-surface px-3 text-sm uppercase text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" id="checkout-promo" onChange={(event) => { setPromoCode(event.target.value); setPromoApplied(false); setPromoMessage(""); }} value={promoCode} /><Button className="!px-3 !text-sm" onClick={applyPromo} type="button" variant="secondary">Appliquer</Button></div><p aria-live="polite" className={`text-xs ${promoMessage ? (validPromo ? "text-success" : "text-error") : "text-muted"}`}>{promoMessage || (validPromo ? `${campaign.promoCode.code} appliqué à la sélection éligible.` : `Code campagne : ${campaign.promoCode.code} (−${campaign.promoCode.percent}%).`)}</p></div> : null}
              <div className="grid gap-3 border-t border-line pt-3 text-sm">
                <div className="flex justify-between gap-3"><span className="text-muted">Sous-total</span><span>{formatFCFA(subtotal)}</span></div>
                {discount ? <div className="flex justify-between gap-3 text-success"><span>Remise {campaign.promoCode.code}</span><span>−{formatFCFA(discount)}</span></div> : null}
                <div className="flex justify-between gap-3"><span className="text-muted">Livraison · {delivery.city}<span className="block text-xs">{delivery.delay} (indicatif)</span></span><span>{formatFCFA(delivery.fee)}</span></div>
                <div className="flex justify-between gap-3 border-t border-line pt-3 text-base"><span className="font-bold">Total à régler</span><span className="font-bold">{formatFCFA(total)}</span></div>
              </div>
              {formError ? <p className="text-sm text-error" role="alert">{formError}</p> : null}
              {stockIssues.length > 0 ? <p className="text-sm text-error">Le stock a changé pour un ou plusieurs articles. Ajustez votre panier avant de commander.</p> : null}
              <Button className="w-full !text-sm" disabled={stockIssues.length > 0} type="submit">Enregistrer ma commande de démo</Button>
              <p className="text-xs leading-5 text-muted">Commande locale de démonstration. Les tarifs de livraison et le paiement sont simulés.</p>
            </Card>
          </aside>
        </form>
      </Container>
    </main>
  );
}
