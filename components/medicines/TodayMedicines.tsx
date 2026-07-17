import { TodayMedicine } from "../../types/medicine.types";

interface TodayMedicinesProps {
  medicines: TodayMedicine[];
  onMedicineTaken: (medicineId: string, scheduledTime: string) => void;
}

const statusStyles: Record<TodayMedicine["status"], string> = {
  taken: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  skipped: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  missed: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const statusIcons: Record<TodayMedicine["status"], string> = {
  taken: "✔️",
  pending: "⏳",
  skipped: "⏭️",
  missed: "⚠️",
};

const statusLabels: Record<TodayMedicine["status"], string> = {
  taken: "Taken",
  pending: "Pending",
  skipped: "Skipped",
  missed: "Missed",
};

export function TodayMedicines({ medicines, onMedicineTaken }: TodayMedicinesProps) {
  if (medicines.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">No medicines scheduled for today.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
      {medicines.map((medicine) => (
        <div
          key={`${medicine._id}-${medicine.time}`}
          className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{medicine.name}</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {medicine.dosage} • {medicine.time}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[medicine.status]}`}
            >
              <span aria-hidden="true">{statusIcons[medicine.status]}</span>
              {statusLabels[medicine.status]}
            </span>

            {medicine.status === "pending" && (
              <button
                onClick={() => onMedicineTaken(medicine._id, medicine.time)}
                className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Mark as Taken
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
