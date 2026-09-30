import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = { title: "Validation de commande | KORA MODE", robots: { index: false, follow: false } };

type CheckoutPageProps = {
  searchParams: Promise<{ code?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { code = "" } = await searchParams;
  return <CheckoutClient initialCode={code} />;
}
