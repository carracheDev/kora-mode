import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Order, OrderStatus, PaymentStatus } from "@/core/types";

type OrdersState = {
  orders: Order[];
  addOrder: (order: Order) => void;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  setPaymentStatus: (orderId: string, status: PaymentStatus) => void;
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
      setPaymentStatus: (orderId, paymentStatus) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, paymentStatus, status: paymentStatus === "succeeded" ? "confirmed" : "pending" }
              : order,
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