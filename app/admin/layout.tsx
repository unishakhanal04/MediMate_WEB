"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { AdminHeader } from "../../components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, authReady, logout, updateUser } = useAuth();
  const [accessReady, setAccessReady] = useState(false);

  useEffect(() => {
    if (!authReady) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    let alive = true;
    authService
      .whoami()
      .then((freshUser) => {
        if (!alive) return;
        updateUser(freshUser);
        if (freshUser.role !== "admin") {
          router.replace("/user");
          return;
        }
        setAccessReady(true);
      })
      .catch(() => {
        if (!alive) return;
        logout();
        router.replace("/login");
      });

    return () => {
      alive = false;
    };
  }, [authReady, isAuthenticated, logout, router, updateUser]);

  if (!authReady || !isAuthenticated || !accessReady) {
    return <LoadingSpinner message="Checking admin access..." />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950 lg:flex-row">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
