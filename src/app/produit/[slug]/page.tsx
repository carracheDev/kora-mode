import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { fetchCatalogProducts, fetchProductBySlug } from "@/core/api/client";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ComplementaryProducts } from "@/components/product/ComplementaryProducts";

type ProductPageProps = PageProps<"/produit/[slug]">;

export async function generateStaticParams() {
  const products = await fetchCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Produit introuvable | KORA MODE", robots: { index: false, follow: false } };
  return {
    title: `${product.name} | KORA MODE`,
    description: product.description,
    openGraph: {
      title: `${product.name} | KORA MODE`,
      description: product.description,
      type: "website",
      locale: "fr_BJ",
      siteName: "KORA MODE",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="py-8 sm:py-12">
      <Container>
        <Link className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary" href="/boutique">
          <ArrowLeft aria-hidden="true" size={17} /> Retour à la boutique
        </Link>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery product={product} />
          <div>
            <ProductPurchasePanel product={product} />
            <ComplementaryProducts product={product} />
          </div>
        </div>
        <RelatedProducts product={product} />
      </Container>
    </main>
  );
}
