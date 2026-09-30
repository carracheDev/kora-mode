import type { Product } from "@/core/types";
import { products } from "@/brands/mode/products";
import { ProductCard } from "@/components/product/ProductCard";

function getRelatedProducts(current: Product): Product[] {
  return products
    .filter((product) => product.id !== current.id)
    .map((product) => {
      const score = (product.subcategory === current.subcategory ? 4 : 0)
        + (product.gender === current.gender ? 2 : 0)
        + (product.category === current.category ? 2 : 0)
        + product.tags.filter((tag) => current.tags.includes(tag)).length;
      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.product.popularity - a.product.popularity)
    .slice(0, 4)
    .map(({ product }) => product);
}

export function RelatedProducts({ product }: { product: Product }) {
  const relatedProducts = getRelatedProducts(product);
  if (!relatedProducts.length) return null;

  return (
    <section aria-labelledby="related-products-title" className="mt-12 border-t border-line pt-8 sm:mt-16 sm:pt-10">
      <div className="mb-5">
        <p className="eyebrow">La sélection KORA</p>
        <h2 className="mt-1 font-heading text-2xl font-bold" id="related-products-title">À découvrir aussi</h2>
        <p className="mt-2 text-sm text-muted">D’autres pièces de la boutique, proches par catégorie ou style.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {relatedProducts.map((related) => <ProductCard key={related.id} product={related} />)}
      </div>
    </section>
  );
}
