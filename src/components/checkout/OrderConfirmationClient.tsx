"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CheckCircle2, Clock3, PackageCheck, XCircle } from "lucide-react";
import { products } from "@/brands/mode/products";
import { modeBrand } from "@/brands/mode/brand";
import { formatFCFA } from "@/core/lib/format";
import { getCartItemBaseTotal, getCartItemDiscount, getCartItemTotal } from "@/core/lib/pricing";
import { buildWhatsAppUrl } from "@/core/lib/whatsapp";
import { useOrdersStore } from "@/core/store/orders";
import { fetchApiOrder, simulateApiPayment, toLocalOrder } from "@/core/api/orders";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import type { Order, PaymentStatus } from "@/core/types";

const paymentLabels: Record<string, string> = {
  mtn: "MTN Mobile Money",
  moov: "Moov Money",
  celtiis: "Celtiis",
  cod: "Paiement à la livraison",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Paiement en attente",
  succeeded: "Paiement confirmé",
  failed: "Paiement échoué",
};

export function OrderConfirmationClient({ orderId }: { orderId: string }) {
  const hydrated = useSyncExternalStore(
    (onChange) => {
      const unsubscribeHydration = useOrdersStore.persist.onHydrate(onChange);
      const unsubscribeFinish = useOrdersStore.persist.onFinishHydration(onChange);
      return () => { unsubscribeHydration(); unsubscribeFinish(); };
    },
    () => useOrdersStore.persist.hasHydrated(),
    () => false,
  );
  const localOrder = useOrdersStore((state) => state.orders.find((item) => item.id === orderId));
  const [serverOrder, setServerOrder] = useState<Order | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const productById = useMemo(() => new Map(products.map((product) => [product.id, product])), []);

  useEffect(() => {
    let active = true;
    fetchApiOrder(orderId)
      .then((apiOrder) => { if (active) setServerOrder(toLocalOrder(apiOrder)); })
      .catch(() => {})
      .finally(() => { if (active) setApiLoading(false); });
    return () => { active = false; };
  }, [orderId]);

  const order = serverOrder ?? localOrder;

  if (!hydrated || (apiLoading && !order)) return <main className="py-10"><Container><p aria-live="polite" className="text-muted">Chargement de votre récapitulatif…</p></Container></main>;
  if (!order) return <main className="py-10"><Container><Card className="grid justify-items-center gap-4 py-12 text-center"><h1 className="font-heading text-2xl font-bold">Commande introuvable</h1><Link className="text-sm font-semibold text-primary underline" href="/boutique">Retour à la boutique</Link></Card></Container></main>;

  const paymentStatus = order.paymentStatus ?? "pending";
  const isMobileMoney = order.paymentMethod !== "cod";
  const whatsappMessage = [
    `Bonjour, voici ma commande KORA MODE ${order.id} :`,
    "",
    ...order.items.map((item) => {
      const product = productById.get(item.productId);
      return `• ${product?.name ?? "Article"} × ${item.quantity}${item.size ? ` · Taille ${item.size}` : ""}${item.color ? ` · Couleur ${item.color}` : ""}`;
    }),
    "",
    `Total : ${formatFCFA(order.total)}`,
    `Paiement choisi : ${paymentLabels[order.paymentMethod ?? "cod"]}`,
    `Statut du paiement : ${paymentStatus === "pending" && !isMobileMoney ? "à régler à la livraison" : paymentStatusLabels[paymentStatus]}`,
  ].join("\n");
  const whatsappUrl = buildWhatsAppUrl(modeBrand.whatsappNumber, whatsappMessage);

  async function simulatePayment(status: PaymentStatus) {
    setUpdatingPayment(true);
    setPaymentError("");
    try {
      const updated = await simulateApiPayment(order!.id, status);
      setServerOrder(toLocalOrder(updated));
    } catch {
      setPaymentError("La simulation est indisponible. Vérifiez que le backend est en mode démonstration.");
    } finally {
      setUpdatingPayment(false);
    }
  }

  const paymentLabel = !isMobileMoney ? "À régler à la livraison" : paymentStatusLabels[paymentStatus];

  return (
    <main className="py-8 sm:py-12">
      <Container className="max-w-3xl">
        <Card className="grid gap-6 !p-5 sm:!p-8">
          <div className="grid justify-items-center gap-3 text-center">
            {paymentStatus === "succeeded" ? <CheckCircle2 aria-hidden="true" className="text-success" size={42} /> : paymentStatus === "failed" ? <XCircle aria-hidden="true" className="text-error" size={42} /> : <Clock3 aria-hidden="true" className="text-warning" size={42} />}
            <p className="eyebrow">Récapitulatif de commande</p>
            <h1 className="font-heading text-3xl font-extrabold">Commande enregistrée</h1>
            <p aria-live="polite" className={`font-semibold ${paymentStatus === "succeeded" ? "text-success" : paymentStatus === "failed" ? "text-error" : "text-warning"}`}>{paymentLabel}</p>
            <p className="max-w-xl text-sm leading-6 text-muted">Le statut vient du serveur. En mode de démonstration ou sandbox, aucun débit réel n’est déclenché.</p>
          </div>

          {isMobileMoney && paymentStatus === "pending" ? (
            <section aria-label="Résultat du paiement Mobile Money" className="grid gap-3 rounded-[var(--radius-card)] border border-line p-4">
              <h2 className="font-heading text-lg font-bold">Paiement · {paymentLabels[order.paymentMethod ?? "mtn"]}</h2>
              <p className="text-sm leading-6 text-muted">Choisis un résultat de démonstration pour vérifier le parcours. Les choix modifient le statut côté serveur.</p>
              <div className="grid gap-2 sm:grid-cols-3">
                <Button className="!text-sm" disabled={updatingPayment} onClick={() => simulatePayment("succeeded")} variant="primary">Simuler la réussite</Button>
                <Button className="!text-sm" disabled={updatingPayment} onClick={() => simulatePayment("failed")} variant="secondary">Simuler l’échec</Button>
                <Button className="!text-sm" disabled={updatingPayment} onClick={() => simulatePayment("pending")} variant="ghost">Garder en attente</Button>
              </div>
              {paymentError ? <p className="text-sm text-error" role="alert">{paymentError}</p> : null}
            </section>
          ) : null}

          <div className="grid gap-3 rounded-[var(--radius-card)] bg-surface-soft p-4 text-sm sm:grid-cols-2"><p><span className="text-muted">Référence :</span> <strong>{order.id}</strong></p><p><span className="text-muted">Mode choisi :</span> <strong>{paymentLabels[order.paymentMethod ?? "cod"]}</strong></p><p><span className="text-muted">Client :</span> <strong>{order.customerName}</strong></p><p><span className="text-muted">Téléphone :</span> <strong>{order.customerPhone}</strong></p><p className="sm:col-span-2"><span className="text-muted">Livraison :</span> <strong>{order.customerAddress}, {order.customerCity}</strong></p></div>

          <section aria-label="Articles commandés" className="grid gap-3"><h2 className="font-heading text-xl font-bold">Articles</h2>{order.items.map((item, index) => { const product = productById.get(item.productId); const lineDiscount = getCartItemDiscount(item, product); return <div className="flex justify-between gap-4 border-b border-line pb-3 text-sm" key={`${item.productId}-${item.size}-${item.color}-${index}`}><p>{product?.name ?? "Article"} × {item.quantity}{item.size ? ` · ${item.size}` : ""}{item.color ? ` · ${item.color}` : ""}</p><span className="shrink-0 text-right">{lineDiscount > 0 ? <del className="block text-xs text-muted">{formatFCFA(getCartItemBaseTotal(item, product))}</del> : null}<span className="block font-semibold">{formatFCFA(getCartItemTotal(item, product))}</span>{lineDiscount > 0 ? <span className="block text-xs text-success">Look complet −{item.discountPercent}%</span> : null}</span></div>; })}</section>

          <section aria-label="Montants" className="grid gap-2 text-sm"><p className="flex justify-between"><span className="text-muted">Sous-total</span><span>{formatFCFA(order.subtotal)}</span></p>{order.promoDiscount ? <p className="flex justify-between text-success"><span>Code {order.promoCode}</span><span>−{formatFCFA(order.promoDiscount)}</span></p> : null}<p className="flex justify-between"><span className="text-muted">Livraison</span><span>{formatFCFA(order.deliveryFee)}</span></p><p className="flex justify-between border-t border-line pt-3 text-base font-bold"><span>Total</span><span>{formatFCFA(order.total)}</span></p></section>

          <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-line p-4 text-sm leading-6"><PackageCheck aria-hidden="true" className="mt-0.5 shrink-0 text-primary" size={19} /><p className="text-muted">Cette commande est enregistrée par le backend. {whatsappUrl ? "Son récapitulatif peut être transmis sur WhatsApp." : "Le numéro WhatsApp de démonstration n’est pas configuré."}</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {whatsappUrl ? <a className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-whatsapp px-5 text-sm font-bold text-surface" href={whatsappUrl} rel="noreferrer" target="_blank">Envoyer le récapitulatif sur WhatsApp</a> : <p className="flex min-h-12 items-center justify-center rounded-[var(--radius-button)] border border-line px-5 text-center text-sm text-muted">WhatsApp non configuré</p>}
            <Link className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] border border-line px-5 text-sm font-semibold text-ink hover:bg-surface-soft" href="/boutique">Continuer mes achats</Link>
          </div>
        </Card>
      </Container>
    </main>
  );
}
