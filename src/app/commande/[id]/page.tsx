import type { Metadata } from "next";
import { OrderConfirmationClient } from "@/components/checkout/OrderConfirmationClient";

export const metadata: Metadata = { title: "Confirmation de commande | KORA MODE", robots: { index: false, follow: false } };

type OrderConfirmationPageProps = PageProps<"/commande/[id]">;

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { id } = await params;
  return <OrderConfirmationClient orderId={id} />;
}
