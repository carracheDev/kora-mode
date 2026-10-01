import { products as demoProducts } from "@/brands/mode/products";
import type { Product } from "@/core/types";

type ApiCategory = { id: number; name: string; slug: string };
type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: ApiCategory;
  gender: Product["gender"];
  subcategory: Product["subcategory"];
  price: number;
  old_price: number | null;
  images: string[];
  sizes: string[];
  colors: Product["colors"];
  stock: number;
  tags: string[];
  rating: number | null;
  popularity: number;
  created_at: string;
};
type ApiEnvelope<T> = { data: T };

type ApiRequestOptions = Omit<RequestInit, "body"> & { body?: unknown; token?: string | null };

export class KoraApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly payload: unknown) {
    super(message);
    this.name = "KoraApiError";
  }
}

function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_KORA_API_URL ?? "http://localhost:8080/api/v1";
  return url.replace(/\/+$/, "");
}

export function getApiToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem("kora-api-token");
}

export function saveApiToken(token: string): void {
  window.sessionStorage.setItem("kora-api-token", token);
}

export function clearApiToken(): void {
  if (typeof window !== "undefined") window.sessionStorage.removeItem("kora-api-token");
}

export async function koraApi<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  const token = options.token === undefined ? getApiToken() : options.token;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
      ? payload.message
      : `La requête API a échoué (${response.status}).`;
    throw new KoraApiError(message, response.status, payload);
  }

  return payload as T;
}

function mapApiProduct(apiProduct: ApiProduct): Product {
  const localProduct = demoProducts.find((product) => product.slug === apiProduct.slug);

  return {
    id: localProduct?.id ?? apiProduct.slug,
    slug: apiProduct.slug,
    name: apiProduct.name,
    category: apiProduct.category?.name ?? localProduct?.category ?? "Collection",
    gender: apiProduct.gender ?? localProduct?.gender ?? "mixte",
    subcategory: apiProduct.subcategory ?? localProduct?.subcategory ?? "Hauts",
    price: apiProduct.price,
    oldPrice: apiProduct.old_price ?? undefined,
    images: apiProduct.images?.length ? apiProduct.images : localProduct?.images ?? [],
    sizes: apiProduct.sizes ?? [],
    colors: apiProduct.colors ?? [],
    stock: apiProduct.stock,
    tags: apiProduct.tags ?? [],
    rating: apiProduct.rating ?? 0,
    createdAt: apiProduct.created_at,
    popularity: apiProduct.popularity ?? 0,
    description: apiProduct.description,
  };
}

export async function fetchCatalogProducts(): Promise<Product[]> {
  try {
    const response = await koraApi<{ data: ApiProduct[] }>("/products?per_page=48", { token: null });
    return response.data.map(mapApiProduct);
  } catch {
    return demoProducts;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await koraApi<ApiEnvelope<ApiProduct>>(`/products/${encodeURIComponent(slug)}`, { token: null });
    return mapApiProduct(response.data);
  } catch {
    return demoProducts.find((product) => product.slug === slug) ?? null;
  }
}
