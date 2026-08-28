import type { Metadata } from "next";
import { RefundPolicyView } from "@/features/refund-policy";

export const metadata: Metadata = {
  title: "Refund Policy | Mulearn",
  description: "Mulearn Foundation refund policy and donation guidelines.",
};

export default async function RefundPolicyPage() {
  return <RefundPolicyView />;
}
