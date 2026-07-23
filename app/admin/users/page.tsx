"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "../../../contexts/ToastContext";
import { adminService } from "../../../services/admin.service";
import { AdminDashboardSummary, AdminUser, UserStatus } from "../../../types/admin.types";
import { SearchBar } from "../../../components/common/SearchBar";
import { UserTable } from "../../../components/admin/UserTable";
import { Pagination } from "../../../components/admin/Pagination";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { AdminEmptyState } from "../../../components/admin/AdminEmptyState";
import { Card } from "../../../components/dashboard/Card";

const PAGE_SIZE = 10;

type UserFilterMode = "all" | "active" | "inactive" | "recentlyJoined" | "mostActive";

const filterTabs: { key: UserFilterMode; label: string }[] = [
  { key: "all", label: "All Users" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "recentlyJoined", label: "Recently Joined" },
  { key: "mostActive", label: "Most Active" },
];

const toQueryParams = (mode: UserFilterMode): { status?: UserStatus; sort?: "recent" | "mostActive" } => {
  if (mode === "active" || mode === "inactive") return { status: mode };
  if (mode === "recentlyJoined") return { sort: "recent" };
  if (mode === "mostActive") return { sort: "mostActive" };
  return {};
};

function AdminUsersPageContent() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [filterMode, setFilterMode] = useState<UserFilterMode>("all");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);

  useEffect(() => {
    adminService
      .getDashboardSummary()
      .then(setSummary)
      .catch((error) => console.error("Failed to load user stats:", error));
  }, []);

  const fetchUsers = async (targetPage: number, term: string, mode: UserFilterMode) => {
    setLoading(true);
    try {
      const result = await adminService.listUsers({
        page: targetPage,
        limit: PAGE_SIZE,
        search: term,
        ...toQueryParams(mode),
      });
      setUsers(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      fetchUsers(1, search, filterMode);
    }, 400);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    setPage(1);
    fetchUsers(1, search, filterMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMode]);

  useEffect(() => {
    fetchUsers(page, search, filterMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const toggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    try {
      const updated = await adminService.updateUserStatus(user.id, nextStatus);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(`User ${updated.status === "active" ? "activated" : "deactivated"}.`);
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Unable to update user status.");
    }
  };

  const statCards = summary
    ? [
        { label: "Total Users", value: total.toLocaleString(), sublabel: "All registered accounts" },
        { label: "Active Today", value: summary.activeUsersToday.toLocaleString(), sublabel: "Logged in today" },
        { label: "Recently Joined", value: summary.newUsersThisWeek.toLocaleString(), sublabel: "Past 7 days" },
        { label: "Inactive", value: summary.inactiveUsers.toLocaleString(), sublabel: "Deactivated accounts" },
      ]
    : [];

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          User Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor and manage user accounts across MediMate.
        </p>
      </div>

      {statCards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">{stat.label}</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{stat.sublabel}</p>
            </Card>
          ))}
        </div>
      )}

      <Card className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800/60" role="tablist" aria-label="Filter users">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={filterMode === tab.key}
                onClick={() => setFilterMode(tab.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  filterMode === tab.key
                    ? "bg-white text-blue-700 shadow-sm dark:bg-gray-900 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email" className="sm:max-w-xs" />
        </div>

        {loading ? (
          <AdminSkeleton />
        ) : users.length === 0 ? (
          <AdminEmptyState title="No users found" description="Try a different search term or filter." />
        ) : (
          <>
            <UserTable users={users} onToggleStatus={toggleStatus} />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{rangeStart}-{rangeEnd}</span> of{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">{total.toLocaleString()}</span> users
              </p>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminUsersPageContent />
    </Suspense>
  );
}
