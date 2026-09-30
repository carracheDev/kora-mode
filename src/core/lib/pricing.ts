import type { CartItem, Product } from "@/core/types";

type ProductLookup = (productId: string) => Product | undefined;

export function getCartItemTotal(item: CartItem, product: Product | undefined): number {
  if (!product) return 0;
  const quantity = Math.max(0, Math.floor(item.quantity));
  const percent = Math.min(100, Math.max(0, item.discountPercent ?? 0));
  return Math.round(product.price * quantity * (1 - percent / 100));
}

export function getCartSubtotal(items: CartItem[], getProduct: ProductLookup): number {
  return items.reduce((sum, item) => sum + getCartItemTotal(item, getProduct(item.productId)), 0);
}

export function getEligibleSubtotal(items: CartItem[], eligibleIds: string[], getProduct: ProductLookup): number {
  return items.reduce((sum, item) => eligibleIds.includes(item.productId)
    ? sum + getCartItemTotal(item, getProduct(item.productId))
    : sum, 0);
}

export function getPromoDiscount(subtotal: number, eligibleSubtotal: number, percent: number): number {
  return Math.min(subtotal, Math.round(eligibleSubtotal * Math.min(100, Math.max(0, percent)) / 100));
}
