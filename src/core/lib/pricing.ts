import type { CartItem, Product } from "@/core/types";

type ProductLookup = (productId: string) => Product | undefined;

export function getCartItemBaseTotal(item: CartItem, product: Product | undefined): number {
  if (!product) return 0;
  return product.price * Math.max(0, Math.floor(item.quantity));
}

export function getCartItemTotal(item: CartItem, product: Product | undefined): number {
  const baseTotal = getCartItemBaseTotal(item, product);
  const percent = Math.min(100, Math.max(0, item.discountPercent ?? 0));
  return Math.round(baseTotal * (1 - percent / 100));
}

export function getCartItemDiscount(item: CartItem, product: Product | undefined): number {
  return getCartItemBaseTotal(item, product) - getCartItemTotal(item, product);
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
