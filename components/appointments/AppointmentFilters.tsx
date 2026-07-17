import { SearchBar } from "../common/SearchBar";
import { FilterBar, FilterConfig } from "../common/FilterBar";
import { AppointmentFilterParams, AppointmentStatus } from "../../types/appointment.types";

interface AppointmentFiltersProps {
  filters: AppointmentFilterParams;
  onFiltersChange: (filters: AppointmentFilterParams) => void;
}

const statusOptions: { label: string; value: AppointmentStatus | "all" }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const sortOptions = [
  { label: "Date: Soonest first", value: "asc" },
  { label: "Date: Latest first", value: "desc" },
];

export function AppointmentFilters({ filters, onFiltersChange }: AppointmentFiltersProps) {
  const update = (patch: Partial<AppointmentFilterParams>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  const filterConfigs: FilterConfig[] = [
    {
      key: "status",
      ariaLabel: "Filter by status",
      value: filters.status ?? "all",
      options: statusOptions,
    },
    {
      key: "sortOrder",
      ariaLabel: "Sort by date",
      value: filters.sortOrder ?? "asc",
      options: sortOptions,
    },
  ];

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      update({ status: value === "all" ? undefined : (value as AppointmentStatus) });
    } else if (key === "sortOrder") {
      update({ sortOrder: value as "asc" | "desc" });
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchBar
        value={filters.search ?? ""}
        onChange={(value) => update({ search: value })}
        placeholder="Search appointments..."
        className="w-full sm:max-w-sm"
      />
      <FilterBar filters={filterConfigs} onChange={handleFilterChange} />
    </div>
  );
}
