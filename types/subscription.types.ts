export type SubscriptionPlan = "free" | "premium";

export interface SubscriptionStatus {
  plan: SubscriptionPlan;
  status: "active" | "expired" | "cancelled" | null;
  expiresAt: string | null;
  priceNpr: number;
}

export interface InitiatePaymentResponse {
  paymentUrl: string;
  fields: Record<string, string>;
  transactionUuid: string;
}

export interface PaymentHistoryItem {
  id: string;
  transactionUuid: string;
  amount: number;
  gateway: string;
  status: string;
  esewaRefId?: string;
  createdAt: string;
}

export interface VerifyPaymentResponse {
  status: "success" | "failed" | "pending";
  subscription: SubscriptionStatus;
}

export interface AiUsage {
  isPremium: boolean;
  used: number;
  limit: number | null;
}
