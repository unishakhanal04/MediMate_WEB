import { Medicine } from "../../services/medicine.service";

interface MedicineCardProps {
  medicine: Medicine;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<Medicine["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  inactive: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  completed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const statusIcons: Record<Medicine["status"], string> = {
  active: "🟢",
  inactive: "🔴",
  completed: "✔️",
};

const frequencyStyles: Record<Medicine["frequency"], string> = {
  daily: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  weekly: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  as_needed: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
};

const frequencyIcons: Record<Medicine["frequency"], string> = {
  daily: "🔁",
  weekly: "📆",
  as_needed: "⚡",
};

const frequencyLabels: Record<Medicine["frequency"], string> = {
  daily: "Daily",
  weekly: "Weekly",
  as_needed: "As Needed",
};

export function MedicineCard({ medicine, onEdit, onDelete }: MedicineCardProps) {
  return (
    <div className="flex h-full flex-col divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-3 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {medicine.name}
          </h3>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{medicine.dosage}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[medicine.status]}`}
        >
          <span aria-hidden="true">{statusIcons[medicine.status]}</span>
          {medicine.status}
        </span>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 sm:px-6">
        <span
          className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${frequencyStyles[medicine.frequency]}`}
        >
          <span aria-hidden="true">{frequencyIcons[medicine.frequency]}</span>
          {frequencyLabels[medicine.frequency]}
        </span>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500">
            <span aria-hidden="true">⏰</span> Schedule
          </p>
          <div className="flex flex-wrap gap-2">
            {medicine.times.map((time) => (
              <span
                key={time}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-5 py-4 text-sm sm:px-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Start Date</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {new Date(medicine.startDate).toLocaleDateString()}
          </span>
        </div>
        {medicine.endDate && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">End Date</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(medicine.endDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {(medicine.quantity !== undefined || medicine.refillThreshold !== undefined) && (
        <div className="flex flex-wrap gap-2 px-5 py-4 sm:px-6">
          {medicine.quantity !== undefined && (
            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              Quantity: {medicine.quantity}
            </span>
          )}
          {medicine.refillThreshold !== undefined && (
            <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              Refill at: {medicine.refillThreshold}
            </span>
          )}
        </div>
      )}

      {medicine.notes && (
        <div className="px-5 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:px-6">
          <span className="font-medium text-gray-700 dark:text-gray-300">Notes: </span>
          {medicine.notes}
        </div>
      )}

      <div className="mt-auto flex gap-2 px-5 py-4 sm:px-6">
        <button
          onClick={() => onEdit(medicine)}
          className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(medicine._id)}
          className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
