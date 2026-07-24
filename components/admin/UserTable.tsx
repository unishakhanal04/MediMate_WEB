import Link from "next/link";
import { StatusBadge } from "../common/StatusBadge";
import { AdminUser } from "../../types/admin.types";
import { getInitials, avatarColorFor } from "../../lib/avatar";

interface UserTableProps {
  users: AdminUser[];
  onToggleStatus: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

const formatLastLogin = (lastLoginAt?: string) => {
  if (!lastLoginAt) return "Never";
  const date = new Date(lastLoginAt);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export function UserTable({ users, onToggleStatus, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
            <th scope="col" className="px-4 py-3">Name / Email</th>
            <th scope="col" className="px-4 py-3">Role</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Last Login</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {user.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.profileImage} alt={user.username} className="h-9 w-9 flex-shrink-0 rounded-full object-cover" />
                  ) : (
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColorFor(user.id)}`}
                    >
                      {getInitials(user.username)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900 dark:text-white">{user.username}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{user.role}</td>
              <td className="px-4 py-3">
                <StatusBadge status={user.status} label={user.status.toUpperCase()} />
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatLastLogin(user.lastLoginAt)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => onToggleStatus(user)}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
