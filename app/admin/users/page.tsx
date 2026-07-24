"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../../contexts/ToastContext";
import { useConfirmDialog } from "../../../contexts/ConfirmDialogContext";
import { adminService } from "../../../services/admin.service";
import { adminUserService } from "../../../services/admin-user.service";
import { AdminDashboardSummary, AdminUser, UserStatus } from "../../../types/admin.types";
import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
  type AdminCreateUserFormData,
  type AdminUpdateUserFormData,
} from "../../../schemas/admin-user.schema";
import { SearchBar } from "../../../components/common/SearchBar";
import { UserTable } from "../../../components/admin/UserTable";
import { Pagination } from "../../../components/admin/Pagination";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { AdminEmptyState } from "../../../components/admin/AdminEmptyState";
import { Card } from "../../../components/dashboard/Card";
import { Modal } from "../../../components/Modal";

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
  const confirmDialog = useConfirmDialog();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [filterMode, setFilterMode] = useState<UserFilterMode>("all");
  const [loading, setLoading] = useState(true);
  const [userModal, setUserModal] = useState<{ mode: "create" | "edit"; user: AdminUser | null } | null>(null);
  const [savingUser, setSavingUser] = useState(false);
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

  const openCreateModal = () => setUserModal({ mode: "create", user: null });
  const openEditModal = (user: AdminUser) => setUserModal({ mode: "edit", user });
  const closeUserModal = () => setUserModal(null);

  const handleCreateUser = async (data: AdminCreateUserFormData) => {
    setSavingUser(true);
    try {
      await adminUserService.createUser(data);
      toast.success("User created successfully.");
      closeUserModal();
      fetchUsers(page, search, filterMode);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create user.";
      toast.error(message);
    } finally {
      setSavingUser(false);
    }
  };

  const handleUpdateUser = async (data: AdminUpdateUserFormData) => {
    if (!userModal?.user) return;
    setSavingUser(true);
    try {
      const updated = await adminUserService.updateUser(userModal.user.id, data);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
      toast.success("User updated successfully.");
      closeUserModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update user.";
      toast.error(message);
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    const confirmed = await confirmDialog({
      title: "Delete user",
      message: `Are you sure you want to permanently delete ${user.username}? This cannot be undone.`,
    });
    if (!confirmed) return;

    try {
      await adminUserService.deleteUser(user.id);
      toast.success("User deleted.");
      fetchUsers(page, search, filterMode);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete user.";
      toast.error(message);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            User Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor and manage user accounts across MediMate.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          + Add User
        </button>
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
            <UserTable users={users} onToggleStatus={toggleStatus} onEdit={openEditModal} onDelete={handleDeleteUser} />

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

      <Modal
        open={userModal !== null}
        title={userModal?.mode === "edit" ? "Edit User" : "Add User"}
        onClose={closeUserModal}
      >
        {userModal?.mode === "create" && (
          <CreateUserForm submitting={savingUser} onSubmit={handleCreateUser} onCancel={closeUserModal} />
        )}
        {userModal?.mode === "edit" && userModal.user && (
          <EditUserForm
            key={userModal.user.id}
            user={userModal.user}
            submitting={savingUser}
            onSubmit={handleUpdateUser}
            onCancel={closeUserModal}
          />
        )}
      </Modal>
    </div>
  );
}

const userFormInputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";
const userFormLabelClass = "mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300";

function UserFormActions({ submitting, submitLabel, onCancel }: { submitting: boolean; submitLabel: string; onCancel: () => void }) {
  return (
    <div className="mt-2 flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}

function CreateUserForm({
  submitting,
  onSubmit,
  onCancel,
}: {
  submitting: boolean;
  onSubmit: (data: AdminCreateUserFormData) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminCreateUserFormData>({
    resolver: zodResolver(adminCreateUserSchema),
    defaultValues: { username: "", email: "", gender: "other", role: "user", status: "active", password: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className={userFormLabelClass}>Username</label>
        <input className={userFormInputClass} {...register("username")} />
        {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
      </div>

      <div>
        <label className={userFormLabelClass}>Email</label>
        <input type="email" className={userFormInputClass} {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className={userFormLabelClass}>Gender</label>
        <select className={userFormInputClass} {...register("gender")}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>}
      </div>

      <div>
        <label className={userFormLabelClass}>Password</label>
        <input type="password" className={userFormInputClass} {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <label className={userFormLabelClass}>Role</label>
        <select className={userFormInputClass} {...register("role")}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
      </div>

      <div>
        <label className={userFormLabelClass}>Status</label>
        <select className={userFormInputClass} {...register("status")}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
      </div>

      <UserFormActions submitting={submitting} submitLabel="Create User" onCancel={onCancel} />
    </form>
  );
}

function EditUserForm({
  user,
  submitting,
  onSubmit,
  onCancel,
}: {
  user: AdminUser;
  submitting: boolean;
  onSubmit: (data: AdminUpdateUserFormData) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminUpdateUserFormData>({
    resolver: zodResolver(adminUpdateUserSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      gender: user.gender,
      role: user.role,
      status: user.status,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className={userFormLabelClass}>Username</label>
        <input className={userFormInputClass} {...register("username")} />
        {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
      </div>

      <div>
        <label className={userFormLabelClass}>Email</label>
        <input type="email" className={userFormInputClass} {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className={userFormLabelClass}>Gender</label>
        <select className={userFormInputClass} {...register("gender")}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>}
      </div>

      <div>
        <label className={userFormLabelClass}>Role</label>
        <select className={userFormInputClass} {...register("role")}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
      </div>

      <div>
        <label className={userFormLabelClass}>Status</label>
        <select className={userFormInputClass} {...register("status")}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
      </div>

      <UserFormActions submitting={submitting} submitLabel="Save Changes" onCancel={onCancel} />
    </form>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminUsersPageContent />
    </Suspense>
  );
}
