import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/core/types";
import { products } from "@/brands/mode/products";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string, color?: string, bundleId?: string) => void;
  setQuantity: (productId: string, quantity: number, size?: string, color?: string, bundleId?: string) => void;
  clearCart: () => void;
};

const matchesVariant = (item: CartItem, target: CartItem) =>
  item.productId === target.productId &&
  item.size === target.size &&
  item.color === target.color &&
  item.bundleId === target.bundleId;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const product = products.find((current) => current.id === item.productId);
          if (!product || product.stock <= 0) return state;
          const alreadyInCart = state.items.reduce((sum, current) => current.productId === item.productId ? sum + current.quantity : sum, 0);
          const quantityToAdd = Math.min(Math.max(0, Math.floor(item.quantity)), Math.max(0, product.stock - alreadyInCart));
          if (quantityToAdd === 0) return state;
          const existing = state.items.find((current) => matchesVariant(current, item));
          if (!existing) return { items: [...state.items, { ...item, quantity: quantityToAdd }] };
          return {
            items: state.items.map((current) =>
              matchesVariant(current, item)
                ? { ...current, quantity: current.quantity + quantityToAdd }
                : current,
            ),
          };
        }),
      removeItem: (productId, size, color, bundleId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.productId !== productId || item.size !== size || item.color !== color || item.bundleId !== bundleId,
          ),
        })),
      setQuantity: (productId, quantity, size, color, bundleId) =>
        set((state) => {
          const isTarget = (item: CartItem) => item.productId === productId && item.size === size && item.color === color && item.bundleId === bundleId;
          if (quantity <= 0) return { items: state.items.filter((item) => !isTarget(item)) };
          const product = products.find((current) => current.id === productId);
          if (!product) return state;
          const reservedByOtherLines = state.items.reduce((sum, item) => item.productId === productId && !isTarget(item) ? sum + item.quantity : sum, 0);
          const allowedQuantity = Math.max(0, Math.min(Math.floor(quantity), product.stock - reservedByOtherLines));
          return {
            items: allowedQuantity === 0
              ? state.items.filter((item) => !isTarget(item))
              : state.items.map((item) => isTarget(item) ? { ...item, quantity: allowedQuantity } : item),
          };
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "kora-mode-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);