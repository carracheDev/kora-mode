import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/core/types";
import { products } from "@/brands/mode/products";
import { images } from "@/brands/mode/images";
import { formatFCFA } from "@/core/lib/format";
import { SmartImage } from "@/components/ui/SmartImage";

const complementaryCategories: Record<Product["subcategory"], Product["subcategory"][]> = {
  Vestes: ["Pantalons", "Jeans", "Chaussures", "Hauts"],
  Pantalons: ["Hauts", "Vestes", "Chaussures", "Jeans"],
  Hauts: ["Pantalons", "Jeans", "Vestes", "Chaussures"],
  Jeans: ["Hauts", "Vestes", "Chaussures", "Pantalons"],
  Sacs: ["Vestes", "Hauts", "Pantalons", "Jeans"],
  Chaussures: ["Pantalons", "Jeans", "Vestes", "Hauts"],
};

function getComplementaryProducts(current: Product): Product[] {
  const categoryOrder = complementaryCategories[current.subcategory];
  return products
    .filter((candidate) => candidate.id !== current.id && categoryOrder.includes(candidate.subcategory))
    .sort((a, b) => {
      const categoryScore = categoryOrder.indexOf(a.subcategory) - categoryOrder.indexOf(b.subcategory);
      if (categoryScore !== 0) return categoryScore;
      const genderScore = Number(b.gender === current.gender) - Number(a.gender === current.gender);
      return genderScore || b.popularity - a.popularity;
    })
    .slice(0, 2);
}

export function ComplementaryProducts({ product }: { product: Product }) {
  const items = getComplementaryProducts(product);
  if (!items.length) return null;

  return (
    <section aria-labelledby="complementary-products-title" className="mt-8 rounded-[var(--radius-card)] bg-surface-soft p-4 sm:p-5">
      <div className="mb-4">
        <p className="eyebrow">Idées d’association</p>
        <h2 className="mt-1 font-heading text-xl font-bold" id="complementary-products-title">Complétez la silhouette</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Link className="group min-w-0 rounded-[var(--radius-button)] border border-line bg-surface p-2 transition-colors hover:border-primary/40 sm:p-3" href={`/produit/${item.slug}`} key={item.id}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius-button)-2px)] bg-surface-soft">
              <SmartImage alt={item.name} focus={images.focus.products[item.id as keyof typeof images.focus.products] ?? "50% 10%"} sizes="(max-width: 639px) 40vw, 20vw" src={item.images[0] ?? images.products.placeholder} />
            </div>
            <span className="mt-3 block line-clamp-2 text-sm font-semibold text-ink">{item.name}</span>
            <span className="mt-1 block text-sm text-muted">{formatFCFA(item.price)}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">Voir la pièce <ArrowRight aria-hidden="true" size={14} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
