import { Card } from "../dashboard/Card";
import { ReportsInsights } from "../../types/report.types";

interface InsightsSectionProps {
  insights: ReportsInsights;
}

const trendMeta = {
  up: { arrow: "↑", label: "Improved by", className: "text-emerald-600 dark:text-emerald-400" },
  down: { arrow: "↓", label: "Down by", className: "text-red-600 dark:text-red-400" },
  flat: { arrow: "→", label: "No change from", className: "text-gray-500 dark:text-gray-400" },
};

export function InsightsSection({ insights }: InsightsSectionProps) {
  const { adherenceTrend, mostMissedMedicine, bestAdherenceDay, totalMedicinesCompleted, appointmentAttendanceRate } =
    insights;
  const trend = trendMeta[adherenceTrend.direction];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-bold text-gray-900 dark:text-white">Insights</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="flex h-full flex-col gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            aria-hidden="true"
          >
            📈
          </span>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{adherenceTrend.currentPercent}%</p>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">Adherence</p>
          </div>
          <p className={`flex items-center gap-1 text-xs font-semibold ${trend.className}`}>
            {trend.arrow} {trend.label} {Math.abs(adherenceTrend.deltaPercent)}%
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Compared to last month</p>
        </Card>

        <Card className="flex h-full flex-col gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-lg text-red-600 dark:bg-red-500/10 dark:text-red-400"
            aria-hidden="true"
          >
            ⚠️
          </span>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {mostMissedMedicine ? mostMissedMedicine.missedCount : "—"}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              {mostMissedMedicine ? `Doses Missed · ${mostMissedMedicine.name}` : "No missed doses"}
            </p>
          </div>
        </Card>

        <Card className="flex h-full flex-col gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            aria-hidden="true"
          >
            🌟
          </span>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {bestAdherenceDay ? `${bestAdherenceDay.percentage}%` : "—"}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              {bestAdherenceDay ? `Best Day · ${bestAdherenceDay.day}` : "Not enough data yet"}
            </p>
          </div>
        </Card>

        <Card className="flex h-full flex-col gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-lg text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
            aria-hidden="true"
          >
            ✅
          </span>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMedicinesCompleted}</p>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">Medicines Completed</p>
          </div>
        </Card>

        <Card className="flex h-full flex-col gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
            aria-hidden="true"
          >
            🩺
          </span>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{appointmentAttendanceRate}%</p>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">Appointment Attendance</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
