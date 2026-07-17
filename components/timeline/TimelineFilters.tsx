import { FilterBar, FilterConfig } from "../common/FilterBar";
import { TimelineEventType } from "../../types/timeline.types";

interface TimelineFiltersProps {
  type: TimelineEventType | "all";
  onTypeChange: (type: TimelineEventType | "all") => void;
  from: string;
  onFromChange: (from: string) => void;
  to: string;
  onToChange: (to: string) => void;
}

const typeOptions = [
  { label: "All events", value: "all" },
  { label: "Medicine added", value: "medicine_added" },
  { label: "Medicine taken", value: "medicine_taken" },
  { label: "Medicine skipped", value: "medicine_skipped" },
  { label: "Medicine missed", value: "medicine_missed" },
  { label: "Prescription uploaded", value: "prescription_uploaded" },
  { label: "Appointment", value: "appointment" },
  { label: "AI conversation", value: "ai_conversation" },
  { label: "Profile updated", value: "profile_updated" },
];

export function TimelineFilters({
  type,
  onTypeChange,
  from,
  onFromChange,
  to,
  onToChange,
}: TimelineFiltersProps) {
  const filters: FilterConfig[] = [
    { key: "type", ariaLabel: "Filter by event type", value: type, options: typeOptions },
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <FilterBar
        filters={filters}
        onChange={(_, value) => onTypeChange(value as TimelineEventType | "all")}
      />

      <label className="flex items-center gap-2 text-sm text-gray-600">
        From
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          aria-label="Filter events from date"
          className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-500"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        To
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          aria-label="Filter events to date"
          className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-500"
        />
      </label>
    </div>
  );
}
