import type { Metadata } from "next";
import { OrdersPageClient } from "@/components/account/CustomerPages";

export const metadata: Metadata = { title: "Mes commandes | KORA MODE", robots: { index: false, follow: false } };

export default function OrdersPage() {
  return <OrdersPageClient />;
}
