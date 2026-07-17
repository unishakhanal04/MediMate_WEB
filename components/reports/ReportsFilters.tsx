import { FilterBar, FilterConfig } from "../common/FilterBar";
import { ReportPeriod } from "../../types/report.types";

interface ReportsFiltersProps {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  days: number;
  onDaysChange: (days: number) => void;
}

const periodOptions = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
];

const daysOptions = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

export function ReportsFilters({ period, onPeriodChange, days, onDaysChange }: ReportsFiltersProps) {
  const filters: FilterConfig[] = [
    { key: "period", ariaLabel: "Adherence chart period", value: period, options: periodOptions },
    { key: "days", ariaLabel: "Medicine progress range", value: String(days), options: daysOptions },
  ];

  const handleChange = (key: string, value: string) => {
    if (key === "period") {
      onPeriodChange(value as ReportPeriod);
    } else if (key === "days") {
      onDaysChange(Number(value));
    }
  };

  return <FilterBar filters={filters} onChange={handleChange} className="mb-6" />;
}
