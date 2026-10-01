import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FavoritesState = {
  productIds: string[];
  toggleFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  setProductIds: (productIds: string[]) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      productIds: [],
      toggleFavorite: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),
      removeFavorite: (productId) =>
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        })),
      setProductIds: (productIds) => set({ productIds: [...new Set(productIds)] }),
    }),
    {
      name: "kora-mode-favorites",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);