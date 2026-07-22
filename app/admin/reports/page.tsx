"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import { adminService } from "../../../services/admin.service";
import { AdminReportsOverview } from "../../../types/admin.types";
import { PageHeader } from "../../../components/common/PageHeader";
import { StatsCards, StatItem } from "../../../components/admin/StatsCards";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { AdminEmptyState } from "../../../components/admin/AdminEmptyState";
import { Card } from "../../../components/dashboard/Card";
import { WeeklyTrendChart } from "../../../components/admin/WeeklyTrendChart";

export default function AdminReportsPage() {
  const toast = useToast();
  const [overview, setOverview] = useState<AdminReportsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getReportsOverview()
      .then(setOverview)
      .catch((error) => {
        console.error("Failed to load reports overview:", error);
        toast.error("Unable to load the admin reports overview.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader icon="📈" title="Reports Overview" description="System-wide trends across MediMate." />
        <AdminSkeleton />
      </div>
    );
  }

  const hasNoData =
    !overview ||
    (overview.userGrowth.every((point) => point.count === 0) &&
      overview.totalPrescriptions === 0 &&
      overview.appointmentsByStatus.scheduled === 0 &&
      overview.appointmentsByStatus.completed === 0 &&
      overview.appointmentsByStatus.cancelled === 0);

  if (hasNoData) {
    return (
      <div>
        <PageHeader icon="📈" title="Reports Overview" description="System-wide trends across MediMate." />
        <AdminEmptyState
          title="No data yet"
          description="Once users start using MediMate, system-wide trends will appear here."
        />
      </div>
    );
  }

  const kpis: StatItem[] = [
    { label: "Today's Registrations", value: overview.kpis.todaysRegistrations, icon: "🆕" },
    { label: "Weekly Active Users", value: overview.kpis.weeklyActiveUsers, icon: "✅" },
    { label: "Monthly AI Requests", value: overview.kpis.monthlyAiRequests, icon: "💬" },
    { label: "Medicine Completion Rate", value: `${overview.kpis.medicineCompletionRate}%`, icon: "💊" },
  ];

  const stats: StatItem[] = [
    { label: "Total Prescriptions", value: overview.totalPrescriptions, icon: "📄" },
    { label: "Expiring Soon (30d)", value: overview.prescriptionsExpiringSoon, icon: "⏳" },
    { label: "Scheduled Appointments", value: overview.appointmentsByStatus.scheduled, icon: "📅" },
    { label: "Active Medicines", value: overview.medicinesByStatus.active, icon: "💊" },
  ];

  const appointmentSegments = [
    { label: "Scheduled", value: overview.appointmentsByStatus.scheduled, color: "bg-blue-500" },
    { label: "Completed", value: overview.appointmentsByStatus.completed, color: "bg-emerald-500" },
    { label: "Cancelled", value: overview.appointmentsByStatus.cancelled, color: "bg-gray-400" },
  ];
  const appointmentTotal = appointmentSegments.reduce((sum, s) => sum + s.value, 0);

  const medicineSegments = [
    { label: "Active", value: overview.medicinesByStatus.active, color: "bg-emerald-500" },
    { label: "Completed", value: overview.medicinesByStatus.completed, color: "bg-blue-500" },
    { label: "Inactive", value: overview.medicinesByStatus.inactive, color: "bg-gray-400" },
  ];
  const medicineTotal = medicineSegments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon="📈" title="Reports Overview" description="System-wide trends across MediMate." />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="flex items-center gap-4">
              <span
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-500/10"
                aria-hidden="true"
              >
                {kpi.icon}
              </span>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">{kpi.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <StatsCards stats={stats} />

      <WeeklyTrendChart
        title="User Registration Trend (last 8 weeks)"
        points={overview.userGrowth}
        unitLabel="new users"
        color="bg-blue-500"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeeklyTrendChart
          title="Medicine Usage Trend"
          points={overview.medicineUsageTrend}
          unitLabel="doses taken"
          color="bg-emerald-500"
        />
        <WeeklyTrendChart
          title="Appointment Trend"
          points={overview.appointmentTrend}
          unitLabel="appointments booked"
          color="bg-violet-500"
        />
        <WeeklyTrendChart
          title="Prescription Upload Trend"
          points={overview.prescriptionUploadTrend}
          unitLabel="prescriptions uploaded"
          color="bg-indigo-500"
        />
        <WeeklyTrendChart
          title="AI Usage Trend"
          points={overview.aiUsageTrend}
          unitLabel="conversations started"
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Appointments</h2>
          <div className="flex h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            {appointmentSegments.map((segment) => (
              <div
                key={segment.label}
                className={segment.color}
                style={{ width: appointmentTotal > 0 ? `${(segment.value / appointmentTotal) * 100}%` : "0%" }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {appointmentSegments.map((segment) => (
              <span key={segment.label} className="rounded-full bg-gray-50 px-2 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {segment.value} {segment.label}
              </span>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Medicines</h2>
          <div className="flex h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            {medicineSegments.map((segment) => (
              <div
                key={segment.label}
                className={segment.color}
                style={{ width: medicineTotal > 0 ? `${(segment.value / medicineTotal) * 100}%` : "0%" }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {medicineSegments.map((segment) => (
              <span key={segment.label} className="rounded-full bg-gray-50 px-2 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {segment.value} {segment.label}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
