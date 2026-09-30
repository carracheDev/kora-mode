import type { Campaign as CampaignDefinition } from "@/campaigns/types";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  gender: "femme" | "homme" | "mixte";
  subcategory: "Vestes" | "Pantalons" | "Hauts" | "Jeans" | "Sacs" | "Chaussures";
  price: number;
  oldPrice?: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  tags: string[];
  rating: number;
  createdAt: string;
  popularity: number;
  description: string;
};

export type CartItem = {
  productId: Product["id"];
  quantity: number;
  size?: string;
  color?: string;
  bundleId?: string;
  discountPercent?: number;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "succeeded" | "failed";

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerCity?: string;
  customerAddress?: string;
  paymentMethod?: "mtn" | "moov" | "celtiis" | "cod";
  paymentStatus?: PaymentStatus;
  promoCode?: string;
  promoDiscount?: number;
};

export type Campaign = CampaignDefinition;