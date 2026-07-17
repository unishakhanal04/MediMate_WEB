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

  const maxGrowth = Math.max(...overview.userGrowth.map((point) => point.count), 1);

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

      <StatsCards stats={stats} />

      <Card className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">User Growth (last 8 weeks)</h2>
        <div className="flex items-end gap-2 overflow-x-auto pb-2" style={{ minHeight: "9rem" }}>
          {overview.userGrowth.map((point) => (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full min-w-[1.5rem] rounded-t-md bg-blue-500"
                style={{ height: `${Math.max((point.count / maxGrowth) * 100, 4)}px` }}
                title={`${point.count} new users`}
              />
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">{point.count}</span>
              <span className="whitespace-nowrap text-[11px] text-gray-400 dark:text-gray-500">{point.label}</span>
            </div>
          ))}
        </div>
      </Card>

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
