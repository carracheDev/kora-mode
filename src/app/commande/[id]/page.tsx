import { OrderConfirmationClient } from "@/components/checkout/OrderConfirmationClient";

type OrderConfirmationPageProps = PageProps<"/commande/[id]">;

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { id } = await params;
  return <OrderConfirmationClient orderId={id} />;
}
