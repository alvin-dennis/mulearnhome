import type { LucideIcon } from "lucide-react";

export interface DonationTier {
  id: string;
  label: string;
  amount: number;
  description: string;
  icon: LucideIcon | string;
}

export interface DonationCategory {
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface DonationFormPayload {
  amount: number;
  name: string;
  donationName?: string;
  email: string;
  mobile: string;
  pan: string;
  address?: string;
  donationType: "one-time" | "monthly" | "yearly";
  isOrganisation: boolean;
  organisationName?: string;
  currency?: string;
}

export interface RazorpayOrderResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpaySubscriptionResponse {
  razorpay_subscription_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}
