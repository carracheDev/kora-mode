import type { Metadata } from "next";
import { FavoritesPageClient } from "@/components/account/CustomerPages";

export const metadata: Metadata = { title: "Mes favoris | KORA MODE", robots: { index: false, follow: false } };

export default function FavoritesPage() {
  return <FavoritesPageClient />;
}
