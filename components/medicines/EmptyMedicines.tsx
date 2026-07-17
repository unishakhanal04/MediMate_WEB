interface EmptyMedicinesProps {
  onAddMedicine: () => void;
}

const benefits = [
  "Receive medication reminders",
  "Track daily adherence",
  "Monitor your health progress",
  "Get refill alerts",
];

export function EmptyMedicines({ onAddMedicine }: EmptyMedicinesProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
        💊
      </span>

      <h2 className="mt-6 text-xl font-bold text-gray-900 sm:text-2xl">
        Welcome to Medication Tracking
      </h2>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
        You haven&apos;t added any medicines yet. Add your medications to receive
        reminders, track adherence, and manage your health.
      </p>

      <ul className="mt-6 flex flex-col gap-2 text-left">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-center gap-2 text-sm text-gray-600 sm:text-base">
            <span className="text-emerald-600" aria-hidden="true">
              ✓
            </span>
            {benefit}
          </li>
        ))}
      </ul>

      <button
        onClick={onAddMedicine}
        className="mt-8 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:text-base"
      >
        Add Your First Medicine
      </button>
    </div>
  );
}
