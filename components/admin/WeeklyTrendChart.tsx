import { Card } from "../dashboard/Card";
import { UserGrowthPoint } from "../../types/admin.types";

interface WeeklyTrendChartProps {
  title: string;
  points: UserGrowthPoint[];
  unitLabel: string;
  color?: string;
}

export function WeeklyTrendChart({ title, points, unitLabel, color = "bg-blue-500" }: WeeklyTrendChartProps) {
  const max = Math.max(...points.map((point) => point.count), 1);

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="flex items-end gap-2 overflow-x-auto pb-2" style={{ minHeight: "9rem" }}>
        {points.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={`w-full min-w-[1.5rem] rounded-t-md ${color}`}
              style={{ height: `${Math.max((point.count / max) * 100, 4)}px` }}
              title={`${point.count} ${unitLabel}`}
            />
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">{point.count}</span>
            <span className="whitespace-nowrap text-[11px] text-gray-400 dark:text-gray-500">{point.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
