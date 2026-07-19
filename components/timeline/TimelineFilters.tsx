import { TimelineEventType } from "../../types/timeline.types";

export type TimelineCategory = "all" | "medications" | "prescriptions" | "appointments";
export type TimelineRangePreset = "7" | "30" | "90" | "all";

export const CATEGORY_TYPES: Record<TimelineCategory, TimelineEventType[] | undefined> = {
  all: undefined,
  medications: ["medicine_added", "medicine_taken", "medicine_skipped", "medicine_missed"],
  prescriptions: ["prescription_uploaded"],
  appointments: ["appointment"],
};

const categoryTabs: { key: TimelineCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "medications", label: "Medications" },
  { key: "prescriptions", label: "Prescriptions" },
  { key: "appointments", label: "Appointments" },
];

const rangeOptions: { key: TimelineRangePreset; label: string }[] = [
  { key: "7", label: "Last 7 Days" },
  { key: "30", label: "Last 30 Days" },
  { key: "90", label: "Last 90 Days" },
  { key: "all", label: "All Time" },
];

interface TimelineFiltersProps {
  category: TimelineCategory;
  onCategoryChange: (category: TimelineCategory) => void;
  range: TimelineRangePreset;
  onRangeChange: (range: TimelineRangePreset) => void;
}

export function TimelineFilters({ category, onCategoryChange, range, onRangeChange }: TimelineFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800/60" role="tablist" aria-label="Filter timeline by category">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={category === tab.key}
            onClick={() => onCategoryChange(tab.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              category === tab.key
                ? "bg-white text-blue-600 shadow-sm dark:bg-gray-900 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span aria-hidden="true">📅</span>
        <select
          value={range}
          onChange={(e) => onRangeChange(e.target.value as TimelineRangePreset)}
          aria-label="Filter by date range"
          className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          {rangeOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
