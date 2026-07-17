export type MedicineFilterValue =
  | "all"
  | "active"
  | "completed"
  | "daily"
  | "weekly"
  | "as_needed";

interface MedicineFiltersProps {
  selectedFilter: MedicineFilterValue;
  onFilterChange: (filter: MedicineFilterValue) => void;
}

const filters: { label: string; value: MedicineFilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "As Needed", value: "as_needed" },
];

export function MedicineFilters({ selectedFilter, onFilterChange }: MedicineFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onFilterChange(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isSelected
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
