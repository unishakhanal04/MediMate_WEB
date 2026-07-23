import Link from "next/link";
import { Prescription, getPrescriptionDisplayStatus } from "../../types/prescription.types";

interface PrescriptionCardProps {
  prescription: Prescription;
  onEdit: (prescription: Prescription) => void;
  onDelete: (id: string) => void;
}

const borderStyles = {
  active: "border-gray-200 dark:border-gray-800",
  expired: "border-red-200 dark:border-red-900/40",
};

const idBadgeStyles = {
  active: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  expired: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const dotStyles = {
  active: "bg-emerald-500",
  expired: "bg-red-500",
};

const ctaStyles = {
  active: "bg-blue-600 text-white hover:bg-blue-700",
  expired: "bg-red-600 text-white hover:bg-red-700",
};

export function PrescriptionCard({ prescription, onEdit, onDelete }: PrescriptionCardProps) {
  const status = getPrescriptionDisplayStatus(prescription);
  const detailHref = `/user/prescriptions/${prescription._id}`;
  const shortId = prescription._id.slice(-6).toUpperCase();

  return (
    <div
      className={`flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-900 ${borderStyles[status]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-500/10"
          aria-hidden="true"
        >
          📄
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${idBadgeStyles[status]}`}
          >
            {status === "expired" ? "EXPIRED" : `ID: #${shortId}`}
          </span>
          <button
            onClick={() => onDelete(prescription._id)}
            aria-label="Delete prescription"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <Link
          href={detailHref}
          className="block truncate text-base font-bold text-blue-600 hover:underline dark:text-blue-400"
        >
          {prescription.title}
        </Link>
        <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
          {prescription.doctorName}
          {prescription.hospital ? ` · ${prescription.hospital}` : ""}
        </p>
        {prescription.diagnosis && (
          <p className="mt-1 truncate text-xs text-gray-400 dark:text-gray-500">{prescription.diagnosis}</p>
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

      <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Issued By
          </p>
          <p className="mt-1 truncate font-medium text-gray-900 dark:text-white">{prescription.doctorName}</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Expires
          </p>
          <p
            className={`mt-1 truncate font-medium ${
              status === "expired" ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"
            }`}
          >
            {prescription.expiryDate ? new Date(prescription.expiryDate).toLocaleDateString() : "No expiry"}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
          <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status]}`} aria-hidden="true" />
          {status === "expired" ? "Needs Renewal" : "Active"}
        </span>
        <Link
          href={detailHref}
          className="text-xs font-semibold text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Details
        </Link>
        <button
          onClick={() => onEdit(prescription)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${ctaStyles[status]}`}
        >
          {status === "expired" ? "Renew" : "Edit"}
        </button>
      </div>
    </div>
  );
}
