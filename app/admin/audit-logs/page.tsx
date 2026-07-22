"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "../../../contexts/ToastContext";
import { adminService } from "../../../services/admin.service";
import { AuditLogEntry } from "../../../types/audit-log.types";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { AdminEmptyState } from "../../../components/admin/AdminEmptyState";
import { AuditLogGroup } from "../../../components/admin/AuditLogGroup";
import { Pagination } from "../../../components/admin/Pagination";
import { Card } from "../../../components/dashboard/Card";

const PAGE_SIZE = 25;

const actionFilters: { key: string; label: string }[] = [
  { key: "", label: "All Actions" },
  { key: "user_activated", label: "Activated" },
  { key: "user_deactivated", label: "Deactivated" },
  { key: "user_updated", label: "Updated" },
  { key: "user_deleted", label: "Deleted" },
  { key: "report_exported", label: "Exported" },
];

const dayLabel = (dateKey: string) => {
  const today = new Date();
  const todayKey = today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toDateString();

  if (dateKey === todayKey) return "Today";
  if (dateKey === yesterdayKey) return "Yesterday";
  return new Date(dateKey).toLocaleDateString(undefined, { weekday: "long" });
};

const groupByDay = (entries: AuditLogEntry[]) => {
  const groups: { key: string; entries: AuditLogEntry[] }[] = [];
  for (const entry of entries) {
    const key = new Date(entry.date).toDateString();
    const group = groups.find((g) => g.key === key);
    if (group) group.entries.push(entry);
    else groups.push({ key, entries: [entry] });
  }
  return groups;
};

export default function AuditLogsPage() {
  const toast = useToast();
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionCounts, setActionCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    Promise.all([
      adminService.getAuditLogs({ limit: 1 }),
      adminService.getAuditLogs({ action: "user_activated", limit: 1 }),
      adminService.getAuditLogs({ action: "user_deactivated", limit: 1 }),
      adminService.getAuditLogs({ action: "report_exported", limit: 1 }),
    ])
      .then(([all, activated, deactivated, exported]) => {
        setActionCounts({
          all: all.total,
          activated: activated.total,
          deactivated: deactivated.total,
          exported: exported.total,
        });
      })
      .catch((error) => console.error("Failed to load audit log stats:", error));
  }, []);

  const fetchLogs = async (targetPage: number, actionFilter: string) => {
    setLoading(true);
    try {
      const result = await adminService.getAuditLogs({
        page: targetPage,
        limit: PAGE_SIZE,
        action: actionFilter || undefined,
      });
      setEntries(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to load audit logs:", error);
      toast.error("Unable to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchLogs(1, action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  useEffect(() => {
    fetchLogs(page, action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const groups = groupByDay(entries);
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">
        <Link href="/admin/dashboard" className="hover:text-gray-600 dark:hover:text-gray-300">
          MediAdmin
        </Link>{" "}
        <span className="mx-1">›</span> <span className="text-blue-700 dark:text-blue-400">Audit Logs</span>
      </p>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          System Audit Logs
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Chronological record of all administrative actions.
        </p>
      </div>

      {!actionCounts ? (
        <AdminSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Total Actions</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{actionCounts.all.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">All time</p>
          </Card>
          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Activated</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{actionCounts.activated.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Users activated</p>
          </Card>
          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Deactivated</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{actionCounts.deactivated.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Users deactivated</p>
          </Card>
          <Card className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Reports Exported</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{actionCounts.exported.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">CSV exports</p>
          </Card>
        </div>
      )}

      <Card className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800/60" role="tablist" aria-label="Filter by action type">
            {actionFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                role="tab"
                aria-selected={action === filter.key}
                onClick={() => setAction(filter.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  action === filter.key
                    ? "bg-white text-blue-700 shadow-sm dark:bg-gray-900 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{rangeStart}-{rangeEnd}</span> of{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">{total.toLocaleString()}</span> entries
          </span>
        </div>

        {loading ? (
          <AdminSkeleton />
        ) : entries.length === 0 ? (
          <AdminEmptyState title="No admin actions yet" description="Actions like activating users or exporting reports will show up here." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                    <th scope="col" className="px-4 py-3">Timestamp</th>
                    <th scope="col" className="px-4 py-3">Admin User</th>
                    <th scope="col" className="px-4 py-3">Action Type</th>
                    <th scope="col" className="px-4 py-3">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => (
                    <AuditLogGroup
                      key={group.key}
                      label={dayLabel(group.key)}
                      dateLabel={new Date(group.key).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      entries={group.entries}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
