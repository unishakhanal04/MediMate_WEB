"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import { adminService } from "../../../services/admin.service";
import { AdminPaymentItem, AdminSubscriptionStats } from "../../../types/admin.types";
import { getInitials, avatarColorFor } from "../../../lib/avatar";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { AdminEmptyState } from "../../../components/admin/AdminEmptyState";
import { Pagination } from "../../../components/admin/Pagination";
import { Card } from "../../../components/dashboard/Card";

const PAGE_SIZE = 15;

type StatusFilter = "all" | "pending" | "success" | "failed";

const filterTabs: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "success", label: "Success" },
  { key: "pending", label: "Pending" },
  { key: "failed", label: "Failed" },
];

const statusStyle: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  failed: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export default function AdminPaymentsPage() {
  const toast = useToast();
  const [payments, setPayments] = useState<AdminPaymentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminSubscriptionStats | null>(null);
  const [allTransactionsCount, setAllTransactionsCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getSubscriptionStats(), adminService.listPayments({ page: 1, limit: 1 })])
      .then(([statsData, paymentsMeta]) => {
        setStats(statsData);
        setAllTransactionsCount(paymentsMeta.meta.total);
      })
      .catch((error) => console.error("Failed to load payment stats:", error))
      .finally(() => setStatsLoading(false));
  }, []);

  const fetchPayments = async (targetPage: number, statusFilter: StatusFilter) => {
    setLoading(true);
    try {
      const result = await adminService.listPayments({
        page: targetPage,
        limit: PAGE_SIZE,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setPayments(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
    } catch (error) {
      console.error("Failed to load payments:", error);
      toast.error("Unable to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPayments(1, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    fetchPayments(page, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);
  const failedRate =
    stats && allTransactionsCount > 0 ? ((stats.failedPayments / allTransactionsCount) * 100).toFixed(2) : "0.00";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Payments Tracking
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor all financial transactions across the platform.
        </p>
      </div>

      {statsLoading || !stats ? (
        <AdminSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Transactions</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{allTransactionsCount.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">All time</p>
          </Card>

          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Failed Rate</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{failedRate}%</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{stats.failedPayments} failed of {allTransactionsCount}</p>
          </Card>
        </div>
      )}

      <Card className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800/60" role="tablist" aria-label="Filter payments by status">
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
        ) : payments.length === 0 ? (
          <AdminEmptyState title="No payments found" description="No transactions match this filter yet." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                    <th scope="col" className="px-4 py-3">Transaction ID</th>
                    <th scope="col" className="px-4 py-3">User</th>
                    <th scope="col" className="px-4 py-3">Amount</th>
                    <th scope="col" className="px-4 py-3">Gateway</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400" title={payment.transactionUuid}>
                        #{payment.transactionUuid.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3">
                        {payment.username ? (
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColorFor(payment.userId)}`}
                            >
                              {getInitials(payment.username)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-900 dark:text-white">{payment.username}</p>
                              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{payment.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">Unknown user</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">NPR {payment.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{payment.gateway}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                            statusStyle[payment.status] ?? statusStyle.pending
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        {" · "}
                        {new Date(payment.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{rangeStart}-{rangeEnd}</span> of{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">{total.toLocaleString()}</span> transactions
              </p>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
