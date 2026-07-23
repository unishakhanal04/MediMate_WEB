import Link from "next/link";

export default function SubscriptionFailurePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="text-4xl" aria-hidden="true">⚠️</span>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Payment cancelled or failed</h1>
      <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
        No changes were made to your subscription. You can try again anytime.
      </p>
      <Link href="/user/subscription" className="font-semibold text-blue-600 hover:underline">
        Back to Subscription
      </Link>
    </div>
  );
}
