import type { Metadata } from "next";
import { AccountPageClient } from "@/components/account/CustomerPages";

export const metadata: Metadata = { title: "Mon compte | KORA MODE", robots: { index: false, follow: false } };

export default function AccountPage() {
  return <AccountPageClient />;
}
