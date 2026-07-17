import Link from "next/link";
import { Card } from "../dashboard/Card";
import { Prescription, getPrescriptionDisplayStatus } from "../../types/prescription.types";

interface PrescriptionCardProps {
  prescription: Prescription;
  onEdit: (prescription: Prescription) => void;
  onDelete: (id: string) => void;
}

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  expired: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export function PrescriptionCard({ prescription, onEdit, onDelete }: PrescriptionCardProps) {
  const status = getPrescriptionDisplayStatus(prescription);

  return (
    <Card className="flex h-full flex-col gap-4">
      <Link
        href={`/user/prescriptions/${prescription._id}`}
        className="flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">{prescription.title}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{prescription.doctorName}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}
        >
          {status}
        </span>
      </Link>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Prescribed</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {new Date(prescription.prescriptionDate).toLocaleDateString()}
          </span>
        </div>
        {prescription.expiryDate && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Expires</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(prescription.expiryDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {prescription.medicines.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {prescription.medicines.map((medicine) => (
            <span
              key={medicine}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              {medicine}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex gap-2">
        <button
          onClick={() => onEdit(prescription)}
          className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(prescription._id)}
          className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
        >
          Delete
        </button>
      </div>
    </Card>
  );
}
