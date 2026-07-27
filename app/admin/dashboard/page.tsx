"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "../../../contexts/ToastContext";
import { adminService } from "../../../services/admin.service";
import { AdminDashboardSummary } from "../../../types/admin.types";
import { AdminNotificationItem, AdminNotificationType } from "../../../types/admin-notification.types";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { AdminEmptyState } from "../../../components/admin/AdminEmptyState";
import { Card } from "../../../components/dashboard/Card";
import { QuickActions } from "../../../components/admin/QuickActions";
import { AdherenceRing } from "../../../components/admin/AdherenceRing";

const activityDot: Record<AdminNotificationType, string> = {
  new_user_registered: "bg-emerald-500",
  gemini_api_failed: "bg-red-500",
  system_error: "bg-red-500",
};

const timeAgo = (dateStr: string): string => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

function DeltaBadge({ percent, flatLabel = "Steady" }: { percent: number | null; flatLabel?: string }) {
  if (percent === null) {
    return (
      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
        New
      </span>
    );
  }
  if (percent === 0) {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        — {flatLabel}
      </span>
    );
  }
  const up = percent > 0;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
        up
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
      }`}
    >
      {up ? "↗" : "↘"} {Math.abs(percent)}%
    </span>
  );
}

export default function AdminDashboardPage() {
  const toast = useToast();
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [activity, setActivity] = useState<AdminNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getDashboardSummary(), adminService.getNotifications()])
      .then(([summaryData, notificationsData]) => {
        setSummary(summaryData);
        setActivity(notificationsData.items.slice(0, 6));
      })
      .catch((error) => {
        console.error("Failed to load dashboard:", error);
        toast.error("Unable to load the admin dashboard.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <AdminSkeleton />;
  }

  if (!summary || summary.totalUsers === 0) {
    return (
      <AdminEmptyState
        title="No activity yet"
        description="Once users start signing up and using MediMate, dashboard metrics will show up here."
      />
    );
  }

  const bigStats = [
    {
      label: "Total Users",
      value: summary.totalUsers.toLocaleString(),
      icon: "👥",
      iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      badge: null as ReactNode,
    },
    {
      label: "New Users (Week)",
      value: summary.newUsersThisWeek.toLocaleString(),
      icon: "🆕",
      iconBg: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
      badge: <DeltaBadge percent={summary.newUsersThisWeekDeltaPercent} />,
    },
    {
      label: "Active Today",
      value: summary.activeUsersToday.toLocaleString(),
      icon: "⚡",
      iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      badge: (
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
        </span>
      ),
    },
    {
      label: "Inactive",
      value: summary.inactiveUsers.toLocaleString(),
      icon: "🚫",
      iconBg: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
      badge: null,
    },
  ];

  const smallStats = [
    {
      label: "MEDS ADDED",
      value: summary.medicinesAddedThisWeek.toLocaleString(),
      delta: <DeltaBadge percent={summary.medicinesAddedThisWeekDeltaPercent} />,
    },
    {
      label: "APPTS CREATED",
      value: summary.appointmentsCreatedThisWeek.toLocaleString(),
      delta: <DeltaBadge percent={summary.appointmentsCreatedThisWeekDeltaPercent} />,
    },
    {
      label: "RX UPLOADED",
      value: summary.prescriptionsUploadedThisWeek.toLocaleString(),
      delta: <DeltaBadge percent={summary.prescriptionsUploadedThisWeekDeltaPercent} />,
    },
    {
      label: "AI CHATS",
      value: summary.totalAiConversations.toLocaleString(),
      delta: <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">All time</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            System Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time performance monitoring for the MediMate ecosystem.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <span aria-hidden="true">📅</span> Last 7 Days
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bigStats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${stat.iconBg}`} aria-hidden="true">
                {stat.icon}
              </span>
              {stat.badge}
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {smallStats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">{stat.label}</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
            {stat.delta}
          </Card>
        ))}

        <Card className="flex flex-col items-center justify-center gap-2 sm:col-span-2 lg:col-span-1">
          <AdherenceRing percent={summary.averageAdherence} />
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Avg Adherence</p>
        </Card>
      </div>

      <Card className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Live Activity Log</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No recent activity.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {activity.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${activityDot[item.type]}`} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.title} <span className="font-mono text-xs font-normal text-gray-400 dark:text-gray-500">{item.message}</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(item.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/notifications" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400">
          View All →
        </Link>
      </Card>
    </div>
  );
}
