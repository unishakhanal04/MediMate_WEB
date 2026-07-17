import { Card } from "./Card";

const HEALTH_TIP =
  "Stay hydrated! Drinking 2L of water today helps with your medication absorption.";

export function HealthTip() {
  return (
    <Card className="flex items-start gap-3 sm:min-w-[320px]">
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg dark:bg-blue-500/10"
        aria-hidden="true"
      >
        💧
      </span>
      <div>
        <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Daily Health Tip</p>
        <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{HEALTH_TIP}</p>
      </div>
    </Card>
  );
}
