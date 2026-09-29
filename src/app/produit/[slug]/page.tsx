import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/brands/mode/products";
import { formatFCFA } from "@/core/lib/format";
import { Container } from "@/components/ui/Container";

export default async function ProductPlaceholderPage({
  params,
}: PageProps<"/produit/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="min-h-[60vh] py-12 sm:py-20">
      <Container>
        <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary" href="/">
          <ArrowLeft aria-hidden="true" size={17} /> Retour à la boutique
        </Link>
        <p className="eyebrow mt-8">{product.category}</p>
        <h1 className="mt-2 font-heading font-extrabold">{product.name}</h1>
        <p className="mt-4 text-xl font-bold">{formatFCFA(product.price)}</p>
      </Container>
    </main>
  );
}