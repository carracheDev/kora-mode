"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowRight, Heart, PackageSearch, UserRound } from "lucide-react";
import { products } from "@/brands/mode/products";
import { formatFCFA } from "@/core/lib/format";
import { useFavoritesStore } from "@/core/store/favorites";
import { useOrdersStore } from "@/core/store/orders";
import type { Order, OrderStatus, PaymentStatus, Product } from "@/core/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { ApiCustomer, fetchCurrentCustomer, loginCustomer, logoutCustomer, registerCustomer } from "@/core/api/auth";
import { getApiToken, KoraApiError, koraApi } from "@/core/api/client";
import { ApiOrder, toLocalOrder } from "@/core/api/orders";

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

function apiErrorMessage(error: unknown): string {
  if (error instanceof KoraApiError) {
    if (error.status === 422) return "Vérifie l’adresse e-mail, le mot de passe et les informations obligatoires.";
    if (error.status === 401) return "Adresse e-mail ou mot de passe incorrect.";
    return error.message;
  }
  return error instanceof Error ? error.message : "La requête n’a pas abouti. Réessaie.";
}

function CustomerAuthForm({ onAuthenticated }: { onAuthenticated: (customer: ApiCustomer) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const customer = mode === "login"
        ? await loginCustomer(email, password)
        : await registerCustomer({
          name,
          email,
          phone: phone || undefined,
          password,
          password_confirmation: passwordConfirmation,
        });
      onAuthenticated(customer);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="grid gap-4">
      <div><p className="eyebrow">Espace client</p><h2 className="mt-1 font-heading text-xl font-bold">{mode === "login" ? "Se connecter" : "Créer un compte"}</h2><p className="mt-1 text-sm text-muted">Retrouve tes favoris et commandes sur cet appareil.</p></div>
      <form className="grid gap-3" onSubmit={submit}>
        {mode === "register" ? <><Input autoComplete="name" label="Nom complet" onChange={(event) => setName(event.target.value)} required value={name} /><Input autoComplete="tel" label="Téléphone (facultatif)" onChange={(event) => setPhone(event.target.value)} type="tel" value={phone} /></> : null}
        <Input autoComplete="email" label="E-mail" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
        <Input autoComplete={mode === "login" ? "current-password" : "new-password"} label="Mot de passe" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
        {mode === "register" ? <Input autoComplete="new-password" label="Confirmer le mot de passe" onChange={(event) => setPasswordConfirmation(event.target.value)} required type="password" value={passwordConfirmation} /> : null}
        {error ? <p className="text-sm text-error" role="alert">{error}</p> : null}
        <Button className="w-full" disabled={submitting} type="submit">{mode === "login" ? "Se connecter" : "Créer mon compte"}</Button>
      </form>
      <button className="justify-self-start text-sm font-semibold text-primary hover:underline" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} type="button">
        {mode === "login" ? "Créer un compte client" : "J’ai déjà un compte"}
      </button>
    </Card>
  );
}

function useBackendOrders(enabled: boolean): Order[] | null {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    let active = true;
    if (!enabled || !getApiToken()) {
      setOrders(null);
      return () => { active = false; };
    }

    koraApi<{ data: ApiOrder[] }>("/orders")
      .then((response) => { if (active) setOrders(response.data.map(toLocalOrder)); })
      .catch(() => { if (active) setOrders(null); });
    return () => { active = false; };
  }, [enabled]);

  return orders;
}

export function FavoritesPageClient() {
  const hydrated = useFavoritesHydrated();
  const productIds = useFavoritesStore((state) => state.productIds);
  const setProductIds = useFavoritesStore((state) => state.setProductIds);
  const [syncing, setSyncing] = useState(false);
  const favoriteProducts = products.filter((product) => productIds.includes(product.id));

  useEffect(() => {
    if (!hydrated || !getApiToken()) return;
    let active = true;
    setSyncing(true);
    koraApi<{ data: Array<{ product: { slug: string } }> }>("/favorites")
      .then(async (response) => {
        const remoteIds = response.data.flatMap(({ product }) => {
          const localProduct = products.find((item) => item.slug === product.slug);
          return localProduct ? [localProduct.id] : [];
        });
        const remoteSet = new Set(remoteIds);
        const localIds = useFavoritesStore.getState().productIds;
        const missing = localIds.filter((id) => !remoteSet.has(id));
        await Promise.all(missing.map((id) => {
          const product = products.find((item) => item.id === id);
          return product ? koraApi("/favorites", { method: "POST", body: { product_slug: product.slug } }) : Promise.resolve();
        }));
        if (active) setProductIds([...remoteIds, ...missing]);
      })
      .catch(() => {})
      .finally(() => { if (active) setSyncing(false); });
    return () => { active = false; };
  }, [hydrated, setProductIds]);

  if (!hydrated) return <main className="py-10"><Container><p className="text-muted">Chargement des favoris…</p></Container></main>;

  return (
    <main className="py-8 sm:py-12">
      <Container>
        <div className="mb-7"><p className="eyebrow">Votre sélection</p><h1 className="mt-2 font-heading font-extrabold">Mes favoris</h1><p className="mt-2 text-sm text-muted">{favoriteProducts.length} article{favoriteProducts.length === 1 ? "" : "s"} enregistré{favoriteProducts.length === 1 ? "" : "s"}{syncing ? " · Synchronisation…" : ""}.</p></div>
        {favoriteProducts.length ? <div className={`grid ${favoriteProducts.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4`}>{favoriteProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <Card className="grid justify-items-center gap-4 py-12 text-center sm:py-16"><Heart aria-hidden="true" className="text-primary" size={30} /><h2 className="font-heading !text-xl !leading-tight font-bold">Aucun favori pour le moment</h2><p className="max-w-md text-sm text-muted">Touchez le cœur d’un produit pour le retrouver ici.</p><Link className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-primary px-5 text-sm font-bold text-primary-ink hover:bg-primary-hover" href="/boutique">Explorer la boutique</Link></Card>}
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
  succeeded: "Paiement confirmé",
  failed: "Paiement échoué",
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
  const localOrders = useOrdersStore((state) => state.orders);
  const remoteOrders = useBackendOrders(hydrated);
  const orders = remoteOrders ?? localOrders;

  if (!hydrated) return <main className="py-10"><Container><p className="text-muted">Chargement des commandes…</p></Container></main>;
  return (
    <main className="py-8 sm:py-12"><Container>
      <div className="mb-7"><p className="eyebrow">Espace client</p><h1 className="mt-2 font-heading font-extrabold">Mes commandes</h1><p className="mt-2 text-sm text-muted">Historique synchronisé avec votre compte lorsque vous êtes connecté.</p></div>
      {orders.length ? <div className="grid gap-3">{orders.map((order) => <OrderSummaryCard key={order.id} order={order} />)}</div> : <Card className="grid justify-items-center gap-4 py-12 text-center sm:py-16"><PackageSearch aria-hidden="true" className="text-primary" size={30} /><h2 className="font-heading !text-xl !leading-tight font-bold">Aucune commande enregistrée</h2><p className="max-w-md text-sm text-muted">Après une commande, son récapitulatif et son statut apparaîtront ici.</p><Link className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-primary px-5 text-sm font-bold text-primary-ink hover:bg-primary-hover" href="/boutique">Découvrir la boutique</Link></Card>}
    </Container></main>
  );
}

export function AccountPageClient() {
  const favoritesHydrated = useFavoritesHydrated();
  const ordersHydrated = useOrdersHydrated();
  const favoriteCount = useFavoritesStore((state) => state.productIds.length);
  const localOrders = useOrdersStore((state) => state.orders);
  const [customer, setCustomer] = useState<ApiCustomer | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const hydrated = favoritesHydrated && ordersHydrated;
  const remoteOrders = useBackendOrders(Boolean(customer));
  const orders = remoteOrders ?? localOrders;
  const recentOrders = orders.slice(0, 3);

  useEffect(() => {
    let active = true;
    fetchCurrentCustomer()
      .then((user) => { if (active) setCustomer(user); })
      .catch(() => {})
      .finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, []);

  async function logout() {
    await logoutCustomer();
    setCustomer(null);
  }

  if (!hydrated || authLoading) return <main className="py-10"><Container><p className="text-muted">Chargement de votre espace…</p></Container></main>;
  if (!customer) return <main className="py-8 sm:py-12"><Container className="max-w-2xl"><div className="mb-6"><p className="eyebrow">Compte client KORA</p><h1 className="mt-2 font-heading font-extrabold">Mon compte</h1><p className="mt-2 text-sm leading-6 text-muted">Connecte-toi pour synchroniser tes favoris et retrouver l’historique de tes commandes.</p></div><CustomerAuthForm onAuthenticated={setCustomer} /></Container></main>;

  return (
    <main className="py-8 sm:py-12"><Container>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Espace client</p><h1 className="mt-2 font-heading font-extrabold">Bonjour {customer.name}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Tes favoris et commandes sont associés à ton compte.</p></div><Button onClick={() => { void logout(); }} variant="secondary">Se déconnecter</Button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="grid content-start gap-3"><Heart aria-hidden="true" className="text-primary" size={22} /><h2 className="font-heading !text-xl !leading-tight font-bold">Mes favoris</h2><p className="text-sm text-muted">{favoriteCount} article{favoriteCount === 1 ? "" : "s"} enregistré{favoriteCount === 1 ? "" : "s"}.</p><Link className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline" href="/favoris">Voir mes favoris <ArrowRight aria-hidden="true" size={16} /></Link></Card>
        <Card className="grid content-start gap-3"><PackageSearch aria-hidden="true" className="text-primary" size={22} /><h2 className="font-heading !text-xl !leading-tight font-bold">Mes commandes</h2><p className="text-sm text-muted">{orders.length} commande{orders.length === 1 ? "" : "s"} enregistrée{orders.length === 1 ? "" : "s"}.</p><Link className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline" href="/commandes">Consulter l’historique <ArrowRight aria-hidden="true" size={16} /></Link></Card>
      </div>
      {recentOrders.length ? <section className="mt-8 grid gap-3"><div className="flex flex-wrap items-end justify-between gap-3"><h2 className="font-heading !text-xl !leading-tight font-bold">Dernières commandes</h2><Link className="text-sm font-semibold text-primary hover:underline" href="/commandes">Tout l’historique</Link></div>{recentOrders.map((order) => <OrderSummaryCard key={order.id} order={order} />)}</section> : <div className="mt-8 flex items-center gap-3 rounded-[var(--radius-card)] bg-surface-soft p-4 text-sm text-muted"><UserRound aria-hidden="true" className="shrink-0 text-primary" size={20} />Passe une commande en mode invité pour la retrouver ici.</div>}
    </Container></main>
  );
}
