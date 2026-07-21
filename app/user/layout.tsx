"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";
import { notificationService } from "../../services/notification.service";
import { systemService } from "../../services/system.service";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

const isActivePath = (pathname: string, href: string) => {
  if (href === "/user") {
    return pathname === "/user";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

const navItems = [
  { href: "/user", label: "Dashboard", icon: "🏠" },
  { href: "/user/medicines", label: "Medicines", icon: "💊" },
  { href: "/user/reminders", label: "Reminders", icon: "⏰" },
  { href: "/user/prescriptions", label: "Prescriptions", icon: "📄" },
  { href: "/user/appointments", label: "Appointments", icon: "📅" },
  { href: "/user/reports", label: "Reports", icon: "📈" },
  { href: "/user/timeline", label: "Timeline", icon: "🕒" },
  { href: "/user/notifications", label: "Notifications", icon: "🔔" },
  { href: "/user/ai", label: "AI Assistant", icon: "✨" },
  { href: "/user/subscription", label: "Subscription", icon: "⭐" },
  { href: "/user/feedback", label: "Feedback", icon: "💬" },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, authReady, logout, updateUser } = useAuth();
  const [accessReady, setAccessReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    systemService
      .getMaintenanceStatus()
      .then((data) => setMaintenanceMode(data.maintenanceMode))
      .catch((err) => console.error("Failed to check maintenance status:", err));
  }, []);

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
        if (freshUser.role === "admin") {
          router.replace("/admin");
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

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!accessReady) return;
    notificationService
      .getNotifications()
      .then((data) => setUnreadCount(data.unreadCount))
      .catch((err) => console.error("Failed to fetch notification count:", err));
  }, [accessReady, pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = useMemo(() => {
    if (!user?.username) return "";
    return user.username.trim().slice(0, 1).toUpperCase();
  }, [user?.username]);

  if (maintenanceMode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center dark:bg-gray-950">
        <span className="text-5xl" aria-hidden="true">🛠️</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MediMate is under maintenance</h1>
        <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
          We&apos;re making some improvements. Please check back shortly.
        </p>
      </div>
    );
  }

  if (!authReady || !isAuthenticated || !accessReady) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-[#F4F5FB] transition-transform duration-300 dark:bg-gray-900 lg:sticky lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <Link href="/user" className="text-xl font-extrabold tracking-tight text-blue-600">
            MediMate
          </Link>
          <button
            className="text-xl text-gray-500 dark:text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="mx-6 mt-6 flex items-center gap-3 rounded-xl bg-white px-3 py-3 shadow-sm dark:bg-gray-800">
          {user?.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.profileImage}
              alt={user.username}
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {initials || "👤"}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{user?.username}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto px-4" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-violet-500 text-white"
                    : "text-gray-600 hover:bg-white dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.href === "/user/notifications" && unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-1 border-t border-gray-200 px-4 py-4 dark:border-gray-800">
          <Link
            href="/user/profile"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-white dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <span aria-hidden="true">⚙️</span>
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-white dark:hover:bg-gray-800"
          >
            <span aria-hidden="true">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center border-b border-gray-100 px-4 py-3 dark:border-gray-800 lg:hidden">
          <button
            className="text-xl text-gray-600 dark:text-gray-400"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
