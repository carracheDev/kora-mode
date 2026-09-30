"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight, Heart, PackageSearch, UserRound } from "lucide-react";
import { products } from "@/brands/mode/products";
import { formatFCFA } from "@/core/lib/format";
import { useFavoritesStore } from "@/core/store/favorites";
import { useOrdersStore } from "@/core/store/orders";
import type { Order, OrderStatus, PaymentStatus } from "@/core/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

function useFavoritesHydrated() {
  return useSyncExternalStore(
    (onChange) => {
      const unsubscribeHydration = useFavoritesStore.persist.onHydrate(onChange);
      const unsubscribeFinish = useFavoritesStore.persist.onFinishHydration(onChange);
      return () => { unsubscribeHydration(); unsubscribeFinish(); };
    },
    () => useFavoritesStore.persist.hasHydrated(),
    () => false,
  );
}

function useOrdersHydrated() {
  return useSyncExternalStore(
    (onChange) => {
      const unsubscribeHydration = useOrdersStore.persist.onHydrate(onChange);
      const unsubscribeFinish = useOrdersStore.persist.onFinishHydration(onChange);
      return () => { unsubscribeHydration(); unsubscribeFinish(); };
    },
    () => useOrdersStore.persist.hasHydrated(),
    () => false,
  );
}

export function FavoritesPageClient() {
  const hydrated = useFavoritesHydrated();
  const productIds = useFavoritesStore((state) => state.productIds);
  const favoriteProducts = products.filter((product) => productIds.includes(product.id));

  if (!hydrated) return <main className="py-10"><Container><p className="text-muted">Chargement des favoris…</p></Container></main>;

  return (
    <main className="py-8 sm:py-12">
      <Container>
        <div className="mb-7"><p className="eyebrow">Votre sélection</p><h1 className="mt-2 font-heading font-extrabold">Mes favoris</h1><p className="mt-2 text-sm text-muted">{favoriteProducts.length} article{favoriteProducts.length === 1 ? "" : "s"} enregistré{favoriteProducts.length === 1 ? "" : "s"} dans ce navigateur.</p></div>
        {favoriteProducts.length ? <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{favoriteProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <Card className="grid justify-items-center gap-4 py-12 text-center sm:py-16"><Heart aria-hidden="true" className="text-primary" size={30} /><h2 className="font-heading !text-xl !leading-tight font-bold">Aucun favori pour le moment</h2><p className="max-w-md text-sm text-muted">Touchez le cœur d’un produit pour le retrouver ici.</p><Link className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-primary px-5 text-sm font-bold text-primary-ink hover:bg-primary-hover" href="/boutique">Explorer la boutique</Link></Card>}
      </Container>
    </main>
  );
}

const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Paiement en attente",
  succeeded: "Paiement simulé réussi",
  failed: "Paiement simulé échoué",
};

const paymentMethodLabels: Record<string, string> = {
  mtn: "MTN Mobile Money",
  moov: "Moov Money",
  celtiis: "Celtiis",
  cod: "Paiement à la livraison",
};

function OrderSummaryCard({ order }: { order: Order }) {
  const createdAt = new Intl.DateTimeFormat("fr-BJ", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Porto-Novo" }).format(new Date(order.createdAt));
  const paymentStatus = order.paymentStatus ?? "pending";
  return (
    <Card className="grid gap-4 !p-4 sm:!p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs text-muted">{createdAt}</p><h2 className="mt-1 font-heading !text-xl !leading-tight font-semibold">Commande {order.id}</h2></div>
        <span className="rounded-[var(--radius-pill)] bg-surface-mint px-3 py-1 text-xs font-semibold text-primary">{orderStatusLabels[order.status]}</span>
      </div>
      <div className="grid gap-2 text-sm sm:grid-cols-2"><p className="text-muted">{order.items.reduce((count, item) => count + item.quantity, 0)} article(s)</p><p className="text-muted sm:text-right">{paymentMethodLabels[order.paymentMethod ?? "cod"]} · {paymentStatusLabels[paymentStatus]}</p></div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3"><p className="font-bold">{formatFCFA(order.total)}</p><Link className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline" href={`/commande/${order.id}`}>Voir le récapitulatif <ArrowRight aria-hidden="true" size={16} /></Link></div>
    </Card>
  );
}

export function OrdersPageClient() {
  const hydrated = useOrdersHydrated();
  const orders = useOrdersStore((state) => state.orders);

  if (!hydrated) return <main className="py-10"><Container><p className="text-muted">Chargement des commandes…</p></Container></main>;
  return (
    <main className="py-8 sm:py-12"><Container>
      <div className="mb-7"><p className="eyebrow">Suivi local</p><h1 className="mt-2 font-heading font-extrabold">Mes commandes</h1><p className="mt-2 text-sm text-muted">Historique conservé dans ce navigateur pour cette démonstration.</p></div>
      {orders.length ? <div className="grid gap-3">{orders.map((order) => <OrderSummaryCard key={order.id} order={order} />)}</div> : <Card className="grid justify-items-center gap-4 py-12 text-center sm:py-16"><PackageSearch aria-hidden="true" className="text-primary" size={30} /><h2 className="font-heading !text-xl !leading-tight font-bold">Aucune commande enregistrée</h2><p className="max-w-md text-sm text-muted">Après une commande, son récapitulatif et son statut apparaîtront ici.</p><Link className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-primary px-5 text-sm font-bold text-primary-ink hover:bg-primary-hover" href="/boutique">Découvrir la boutique</Link></Card>}
    </Container></main>
  );
}

export function AccountPageClient() {
  const favoritesHydrated = useFavoritesHydrated();
  const ordersHydrated = useOrdersHydrated();
  const favoriteCount = useFavoritesStore((state) => state.productIds.length);
  const orderCount = useOrdersStore((state) => state.orders.length);
  const orders = useOrdersStore((state) => state.orders);
  const recentOrders = orders.slice(0, 3);
  const hydrated = favoritesHydrated && ordersHydrated;

  if (!hydrated) return <main className="py-10"><Container><p className="text-muted">Chargement de votre espace…</p></Container></main>;
  return (
    <main className="py-8 sm:py-12"><Container>
      <div className="mb-7"><p className="eyebrow">Espace client démo</p><h1 className="mt-2 font-heading font-extrabold">Mon compte</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Cette boutique de démonstration n’utilise pas de compte ni de mot de passe. Vos favoris et commandes sont conservés dans ce navigateur.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="grid content-start gap-3"><Heart aria-hidden="true" className="text-primary" size={22} /><h2 className="font-heading !text-xl !leading-tight font-bold">Mes favoris</h2><p className="text-sm text-muted">{favoriteCount} article{favoriteCount === 1 ? "" : "s"} enregistré{favoriteCount === 1 ? "" : "s"}.</p><Link className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline" href="/favoris">Voir mes favoris <ArrowRight aria-hidden="true" size={16} /></Link></Card>
        <Card className="grid content-start gap-3"><PackageSearch aria-hidden="true" className="text-primary" size={22} /><h2 className="font-heading !text-xl !leading-tight font-bold">Mes commandes</h2><p className="text-sm text-muted">{orderCount} commande{orderCount === 1 ? "" : "s"} enregistrée{orderCount === 1 ? "" : "s"}.</p><Link className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline" href="/commandes">Consulter l’historique <ArrowRight aria-hidden="true" size={16} /></Link></Card>
      </div>
      {recentOrders.length ? <section className="mt-8 grid gap-3"><div className="flex flex-wrap items-end justify-between gap-3"><h2 className="font-heading !text-xl !leading-tight font-bold">Dernières commandes</h2><Link className="text-sm font-semibold text-primary hover:underline" href="/commandes">Tout l’historique</Link></div>{recentOrders.map((order) => <OrderSummaryCard key={order.id} order={order} />)}</section> : <div className="mt-8 flex items-center gap-3 rounded-[var(--radius-card)] bg-surface-soft p-4 text-sm text-muted"><UserRound aria-hidden="true" className="shrink-0 text-primary" size={20} />Passe une commande en mode invité pour la retrouver ici.</div>}
    </Container></main>
  );
}
