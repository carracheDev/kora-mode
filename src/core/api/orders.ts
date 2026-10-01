import { products } from "@/brands/mode/products";
import type { Order, OrderStatus, PaymentStatus } from "@/core/types";
import { koraApi } from "./client";

type ApiOrderItem = {
  product_slug: string;
  quantity: number;
  size: string | null;
  color: string | null;
  unit_price: number;
  discount_amount: number;
};

export type PaymentDriver = "simulation" | "fedapay" | "cod";

export type ApiOrder = {
  order_number: string;
  customer: { name: string; email: string | null; phone: string; city: string; address: string };
  items: ApiOrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  promo_code: string | null;
  total: number;
  status: OrderStatus;
  payment_method: NonNullable<Order["paymentMethod"]>;
  payment_status: "pending" | "unpaid" | "paid" | "failed";
  payment_driver?: PaymentDriver;
  payment_url: string | null;
  created_at: string;
};

export type CreateOrderPayload = {
  customer: { name: string; email?: string; phone: string; city: string; address: string };
  payment_method: NonNullable<Order["paymentMethod"]>;
  promo_code?: string;
  items: Array<{ product_slug: string; quantity: number; size?: string; color?: string; bundle_id?: string }>;
};

export function toLocalOrder(order: ApiOrder): Order {
  const bundleDiscount = order.items.reduce((sum, item) => sum + item.discount_amount, 0);
  const promoDiscount = Math.max(0, order.discount_amount - bundleDiscount);

  return {
    id: order.order_number,
    items: order.items.map((item) => {
      const product = products.find((current) => current.slug === item.product_slug);
      const discountPercent = item.discount_amount && item.unit_price * item.quantity
        ? Math.round((item.discount_amount / (item.unit_price * item.quantity)) * 100)
        : undefined;
      return {
        productId: product?.id ?? item.product_slug,
        quantity: item.quantity,
        size: item.size ?? undefined,
        color: item.color ?? undefined,
        bundleId: discountPercent ? "complete-look-10" : undefined,
        discountPercent,
      };
    }),
    subtotal: order.subtotal,
    deliveryFee: order.delivery_fee,
    total: order.total,
    status: order.status,
    createdAt: order.created_at,
    customerName: order.customer.name,
    customerPhone: order.customer.phone,
    customerCity: order.customer.city,
    customerAddress: order.customer.address,
    paymentMethod: order.payment_method,
    paymentStatus: paymentStatusFromApi(order.payment_status),
    promoCode: order.promo_code ?? undefined,
    promoDiscount: promoDiscount || undefined,
  };
}

function paymentStatusFromApi(status: ApiOrder["payment_status"]): PaymentStatus {
  if (status === "paid") return "succeeded";
  if (status === "failed") return "failed";
  return "pending";
}

export async function createApiOrder(payload: CreateOrderPayload): Promise<ApiOrder> {
  const response = await koraApi<{ data: ApiOrder }>("/orders", { method: "POST", body: payload });
  return response.data;
}

export async function fetchApiOrder(orderNumber: string): Promise<ApiOrder> {
  const response = await koraApi<{ data: ApiOrder }>(`/orders/${encodeURIComponent(orderNumber)}`, {});
  return response.data;
}

export async function startApiPayment(orderNumber: string): Promise<{ simulation: boolean; payment_url?: string }> {
  const response = await koraApi<{ data: { simulation?: boolean; payment_url?: string } }>(
    `/orders/${encodeURIComponent(orderNumber)}/payments`,
    { method: "POST", body: {} },
  );
  return { simulation: response.data.simulation === true, payment_url: response.data.payment_url };
}

export async function simulateApiPayment(orderNumber: string, outcome: "succeeded" | "failed" | "pending"): Promise<ApiOrder> {
  const response = await koraApi<{ data: ApiOrder }>(
    `/orders/${encodeURIComponent(orderNumber)}/payment-simulation`,
    { method: "POST", body: { outcome } },
  );
  return response.data;
}
