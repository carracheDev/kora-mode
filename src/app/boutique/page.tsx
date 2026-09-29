import { Suspense } from "react";
import { CatalogClient, CatalogPageFallback } from "@/components/catalog/CatalogClient";

export default function BoutiquePage() {
  return (
    <Suspense fallback={<CatalogPageFallback />}>
      <CatalogClient />
    </Suspense>
  );
}