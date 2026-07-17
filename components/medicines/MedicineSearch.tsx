interface MedicineSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MedicineSearch({ value, onChange }: MedicineSearchProps) {
  return (
    <div className="relative mb-6 w-full sm:max-w-sm">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search medicines..."
        className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500"
      />
    </div>
  );
}
