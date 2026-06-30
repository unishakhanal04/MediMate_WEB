"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adminUserService,
  type AdminUser,
  type AdminUserListResponse,
} from "../../../services/admin-user.service";
import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
  type AdminCreateUserFormData,
  type AdminUpdateUserFormData,
} from "../../../schemas/admin-user.schema";

const DEFAULT_LIMIT = 10;

const initialMeta: AdminUserListResponse["meta"] = {
  page: 1,
  limit: DEFAULT_LIMIT,
  total: 0,
  totalPages: 1,
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const buildVisiblePages = (currentPage: number, totalPages: number) => {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const pages: number[] = [];
  for (let page = start; page <= end; page += 1) pages.push(page);
  return pages;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState(initialMeta);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeType, setNoticeType] = useState<"success" | "error">("success");

  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [viewedUser, setViewedUser] = useState<AdminUser | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors, isSubmitting: creating },
  } = useForm<AdminCreateUserFormData>({
    resolver: zodResolver(adminCreateUserSchema),
    defaultValues: {
      username: "",
      email: "",
      gender: "other",
      role: "user",
      status: "active",
      password: "",
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors, isSubmitting: updating },
  } = useForm<AdminUpdateUserFormData>({
    resolver: zodResolver(adminUpdateUserSchema),
    defaultValues: {
      username: "",
      email: "",
      gender: "other",
      role: "user",
      status: "active",
    },
  });

  const showNotice = (type: "success" | "error", message: string) => {
    setNoticeType(type);
    setNotice(message);
  };

  // Auto-hide success/info notice
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearchTerm(searchInput.trim());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadUsers = useCallback(async (targetPage: number, term: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await adminUserService.listUsers({
        page: targetPage,
        limit: DEFAULT_LIMIT,
        search: term,
      });
      setUsers(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    await loadUsers(page, searchTerm);
  }, [loadUsers, page, searchTerm]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const visiblePages = useMemo(
    () => buildVisiblePages(meta.page, meta.totalPages),
    [meta.page, meta.totalPages]
  );

  const openCreate = () => {
    resetCreate({
      username: "",
      email: "",
      gender: "other",
      role: "user",
      status: "active",
      password: "",
    });
    setNotice(null);
    setCreateOpen(true);
  };

  const openView = async (userId: string) => {
    setViewOpen(true);
    setViewedUser(null);
    setViewError(null);
    setViewLoading(true);

    try {
      const data = await adminUserService.getUser(userId);
      setViewedUser(data);
    } catch (err) {
      setViewError(err instanceof Error ? err.message : "Failed to load user");
    } finally {
      setViewLoading(false);
    }
  };

  const openEdit = async (userId: string) => {
    setEditOpen(true);
    setEditingUserId(userId);
    setEditError(null);
    setEditLoading(true);

    try {
      const data = await adminUserService.getUser(userId);
      resetEdit({
        username: data.username,
        email: data.email,
        gender: data.gender,
        role: data.role,
        status: data.status,
      });
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to load user");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async (data: AdminCreateUserFormData) => {
    try {
      await adminUserService.createUser(data);
      setCreateOpen(false);
      showNotice("success", "User created successfully.");
      setPage(1);
      await loadUsers(1, searchTerm);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      showNotice("error", err instanceof Error ? err.message : "Failed to create user");
    }
  };

  const handleUpdate = async (data: AdminUpdateUserFormData) => {
    if (!editingUserId) return;

    try {
      await adminUserService.updateUser(editingUserId, data);
      setEditOpen(false);
      setEditingUserId(null);
      showNotice("success", "User updated successfully.");
      await loadUsers(page, searchTerm);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);

    try {
      await adminUserService.deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      showNotice("success", "User deleted successfully.");
      const nextPage = users.length === 1 && page > 1 ? page - 1 : page;
      setPage(nextPage);
      await loadUsers(nextPage, searchTerm);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      showNotice("error", err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      {notice ? (
        <div className={`toast toast-${noticeType}`}>
          {notice}
          <button className="toast-close" onClick={() => setNotice(null)} aria-label="Close">
            ×
          </button>
        </div>
      ) : null}
      <header className="topbar">
        <div>
          <h1>User Management</h1>
          <p>View, search, create, edit, delete users, and view user details.</p>
        </div>

        <button className="primary" onClick={openCreate}>
          + Create User
        </button>
      </header>

      <section className="card">
        <div className="toolbar">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by username or email"
          />
          <div className="meta">{meta.total} total</div>
        </div>

        {error ? (
          <div className="state error">
            <p>{error}</p>
            <button className="secondary" onClick={() => void fetchUsers()}>
              Retry
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="state">
            <div className="spinner" />
            <p>Loading users...</p>
          </div>
        ) : null}

        {!loading && !error && users.length === 0 ? (
          <div className="state">
            <p>No users found.</p>
          </div>
        ) : null}

        {!loading && !error && users.length > 0 ? (
          <>
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="mono" title={u.id}>
                        {u.id}
                      </td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`pill role role-${u.role}`}>{u.role}</span>
                      </td>
                      <td>
                        <span className={`pill status status-${u.status}`}>{u.status}</span>
                      </td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td>
                        <div className="actions">
                          <button className="ghost" onClick={() => void openView(u.id)}>
                            View
                          </button>
                          <button className="ghost" onClick={() => void openEdit(u.id)}>
                            Edit
                          </button>
                          <button className="danger" onClick={() => setDeleteTarget(u)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <div className="summary">
                Page {meta.page} of {meta.totalPages}
              </div>
              <div className="buttons">
                <button
                  className="pageBtn"
                  disabled={meta.page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                {visiblePages.map((p) => (
                  <button
                    key={p}
                    className={`pageBtn ${p === meta.page ? "active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="pageBtn"
                  disabled={meta.page === meta.totalPages}
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : null}
      </section>

      {/* View modal */}
      {viewOpen ? (
        <div className="overlay" onClick={() => setViewOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHead">
              <div>
                <h2>User Details</h2>
                <p>Read-only details for the selected user.</p>
              </div>
              <button className="x" onClick={() => setViewOpen(false)}>
                X
              </button>
            </div>

            {viewLoading ? (
              <div className="state compact">
                <div className="spinner" />
                <p>Loading...</p>
              </div>
            ) : null}

            {viewError ? <div className="state compact error">{viewError}</div> : null}

            {!viewLoading && !viewError && viewedUser ? (
              <div className="details">
                <div className="detailRow">
                  <span className="label">ID</span>
                  <span className="mono break">{viewedUser.id}</span>
                </div>
                <div className="detailRow">
                  <span className="label">Username</span>
                  <span>{viewedUser.username}</span>
                </div>
                <div className="detailRow">
                  <span className="label">Email</span>
                  <span className="break">{viewedUser.email}</span>
                </div>
                <div className="detailRow">
                  <span className="label">Role</span>
                  <span className={`pill role role-${viewedUser.role}`}>{viewedUser.role}</span>
                </div>
                <div className="detailRow">
                  <span className="label">Status</span>
                  <span className={`pill status status-${viewedUser.status}`}>
                    {viewedUser.status}
                  </span>
                </div>
                <div className="detailRow">
                  <span className="label">Created</span>
                  <span>{formatDate(viewedUser.createdAt)}</span>
                </div>
                <div className="detailRow">
                  <span className="label">Updated</span>
                  <span>{formatDate(viewedUser.updatedAt)}</span>
                </div>

                <div className="modalActions">
                  <button className="secondary" onClick={() => setViewOpen(false)}>
                    Close
                  </button>
                  <button
                    className="primary"
                    onClick={() => {
                      setViewOpen(false);
                      void openEdit(viewedUser.id);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Create modal */}
      {createOpen ? (
        <div className="overlay" onClick={() => setCreateOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHead">
              <div>
                <h2>Create User</h2>
                <p>Create a new user account.</p>
              </div>
              <button className="x" onClick={() => setCreateOpen(false)}>
                X
              </button>
            </div>

            <form className="form" onSubmit={handleCreateSubmit(handleCreate)} autoComplete="off">
              {/* Prevent browser autofill by adding dummy fields */}
              <input
                type="text"
                name="fake-username"
                autoComplete="username"
                tabIndex={-1}
                className="sr-only"
              />
              <input
                type="password"
                name="fake-password"
                autoComplete="current-password"
                tabIndex={-1}
                className="sr-only"
              />
              <label>
                Username
                <input type="text" autoComplete="off" {...registerCreate("username")} />
                {createErrors.username ? (
                  <span className="fieldError">{createErrors.username.message}</span>
                ) : null}
              </label>

              <label>
                Email
                <input type="email" autoComplete="off" {...registerCreate("email")} />
                {createErrors.email ? (
                  <span className="fieldError">{createErrors.email.message}</span>
                ) : null}
              </label>

              <label>
                Gender
                <select {...registerCreate("gender")}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {createErrors.gender ? (
                  <span className="fieldError">{createErrors.gender.message}</span>
                ) : null}
              </label>

              <label>
                Role
                <select {...registerCreate("role")}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {createErrors.role ? (
                  <span className="fieldError">{createErrors.role.message}</span>
                ) : null}
              </label>

              <label>
                Status
                <select {...registerCreate("status")}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {createErrors.status ? (
                  <span className="fieldError">{createErrors.status.message}</span>
                ) : null}
              </label>

              <label>
                Password
                <input type="password" autoComplete="new-password" {...registerCreate("password")} />
                {createErrors.password ? (
                  <span className="fieldError">{createErrors.password.message}</span>
                ) : null}
              </label>

              <div className="modalActions">
                <button type="button" className="secondary" onClick={() => setCreateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary" disabled={creating}>
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Edit modal */}
      {editOpen ? (
        <div className="overlay" onClick={() => setEditOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHead">
              <div>
                <h2>Edit User</h2>
                <p>Update selected user fields.</p>
              </div>
              <button className="x" onClick={() => setEditOpen(false)}>
                X
              </button>
            </div>

            {editLoading ? (
              <div className="state compact">
                <div className="spinner" />
                <p>Loading...</p>
              </div>
            ) : null}
            {editError ? <div className="state compact error">{editError}</div> : null}

            {!editLoading && !editError ? (
              <form className="form" onSubmit={handleEditSubmit(handleUpdate)}>
                <label>
                  Username
                  <input type="text" {...registerEdit("username")} />
                  {editErrors.username ? (
                    <span className="fieldError">{editErrors.username.message}</span>
                  ) : null}
                </label>

                <label>
                  Email
                  <input type="email" {...registerEdit("email")} />
                  {editErrors.email ? (
                    <span className="fieldError">{editErrors.email.message}</span>
                  ) : null}
                </label>

                <label>
                  Gender
                  <select {...registerEdit("gender")}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {editErrors.gender ? (
                    <span className="fieldError">{editErrors.gender.message}</span>
                  ) : null}
                </label>

                <label>
                  Role
                  <select {...registerEdit("role")}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {editErrors.role ? (
                    <span className="fieldError">{editErrors.role.message}</span>
                  ) : null}
                </label>

                <label>
                  Status
                  <select {...registerEdit("status")}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {editErrors.status ? (
                    <span className="fieldError">{editErrors.status.message}</span>
                  ) : null}
                </label>

                <div className="modalActions">
                  <button type="button" className="secondary" onClick={() => setEditOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary" disabled={updating}>
                    {updating ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Delete modal */}
      {deleteTarget ? (
        <div className="overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <h2>Delete User</h2>
            <p>
              Are you sure you want to delete <strong>{deleteTarget.username}</strong>? This action
              cannot be undone.
            </p>
            <div className="modalActions">
              <button
                type="button"
                className="secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button type="button" className="dangerBtn" onClick={() => void handleDelete()}>
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .toast {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 2000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          max-width: min(520px, calc(100vw - 32px));
          padding: 0.9rem 1rem;
          border-radius: 14px;
          border: 1px solid transparent;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
          font-weight: 700;
          line-height: 1.3;
          word-break: break-word;
          background: #ffffff;
        }

        .toast-success {
          background: #eff6ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
        }

        .toast-error {
          background: #fff7f7;
          color: #991b1b;
          border-color: #fecaca;
        }

        .toast-close {
          margin-left: auto;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(15, 23, 42, 0.08);
          font-size: 1.25rem;
          line-height: 1;
          cursor: pointer;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
          background: #ffffff;
          border: 1px solid #dbe4f0;
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
        }

        h1 {
          margin: 0 0 0.4rem;
          font-size: 2rem;
          color: #0f172a;
        }

        p {
          margin: 0;
          color: #64748b;
        }

        .primary,
        .secondary,
        .ghost,
        .danger,
        .pageBtn,
        .dangerBtn,
        .x {
          border: none;
          cursor: pointer;
          font: inherit;
        }

        .primary {
          padding: 0.85rem 1.1rem;
          border-radius: 14px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          font-weight: 700;
          white-space: nowrap;
        }

        .secondary {
          padding: 0.85rem 1.1rem;
          border-radius: 14px;
          background: #e2e8f0;
          color: #0f172a;
          font-weight: 700;
        }

        .card {
          background: #ffffff;
          border: 1px solid #dbe4f0;
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
        }

        .toolbar {
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .toolbar input {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          padding: 0.95rem 1rem;
          font-size: 0.95rem;
          background: #f8fafc;
        }

        .meta {
          color: #64748b;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .state {
          min-height: 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          border: 1px dashed #cbd5e1;
          border-radius: 18px;
          color: #475569;
          text-align: center;
          padding: 1.25rem;
        }

        .state.compact {
          min-height: 110px;
        }

        .state.error {
          border-style: solid;
          border-color: #fecaca;
          background: #fff7f7;
          color: #991b1b;
        }

        .spinner {
          width: 1.75rem;
          height: 1.75rem;
          border: 3px solid #dbe4f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .tableWrap {
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        th {
          background: #f8fafc;
          font-size: 0.78rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #64748b;
        }

        .mono {
          font-family: Consolas, monospace;
          color: #475569;
          max-width: 320px;
          word-break: break-all;
        }

        .break {
          word-break: break-all;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: capitalize;
        }

        .role-admin {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .role-user {
          background: #ede9fe;
          color: #6d28d9;
        }

        .status-active {
          background: #dcfce7;
          color: #15803d;
        }

        .status-inactive {
          background: #fee2e2;
          color: #b91c1c;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .ghost {
          padding: 0.6rem 0.85rem;
          border-radius: 12px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 700;
        }

        .danger {
          padding: 0.6rem 0.85rem;
          border-radius: 12px;
          background: #fff1f2;
          color: #dc2626;
          font-weight: 800;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .summary {
          color: #64748b;
          font-size: 0.9rem;
        }

        .buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .pageBtn {
          padding: 0.6rem 0.85rem;
          border-radius: 12px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 700;
        }

        .pageBtn.active {
          background: #1d4ed8;
          color: #ffffff;
        }

        .pageBtn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 1000;
        }

        .modal {
          width: min(760px, 100%);
          background: #ffffff;
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
        }

        .modal.small {
          width: min(520px, 100%);
        }

        .modalHead {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
          margin-bottom: 1.1rem;
        }

        .modalHead h2 {
          margin: 0 0 0.2rem;
          color: #0f172a;
        }

        .modalHead p {
          margin: 0;
          color: #64748b;
        }

        .x {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 800;
        }

        .form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }

        .form label {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          color: #0f172a;
          font-weight: 700;
          font-size: 0.92rem;
        }

        .form input,
        .form select {
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 0.85rem 0.95rem;
          font: inherit;
          background: #f8fafc;
        }

        .fieldError {
          color: #dc2626;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .modalActions {
          grid-column: 1 / -1;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }

        .dangerBtn {
          padding: 0.85rem 1.1rem;
          border-radius: 14px;
          background: #dc2626;
          color: #ffffff;
          font-weight: 800;
        }

        .details {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .detailRow {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.85rem 1rem;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .label {
          font-size: 0.78rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        @media (max-width: 768px) {
          .topbar {
            flex-direction: column;
            align-items: stretch;
          }

          .form {
            grid-template-columns: 1fr;
          }

          th,
          td {
            padding: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
