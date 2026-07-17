"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../Button";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user?.username || "Admin"}</p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
      </div>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
}
