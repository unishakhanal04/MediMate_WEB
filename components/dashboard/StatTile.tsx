import { Card } from "./Card";

interface StatTileProps {
  label: string;
  value: string;
  badge?: string;
  sublabel?: string;
  progressPercent?: number;
  trend?: string;
}

export function StatTile({ label, value, badge, sublabel, progressPercent, trend }: StatTileProps) {
  return (
    <Card className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</p>

      <div className="flex items-center gap-2">
        <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</span>
        {badge && (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            {badge}
          </span>
        )}
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            ↗ {trend}
          </span>
        )}
      </div>

      {progressPercent !== undefined && (
        <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-1.5 rounded-full bg-blue-600 transition-all"
            style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
          />
        </div>
      )}

      {sublabel && <p className="text-xs text-gray-500 dark:text-gray-400">{sublabel}</p>}
    </Card>
  );
}
