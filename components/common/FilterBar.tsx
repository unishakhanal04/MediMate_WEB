export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  ariaLabel: string;
  value: string;
  options: FilterOption[];
}

interface FilterBarProps {
  filters: FilterConfig[];
  onChange: (key: string, value: string) => void;
  className?: string;
}

export function FilterBar({ filters, onChange, className = "" }: FilterBarProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {filters.map((filter) => (
        <select
          key={filter.key}
          value={filter.value}
          onChange={(e) => onChange(filter.key, e.target.value)}
          aria-label={filter.ariaLabel}
          className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
