import { Card } from "./Card";

interface TodaysProgressProps {
  taken: number;
  total: number;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TodaysProgress({ taken, total }: TodaysProgressProps) {
  const percent = total > 0 ? Math.min(Math.max((taken / total) * 100, 0), 100) : 0;
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <Card className="flex items-center gap-5">
      <svg width="100" height="100" viewBox="0 0 100 100" className="flex-shrink-0 -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          className="stroke-gray-100 dark:stroke-gray-800"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="stroke-blue-600 transition-[stroke-dashoffset] duration-500 dark:stroke-blue-400"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90 fill-gray-900 text-[22px] font-extrabold dark:fill-white"
          style={{ transformOrigin: "50px 50px" }}
        >
          {Math.round(percent)}%
        </text>
      </svg>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Today&apos;s Progress
        </p>
        <p className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
          {taken}/{total}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">medicines taken today</p>
      </div>
    </Card>
  );
}
