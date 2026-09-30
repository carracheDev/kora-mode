import { CheckoutClient } from "@/components/checkout/CheckoutClient";

type CheckoutPageProps = {
  searchParams: Promise<{ code?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { code = "" } = await searchParams;
  return <CheckoutClient initialCode={code} />;
}
