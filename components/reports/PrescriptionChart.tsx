import { Card } from "../dashboard/Card";
import { StatusBadge } from "../common/StatusBadge";
import { PrescriptionsReport } from "../../types/report.types";

interface PrescriptionChartProps {
  report: PrescriptionsReport;
}

export function PrescriptionChart({ report }: PrescriptionChartProps) {
  const activeRatio =
    report.totalPrescriptions > 0
      ? Math.round((report.activePrescriptions / report.totalPrescriptions) * 100)
      : 0;

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-900">Prescriptions</h2>

      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-red-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${activeRatio}%` }} />
        </div>
        <span className="text-xs font-semibold text-gray-500">{activeRatio}% active</span>
      </div>

      <div className="flex gap-2 text-xs font-semibold">
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
          {report.activePrescriptions} Active
        </span>
        <span className="rounded-full bg-red-50 px-2 py-1 text-red-600">
          {report.expiredPrescriptions} Expired
        </span>
      </div>

      {report.recentPrescriptions.length === 0 ? (
        <p className="py-4 text-sm text-gray-500">No prescriptions uploaded yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {report.recentPrescriptions.map((prescription) => (
            <div key={prescription.id} className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{prescription.title}</p>
                <p className="text-xs text-gray-500">{prescription.doctorName}</p>
              </div>
              <StatusBadge status={prescription.status} className="shrink-0" />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
