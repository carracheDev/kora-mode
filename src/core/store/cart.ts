import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/core/types";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  setQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
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
          const existing = state.items.find((current) => matchesVariant(current, item));
          if (!existing) return { items: [...state.items, item] };
          return {
            items: state.items.map((current) =>
              matchesVariant(current, item)
                ? { ...current, quantity: current.quantity + item.quantity }
                : current,
            ),
          };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.productId !== productId || item.size !== size || item.color !== color,
          ),
        })),
      setQuantity: (productId, quantity, size, color) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (item) => item.productId !== productId || item.size !== size || item.color !== color,
                )
              : state.items.map((item) =>
                  item.productId === productId && item.size === size && item.color === color
                    ? { ...item, quantity }
                    : item,
                ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "kora-mode-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);