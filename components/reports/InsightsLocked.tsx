import Link from "next/link";
import { Card } from "../dashboard/Card";

export function InsightsLocked() {
  return (
    <Card className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl dark:bg-blue-500/10" aria-hidden="true">
        ⭐
      </span>
      <h2 className="text-base font-bold text-gray-900 dark:text-white">Insights is a Premium feature</h2>
      <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
        Upgrade to Premium to see your adherence trend, most-missed medicine, best adherence day, and more.
      </p>
      <Link
        href="/user/subscription"
        className="mt-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Upgrade to Premium
      </Link>
    </Card>
  );
}
