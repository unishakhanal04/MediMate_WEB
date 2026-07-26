"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { subscriptionService } from "../../../services/subscription.service";
import { PaymentHistoryItem, SubscriptionStatus } from "../../../types/subscription.types";
import { redirectToEsewa } from "../../../lib/esewa";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card } from "../../../components/dashboard/Card";
import { Button } from "../../../components/Button";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";

const premiumBenefits = [
  "Unlimited AI Assistant messages",
  "Advanced Reports & Insights",
  "PDF export for your reports",
];

const paymentStatusStyle: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  failed: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export default function SubscriptionPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const fetchData = async () => {
    try {
      const [subscriptionData, paymentsData] = await Promise.all([
        subscriptionService.getCurrent(),
        subscriptionService.getPayments(),
      ]);
      setSubscription(subscriptionData);
      setPayments(paymentsData);
    } catch (error) {
      console.error("Failed to load subscription data:", error);
      toast.error("Unable to load your subscription details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const { paymentUrl, fields } = await subscriptionService.initiate();
      redirectToEsewa(paymentUrl, fields);
    } catch (error) {
      console.error("Failed to start payment:", error);
      const message = error instanceof Error ? error.message : "Unable to start the payment. Please try again.";
      toast.error(message);
      setUpgrading(false);
    }
  };


  if (!isAuthenticated) {
    return null;
  }

  if (loading || !subscription) {
    return (
      <div>
        <PageHeader icon="⭐" title="Subscription" description="Manage your MediMate plan." />
        <LoadingSpinner message="Loading your subscription..." />
      </div>
    );
  }

  const isPremium = subscription.plan === "premium";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon="⭐" title="Subscription" description="Manage your MediMate plan and billing." />

      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Current Plan
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {isPremium ? "Premium" : "Free"}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isPremium
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {isPremium ? "Active" : "No active subscription"}
          </span>
        </div>

        {isPremium && subscription.expiresAt && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Renews / expires on {new Date(subscription.expiresAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {premiumBenefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-emerald-600 dark:text-emerald-400" aria-hidden="true">
                {isPremium ? "✓" : "○"}
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        {!isPremium && (
          <div className="mt-2 flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upgrade for NPR {subscription.priceNpr} / month, billed via eSewa.
            </p>
            <Button onClick={handleUpgrade} disabled={upgrading}>
              {upgrading ? "Redirecting to eSewa..." : "Upgrade to Premium"}
            </Button>
          </div>
        )}
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Payment History</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                  <th scope="col" className="px-4 py-3">Transaction</th>
                  <th scope="col" className="px-4 py-3">Amount</th>
                  <th scope="col" className="px-4 py-3">Gateway</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                      {payment.transactionUuid.slice(0, 8)}…
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      NPR {payment.amount}
                    </td>
                    <td className="px-4 py-3 uppercase text-gray-600 dark:text-gray-400">{payment.gateway}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          paymentStatusStyle[payment.status] ?? paymentStatusStyle.pending
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
