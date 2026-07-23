"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import { adminService } from "../../../services/admin.service";
import { AdminFeedbackItem, FeedbackStatus, FeedbackType } from "../../../types/admin.types";
import { getInitials, avatarColorFor } from "../../../lib/avatar";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { AdminEmptyState } from "../../../components/admin/AdminEmptyState";
import { Pagination } from "../../../components/admin/Pagination";
import { Card } from "../../../components/dashboard/Card";

const PAGE_SIZE = 15;

type TypeFilter = "all" | FeedbackType;

const typeFilters: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "All Feedback" },
  { key: "bug_report", label: "Bug Reports" },
  { key: "suggestion", label: "Suggestions" },
  { key: "feature_request", label: "Feature Requests" },
  { key: "general", label: "General" },
];

const typeMeta: Record<FeedbackType, { label: string; badgeClass: string }> = {
  bug_report: { label: "BUG REPORT", badgeClass: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
  suggestion: { label: "SUGGESTION", badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" },
  feature_request: { label: "FEATURE REQUEST", badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
  general: { label: "GENERAL", badgeClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

const timeAgo = (dateStr: string): string => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

export default function AdminFeedbackPage() {
  const toast = useToast();
  const [items, setItems] = useState<AdminFeedbackItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    Promise.all([
      adminService.listFeedback({ limit: 1 }),
      adminService.listFeedback({ status: "new", limit: 1 }),
      adminService.listFeedback({ status: "reviewed", limit: 1 }),
      adminService.listFeedback({ status: "resolved", limit: 1 }),
    ])
      .then(([all, pending, reviewed, resolved]) => {
        setStatusCounts({
          all: all.meta.total,
          pending: pending.meta.total,
          reviewed: reviewed.meta.total,
          resolved: resolved.meta.total,
        });
      })
      .catch((error) => console.error("Failed to load feedback stats:", error));
  }, []);

  const fetchFeedback = async (targetPage: number, filter: TypeFilter) => {
    setLoading(true);
    try {
      const result = await adminService.listFeedback({
        page: targetPage,
        limit: PAGE_SIZE,
        type: filter === "all" ? undefined : filter,
      });
      setItems(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
    } catch (error) {
      console.error("Failed to load feedback:", error);
      toast.error("Unable to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchFeedback(1, typeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter]);

  useEffect(() => {
    fetchFeedback(page, typeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleStatusChange = async (item: AdminFeedbackItem, status: FeedbackStatus) => {
    setUpdatingId(item.id);
    try {
      const updated = await adminService.updateFeedbackStatus(item.id, status);
      setItems((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      toast.success(`Marked as ${status}.`);
      setStatusCounts(null);
      Promise.all([
        adminService.listFeedback({ limit: 1 }),
        adminService.listFeedback({ status: "new", limit: 1 }),
        adminService.listFeedback({ status: "reviewed", limit: 1 }),
        adminService.listFeedback({ status: "resolved", limit: 1 }),
      ]).then(([all, pending, reviewed, resolved]) =>
        setStatusCounts({ all: all.meta.total, pending: pending.meta.total, reviewed: reviewed.meta.total, resolved: resolved.meta.total })
      );
    } catch (error) {
      console.error("Failed to update feedback status:", error);
      toast.error("Unable to update feedback status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Feedback Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and act on user-submitted feedback across MediMate.
        </p>
      </div>

      {!statusCounts ? (
        <AdminSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Total Submissions</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{statusCounts.all.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">All time</p>
          </Card>
          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Pending Review</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{statusCounts.pending.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Not yet reviewed</p>
          </Card>
          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Reviewed</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{statusCounts.reviewed.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Awaiting resolution</p>
          </Card>
          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Resolved</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{statusCounts.resolved.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Closed out</p>
          </Card>
        </div>
      )}

      <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Filter feedback by type">
        {typeFilters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={typeFilter === filter.key}
            onClick={() => setTypeFilter(filter.key)}
            className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              typeFilter === filter.key
                ? "border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <AdminSkeleton />
      ) : items.length === 0 ? (
        <AdminEmptyState title="No feedback found" description="No submissions match this filter yet." />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {items.map((item) => {
              const meta = typeMeta[item.type];
              return (
                <Card key={item.id} className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColorFor(item.userId)}`}
                      >
                        {getInitials(item.username ?? "?")}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                          {item.username ?? "Unknown user"}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.badgeClass}`}>{meta.label}</span>
                          <span>{timeAgo(item.createdAt)}</span>
                          <span className="font-mono">#FDB-{item.id.slice(-4).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                      {item.status === "new" && (
                        <button
                          onClick={() => handleStatusChange(item, "reviewed")}
                          disabled={updatingId === item.id}
                          className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      {item.status === "reviewed" && (
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          ✓ Reviewed
                        </span>
                      )}
                      {item.status !== "resolved" ? (
                        <button
                          onClick={() => handleStatusChange(item, "resolved")}
                          disabled={updatingId === item.id}
                          className="rounded-full bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="rounded-full border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:text-blue-400">
                          ✓ Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.subject}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item.message}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{rangeStart}</span> to{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">{rangeEnd}</span> of{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">{total.toLocaleString()}</span> submissions
            </p>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
