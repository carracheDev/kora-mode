import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogClient, CatalogPageFallback } from "@/components/catalog/CatalogClient";
import { fetchCatalogProducts } from "@/core/api/client";

export const metadata: Metadata = {
  title: "Boutique | KORA MODE",
  description: "Parcourez les vêtements et accessoires KORA MODE, avec les disponibilités et prix de cette boutique de démonstration.",
};

export default async function BoutiquePage() {
  const products = await fetchCatalogProducts();

  return (
    <Suspense fallback={<CatalogPageFallback />}>
      <CatalogClient products={products} />
    </Suspense>
  );
}