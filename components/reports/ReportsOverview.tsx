import { ReportsOverview as ReportsOverviewData } from "../../types/report.types";
import { StatisticsCards } from "./StatisticsCards";

interface ReportsOverviewProps {
  overview: ReportsOverviewData;
}

export function ReportsOverview({ overview }: ReportsOverviewProps) {
  return (
    <div className="flex flex-col gap-3">
      {overview.memberSince && (
        <p className="text-sm text-gray-500">
          Member since {new Date(overview.memberSince).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
      <StatisticsCards overview={overview} />
    </div>
  );
}
