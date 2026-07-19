import Link from "next/link";
import { Prescription } from "../../types/prescription.types";
import { StatusBadge } from "../common/StatusBadge";

interface PastPrescriptionsTableProps {
  prescriptions: Prescription[];
  onDelete: (id: string) => void;
}

export function PastPrescriptionsTable({ prescriptions, onDelete }: PastPrescriptionsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            <th scope="col" className="px-4 py-3">Medication</th>
            <th scope="col" className="px-4 py-3">Doctor</th>
            <th scope="col" className="px-4 py-3">Expired On</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription) => (
            <tr
              key={prescription._id}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{prescription.title}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{prescription.doctorName}</td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                {prescription.expiryDate ? new Date(prescription.expiryDate).toLocaleDateString() : "-"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status="expired" />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-3">
                  <Link
                    href={`/user/prescriptions/${prescription._id}`}
                    className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => onDelete(prescription._id)}
                    className="text-xs font-semibold text-red-600 hover:underline dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
