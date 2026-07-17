import { StatusBadge } from "../common/StatusBadge";
import { AdminUser } from "../../types/admin.types";

interface UserTableProps {
  users: AdminUser[];
  onView: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
}

export function UserTable({ users, onView, onToggleStatus }: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            <th scope="col" className="px-4 py-3">Username</th>
            <th scope="col" className="px-4 py-3">Email</th>
            <th scope="col" className="px-4 py-3">Role</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Joined</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{user.username}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
              <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{user.role}</td>
              <td className="px-4 py-3">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onView(user)}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onToggleStatus(user)}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
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
