import { apiFetch } from "./api-client";
import {
  InitiatePaymentResponse,
  PaymentHistoryItem,
  SubscriptionStatus,
  VerifyPaymentResponse,
} from "../types/subscription.types";

export const subscriptionService = {
  async getCurrent(): Promise<SubscriptionStatus> {
    return apiFetch<SubscriptionStatus>("/api/v1/subscription/current");
  },

  async getPayments(): Promise<PaymentHistoryItem[]> {
    return apiFetch<PaymentHistoryItem[]>("/api/v1/subscription/payments");
  },

  async initiate(): Promise<InitiatePaymentResponse> {
    return apiFetch<InitiatePaymentResponse>("/api/v1/subscription/initiate", { method: "POST" });
  },

  async verify(transactionUuid: string): Promise<VerifyPaymentResponse> {
    return apiFetch<VerifyPaymentResponse>("/api/v1/subscription/verify", {
      method: "POST",
      body: JSON.stringify({ transactionUuid }),
    });
  },
};
