import { PrescriptionFilterParams, PrescriptionDisplayStatus } from "../../types/prescription.types";

interface PrescriptionFiltersProps {
  filters: PrescriptionFilterParams;
  onFiltersChange: (filters: PrescriptionFilterParams) => void;
}

const statusOptions: { label: string; value: PrescriptionDisplayStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
];

export function PrescriptionFilters({ filters, onFiltersChange }: PrescriptionFiltersProps) {
  const update = (patch: Partial<PrescriptionFilterParams>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500">
          🔍
        </span>
        <input
          type="text"
          value={filters.search ?? ""}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search prescriptions..."
          aria-label="Search prescriptions"
          className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      <select
        value={filters.status ?? "all"}
        onChange={(e) =>
          update({
            status: e.target.value === "all" ? undefined : (e.target.value as PrescriptionDisplayStatus),
          })
        }
        aria-label="Filter by status"
        className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={filters.doctorName ?? ""}
        onChange={(e) => update({ doctorName: e.target.value })}
        placeholder="Filter by doctor..."
        aria-label="Filter by doctor"
        className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={filters.fromDate ?? ""}
          onChange={(e) => update({ fromDate: e.target.value })}
          aria-label="From date"
          className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <span className="text-gray-400">–</span>
        <input
          type="date"
          value={filters.toDate ?? ""}
          onChange={(e) => update({ toDate: e.target.value })}
          aria-label="To date"
          className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
}
