import Link from "next/link";

interface ProfileCompletionProps {
  percent: number;
}

export function ProfileCompletion({ percent }: ProfileCompletionProps) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-indigo-50 p-6 dark:bg-indigo-500/10 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <svg width="56" height="56" viewBox="0 0 56 56" className="flex-shrink-0 -rotate-90">
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
            stroke="#2563EB"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <text
            x="28"
            y="28"
            textAnchor="middle"
            dominantBaseline="central"
            className="rotate-90 fill-gray-900 dark:fill-white"
            style={{ transform: "rotate(90deg)", transformOrigin: "28px 28px", fontSize: "13px", fontWeight: 700 }}
          >
            {percent}%
          </text>
        </svg>

        <div>
          <p className="text-base font-bold text-gray-900 dark:text-white">Complete Your Profile</p>
          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
            Add your medical details to get personalized health insights.
          </p>
        </div>
      </div>

      <Link
        href="/user/profile"
        className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Complete Profile
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
