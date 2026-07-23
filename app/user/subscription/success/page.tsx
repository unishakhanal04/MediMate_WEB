"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "../../../../contexts/ToastContext";
import { subscriptionService } from "../../../../services/subscription.service";

type VerifyState = "verifying" | "success" | "pending" | "failed";

function SuccessContent() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const [state, setState] = useState<VerifyState>("verifying");

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (!dataParam) {
      setState("failed");
      return;
    }

    try {
      const decoded = JSON.parse(atob(dataParam)) as { transaction_uuid?: string };
      if (!decoded.transaction_uuid) {
        setState("failed");
        return;
      }

      subscriptionService
        .verify(decoded.transaction_uuid)
        .then((result) => {
          setState(result.status);
          if (result.status === "success") toast.success("Welcome to Premium!");
        })
        .catch((error) => {
          console.error("Failed to verify payment:", error);
          setState("failed");
        });
    } catch (error) {
      console.error("Failed to decode eSewa response:", error);
      setState("failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      {state === "verifying" && <p className="text-sm text-gray-500 dark:text-gray-400">Verifying your payment...</p>}

      {state === "success" && (
        <>
          <span className="text-4xl" aria-hidden="true">🎉</span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">You&apos;re now Premium!</h1>
          <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Unlimited AI, Advanced Reports, and PDF export are unlocked.
          </p>
          <Link href="/user/subscription" className="font-semibold text-blue-600 hover:underline">
            View Subscription
          </Link>
        </>
      )}

      {state === "pending" && (
        <>
          <span className="text-4xl" aria-hidden="true">⏳</span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Payment pending</h1>
          <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Your payment is still processing with eSewa. Check back shortly.
          </p>
          <Link href="/user/subscription" className="font-semibold text-blue-600 hover:underline">
            Back to Subscription
          </Link>
        </>
      )}

      {state === "failed" && (
        <>
          <span className="text-4xl" aria-hidden="true">⚠️</span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Couldn&apos;t verify this payment</h1>
          <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
            If money was deducted, it should reflect after eSewa confirms the transaction — check your payment
            history in a few minutes.
          </p>
          <Link href="/user/subscription" className="font-semibold text-blue-600 hover:underline">
            Back to Subscription
          </Link>
        </>
      )}
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500 dark:text-gray-400">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
