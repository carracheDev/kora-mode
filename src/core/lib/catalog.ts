import type { Product } from "@/core/types";

export type CatalogFilters = {
  q: string;
  categorie: string;
  genre: string;
  sous: string;
  prix_min: string;
  prix_max: string;
  taille: string;
  couleur: string;
  promo: boolean;
  stock: boolean;
  tri: string;
};

export type CatalogQueryPatch = Record<string, string | number | boolean | null | undefined>;

export function normalizeCatalogText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr-BJ").trim();
}

export function readCatalogFilters(params: URLSearchParams): CatalogFilters {
  return {
    q: params.get("q") ?? "",
    categorie: params.get("categorie") ?? "",
    genre: params.get("genre") ?? "",
    sous: params.get("sous") ?? "",
    prix_min: params.get("prix_min") ?? "",
    prix_max: params.get("prix_max") ?? "",
    taille: params.get("taille") ?? "",
    couleur: params.get("couleur") ?? "",
    promo: params.get("promo") === "1",
    stock: params.get("stock") === "1",
    tri: params.get("tri") ?? "pertinence",
  };
}

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const query = normalizeCatalogText(filters.q);
  const subcategory = normalizeCatalogText(filters.sous);
  const color = normalizeCatalogText(filters.couleur);
  const minimum = filters.prix_min === "" ? undefined : Number(filters.prix_min);
  const maximum = filters.prix_max === "" ? undefined : Number(filters.prix_max);

  return products.filter((product) => {
    if (query) {
      const searchable = normalizeCatalogText([
        product.name,
        product.category,
        product.subcategory,
        product.gender,
        ...product.tags,
      ].join(" "));
      if (!searchable.includes(query)) return false;
    }
    if (filters.categorie === "vetements" && product.category === "Accessoires") return false;
    if (filters.categorie === "accessoires" && product.category !== "Accessoires") return false;
    if (filters.genre && product.gender !== filters.genre) return false;
    if (subcategory && !normalizeCatalogText(product.subcategory).includes(subcategory)) return false;
    if (minimum !== undefined && Number.isFinite(minimum) && product.price < minimum) return false;
    if (maximum !== undefined && Number.isFinite(maximum) && product.price > maximum) return false;
    if (filters.taille && !product.sizes.some((size) => normalizeCatalogText(size) === normalizeCatalogText(filters.taille))) return false;
    if (color && !product.colors.some((item) => normalizeCatalogText(item.name) === color)) return false;
    if (filters.promo && !product.oldPrice) return false;
    if (filters.stock && product.stock <= 0) return false;
    return true;
  });
}

export function sortProducts(products: Product[], sort: string): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "nouveautes":
      return sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    case "prix-croissant":
      return sorted.sort((a, b) => a.price - b.price);
    case "prix-decroissant":
      return sorted.sort((a, b) => b.price - a.price);
    case "populaires":
      return sorted.sort((a, b) => b.popularity - a.popularity);
    case "meilleures-remises":
      return sorted.sort((a, b) => {
        const discountA = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
        const discountB = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
        return discountB - discountA;
      });
    default:
      return sorted;
  }
}

export function buildQuery(current: URLSearchParams, patch: CatalogQueryPatch): string {
  const next = new URLSearchParams(current);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === undefined || value === "" || value === false || value === 0) {
      next.delete(key);
    } else {
      next.set(key, value === true ? "1" : String(value));
    }
  }
  return next.toString();
}