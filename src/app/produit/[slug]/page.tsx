import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/brands/mode/products";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";

type ProductPageProps = PageProps<"/produit/[slug]">;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="py-8 sm:py-12">
      <Container>
        <Link className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary" href="/boutique">
          <ArrowLeft aria-hidden="true" size={17} /> Retour à la boutique
        </Link>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery product={product} />
          <ProductPurchasePanel product={product} />
        </div>
      </Container>
    </main>
  );
}
