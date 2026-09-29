import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/core/types";

type OrdersState = {
  orders: Order[];
  addOrder: (order: Order) => void;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      setOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        })),
    }),
    {
      name: "kora-mode-orders",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);