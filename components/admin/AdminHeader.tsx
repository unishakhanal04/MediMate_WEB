"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { adminService } from "../../services/admin.service";
import { SearchIcon, BellIcon } from "./icons";

export function AdminHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    adminService
      .getNotifications()
      .then((data) => setUnreadCount(data.unreadCount))
      .catch((err) => console.error("Failed to fetch admin notification count:", err));
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/admin/users?search=${encodeURIComponent(trimmed)}`);
  };

  const initials = user?.username?.trim().slice(0, 1).toUpperCase() || "A";

  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
      <form onSubmit={handleSearch} className="relative min-w-[240px] flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or email..."
          aria-label="Search users"
          className="w-full max-w-md rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-900"
        />
      </form>

      <button
        onClick={() => router.push("/admin/notifications")}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <div className="flex flex-shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.username || "Admin"}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Admin</p>
        </div>
        {user?.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.profileImage}
            alt={user.username}
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
            {initials}
          </span>
        )}
      </div>
    </header>
  );
}
