import type { Metadata } from "next";
import { CartPageClient } from "@/components/checkout/CartPageClient";

export const metadata: Metadata = { title: "Panier | KORA MODE", robots: { index: false, follow: false } };

export default function CartPage() {
  return <CartPageClient />;
}
