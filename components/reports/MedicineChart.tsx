import { Card } from "../dashboard/Card";
import { MedicinesReport } from "../../types/report.types";

interface MedicineChartProps {
  report: MedicinesReport;
}

const progressColor = (percentage: number) => {
  if (percentage >= 80) return "#16a34a";
  if (percentage >= 50) return "#f59e0b";
  return "#dc2626";
};

export function MedicineChart({ report }: MedicineChartProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Medicine-wise Progress</h2>
        <div className="flex gap-2 text-xs font-semibold">
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            {report.activeMedicines} Active
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {report.completedMedicines} Completed
          </span>
          <span className="rounded-full bg-red-50 px-2 py-1 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {report.inactiveMedicines} Inactive
          </span>
        </div>
      </div>

      {report.medicineProgress.length === 0 ? (
        <p className="py-6 text-sm text-gray-500 dark:text-gray-400">Add an active medicine to see its progress here.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {report.medicineProgress.map((item) => (
            <div key={item.medicineId}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{item.adherencePercentage}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(item.adherencePercentage, 100)}%`,
                    background: progressColor(item.adherencePercentage),
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {item.dosesTaken}/{item.dosesScheduled} doses in the selected period
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
