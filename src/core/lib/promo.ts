import type { Product } from "@/core/types";

export function getDiscountPercent(product: Pick<Product, "price" | "oldPrice">): number {
  if (!product.oldPrice || product.oldPrice <= product.price || product.price < 0) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

export function isOfferActive(endsAt: string, now = Date.now()): boolean {
  const endTime = Date.parse(endsAt);
  return Number.isFinite(endTime) && endTime > now;
}