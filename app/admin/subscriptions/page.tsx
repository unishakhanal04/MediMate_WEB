"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import { adminService } from "../../../services/admin.service";
import { AdminSubscriptionEffectiveStatus, AdminSubscriptionItem, AdminSubscriptionStats } from "../../../types/admin.types";
import { getInitials, avatarColorFor } from "../../../lib/avatar";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { AdminEmptyState } from "../../../components/admin/AdminEmptyState";
import { Pagination } from "../../../components/admin/Pagination";
import { Card } from "../../../components/dashboard/Card";

const PAGE_SIZE = 15;

type StatusFilter = "all" | AdminSubscriptionEffectiveStatus;

const filterTabs: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All Subscriptions" },
  { key: "active", label: "Active" },
  { key: "expired", label: "Expired" },
  { key: "cancelled", label: "Cancelled" },
];

const statusStyle: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  expired: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function AdminSubscriptionsPage() {
  const toast = useToast();
  const [stats, setStats] = useState<AdminSubscriptionStats | null>(null);
  const [subscriptions, setSubscriptions] = useState<AdminSubscriptionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    adminService
      .getSubscriptionStats()
      .then(setStats)
      .catch((error) => {
        console.error("Failed to load subscription stats:", error);
        toast.error("Unable to load subscription stats.");
      })
      .finally(() => setStatsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubscriptions = async (targetPage: number, statusFilter: StatusFilter) => {
    setLoading(true);
    try {
      const result = await adminService.listSubscriptions({
        page: targetPage,
        limit: PAGE_SIZE,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setSubscriptions(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
      toast.error("Unable to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchSubscriptions(1, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    fetchSubscriptions(page, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Subscriptions Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor subscription plans, renewals, and revenue across MediMate.
        </p>
      </div>

      {statsLoading || !stats ? (
        <AdminSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Total Revenue</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">NPR {stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">All time</p>
          </Card>

          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">This Month</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">NPR {stats.revenueThisMonth.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Revenue so far</p>
          </Card>

          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Premium Users</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.premiumUsers.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Currently active</p>
          </Card>

          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Renewals</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.renewals.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Repeat payments</p>
          </Card>

          <Card className="flex flex-col gap-2 border-red-200 bg-red-50/60 dark:border-red-500/20 dark:bg-red-500/5">
            <p className="text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">Alerts</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Failed Payments</span>
              <span className="text-lg font-extrabold text-red-600 dark:text-red-400">{stats.failedPayments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Expired Plans</span>
              <span className="text-lg font-extrabold text-red-600 dark:text-red-400">{stats.expiredPlans}</span>
            </div>
          </Card>
        </div>
      )}

      <Card className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Subscriptions</h2>
          {stats && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              Active: {stats.premiumUsers.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800/60" role="tablist" aria-label="Filter subscriptions by status">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={filter === tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === tab.key
                  ? "bg-white text-blue-700 shadow-sm dark:bg-gray-900 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <AdminSkeleton />
        ) : subscriptions.length === 0 ? (
          <AdminEmptyState title="No subscriptions found" description="No subscriptions match this filter yet." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                    <th scope="col" className="px-4 py-3">User</th>
                    <th scope="col" className="px-4 py-3">Plan</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Start Date</th>
                    <th scope="col" className="px-4 py-3">Expiration</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                    >
                      <td className="px-4 py-3">
                        {sub.username ? (
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColorFor(sub.userId)}`}
                            >
                              {getInitials(sub.username)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-900 dark:text-white">{sub.username}</p>
                              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{sub.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">Unknown user</span>
                        )}
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{sub.plan}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${statusStyle[sub.status]}`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {new Date(sub.startDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {new Date(sub.expiresAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{rangeStart}-{rangeEnd}</span> of{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">{total.toLocaleString()}</span> subscriptions
              </p>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
