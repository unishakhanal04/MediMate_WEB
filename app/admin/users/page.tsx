"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import { adminService } from "../../../services/admin.service";
import { AdminUser } from "../../../types/admin.types";
import { PageHeader } from "../../../components/common/PageHeader";
import { SearchBar } from "../../../components/common/SearchBar";
import { UserTable } from "../../../components/admin/UserTable";
import { UserDetailsModal } from "../../../components/admin/UserDetailsModal";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { AdminEmptyState } from "../../../components/admin/AdminEmptyState";
import { Button } from "../../../components/Button";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const fetchUsers = async (targetPage: number, term: string) => {
    setLoading(true);
    try {
      const result = await adminService.listUsers({ page: targetPage, limit: PAGE_SIZE, search: term });
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
      fetchUsers(1, search);
    }, 400);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    fetchUsers(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openDetails = async (user: AdminUser) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    setSelectedUser(null);
    try {
      const data = await adminService.getUserDetails(user.id);
      setSelectedUser(data);
    } catch (error) {
      console.error("Failed to load user details:", error);
      toast.error("Unable to load user details.");
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const toggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    try {
      const updated = await adminService.updateUserStatus(user.id, nextStatus);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setSelectedUser((prev) => (prev && prev.id === updated.id ? updated : prev));
      toast.success(`User ${updated.status === "active" ? "activated" : "deactivated"}.`);
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Unable to update user status.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon="👥"
        title="User Management"
        description={`${total} registered user${total === 1 ? "" : "s"}`}
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Search by username or email" />

      {loading ? (
        <AdminSkeleton />
      ) : users.length === 0 ? (
        <AdminEmptyState title="No users found" description="Try a different search term." />
      ) : (
        <>
          <UserTable users={users} onView={openDetails} onToggleStatus={toggleStatus} />

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <UserDetailsModal
        open={detailsOpen}
        user={selectedUser}
        loading={detailsLoading}
        onClose={() => setDetailsOpen(false)}
        onToggleStatus={toggleStatus}
      />
    </div>
  );
}
