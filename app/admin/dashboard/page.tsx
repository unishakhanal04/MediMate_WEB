"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "../../../contexts/ToastContext";
import { adminService } from "../../../services/admin.service";
import { AdminDashboardSummary } from "../../../types/admin.types";
import { PageHeader } from "../../../components/common/PageHeader";
import { StatsCards, StatItem } from "../../../components/admin/StatsCards";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { AdminEmptyState } from "../../../components/admin/AdminEmptyState";
import { Card } from "../../../components/dashboard/Card";

export default function AdminDashboardPage() {
  const toast = useToast();
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboardSummary()
      .then(setSummary)
      .catch((error) => {
        console.error("Failed to load dashboard summary:", error);
        toast.error("Unable to load the admin dashboard.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader icon="📊" title="Admin Dashboard" description="System-wide overview of MediMate." />
        <AdminSkeleton />
      </div>
    );
  }

  if (!summary || summary.totalUsers === 0) {
    return (
      <div>
        <PageHeader icon="📊" title="Admin Dashboard" description="System-wide overview of MediMate." />
        <AdminEmptyState
          title="No activity yet"
          description="Once users start signing up and using MediMate, dashboard metrics will show up here."
        />
      </div>
    );
  }

  const stats: StatItem[] = [
    { label: "Total Users", value: summary.totalUsers, icon: "👥" },
    { label: "Active Users", value: summary.activeUsers, icon: "✅" },
    { label: "New This Week", value: summary.newUsersThisWeek, icon: "🆕" },
    { label: "Admins", value: summary.adminUsers, icon: "🛡️" },
    { label: "Total Medicines", value: summary.totalMedicines, icon: "💊" },
    { label: "Active Medicines", value: summary.activeMedicines, icon: "📋" },
    { label: "Total Prescriptions", value: summary.totalPrescriptions, icon: "📄" },
    { label: "Upcoming Appointments", value: summary.upcomingAppointments, icon: "📅" },
    { label: "AI Conversations", value: summary.totalAiConversations, icon: "💬" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon="📊"
        title="Admin Dashboard"
        description="System-wide overview of MediMate."
        action={
          <Link
            href="/admin/users"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Manage Users
          </Link>
        }
      />

      <StatsCards stats={stats} />

      <Card>
        <h2 className="mb-2 text-base font-bold text-gray-900">Inactive Users</h2>
        <p className="text-sm text-gray-500">
          {summary.inactiveUsers} user{summary.inactiveUsers === 1 ? "" : "s"} currently inactive.{" "}
          <Link href="/admin/users" className="font-semibold text-blue-600 hover:underline">
            Review in User Management →
          </Link>
        </p>
      </Card>
    </div>
  );
}
