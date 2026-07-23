import Link from "next/link";

interface ProfileCompletionProps {
  percent: number;
}

export function ProfileCompletion({ percent }: ProfileCompletionProps) {
  const isComplete = percent >= 100;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const ringColor = isComplete ? "#16A34A" : "#2563EB";

  return (
    <div
      className={`flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between ${
        isComplete ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-indigo-50 dark:bg-indigo-500/10"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center">
          <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
            <circle
              cx="28"
              cy="28"
              r={radius}
              fill="none"
              strokeWidth="5"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <circle
              cx="28"
              cy="28"
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute text-xs font-bold text-gray-900 dark:text-white">{percent}%</span>
        </div>

        <div>
          <p className="text-base font-bold text-gray-900 dark:text-white">
            {isComplete ? "Profile Complete" : "Complete Your Profile"}
          </p>
          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
            {isComplete
              ? "You're all set — your medical details are up to date."
              : "Add your medical details to get personalized health insights."}
          </p>
        </div>
      </div>

      <Link
        href="/user/profile"
        className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors ${
          isComplete ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isComplete ? "View Profile" : "Complete Profile"}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
