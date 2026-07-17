import { Card } from "../dashboard/Card";

export interface StatItem {
  label: string;
  value: string | number;
  icon?: string;
}

interface StatsCardsProps {
  stats: StatItem[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex items-center gap-4">
          {stat.icon && (
            <span
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-500/10"
              aria-hidden="true"
            >
              {stat.icon}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
