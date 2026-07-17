import Link from "next/link";
import { RefillAlert as RefillAlertData } from "../../services/reports.service";

interface RefillAlertProps {
  alerts: RefillAlertData[];
}

export function RefillAlert({ alerts }: RefillAlertProps) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 flex flex-col gap-3">
      {alerts.map((alert) => (
        <div
          key={alert._id}
          className="flex flex-col items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-500/20 dark:bg-amber-500/10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl" aria-hidden="true">
              ⚠️
            </span>
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">{alert.name} Refill Needed</p>
              <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                {alert.dosage} • {alert.quantity} left (refill at {alert.refillThreshold})
              </p>
            </div>
          </div>

          <Link
            href="/user/medicines"
            className="shrink-0 rounded-full bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
          >
            Refill Now
          </Link>
        </div>
      ))}
    </div>
  );
}
