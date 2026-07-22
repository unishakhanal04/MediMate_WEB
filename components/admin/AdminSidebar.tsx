"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import {
  DashboardIcon,
  UsersIcon,
  SubscriptionIcon,
  PaymentsIcon,
  ReportsIcon,
  AuditLogIcon,
  FeedbackIcon,
  SettingsIcon,
  ProfileIcon,
} from "./icons";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { href: "/admin/users", label: "User Management", Icon: UsersIcon },
  { href: "/admin/subscriptions", label: "Subscriptions", Icon: SubscriptionIcon },
  { href: "/admin/payments", label: "Payments", Icon: PaymentsIcon },
  { href: "/admin/reports", label: "Reports", Icon: ReportsIcon },
  { href: "/admin/audit-logs", label: "Audit Logs", Icon: AuditLogIcon },
  { href: "/admin/feedback", label: "Feedback", Icon: FeedbackIcon },
  { href: "/admin/settings", label: "System Settings", Icon: SettingsIcon },
];

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="flex w-full flex-col border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="px-6 py-6">
        <p className="text-xl font-extrabold tracking-tight text-blue-700 dark:text-blue-400">MediAdmin</p>
        <p className="mt-0.5 text-xs font-medium text-gray-400 dark:text-gray-500">System Control</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4" aria-label="Admin navigation">
        {navItems.map(({ href, label, Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-blue-700 text-white"
                  : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 px-4 py-4 dark:border-gray-800">
        <Link
          href="/admin/profile"
          aria-current={isActivePath(pathname, "/admin/profile") ? "page" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
            isActivePath(pathname, "/admin/profile")
              ? "bg-blue-700 text-white"
              : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
          }`}
        >
          <ProfileIcon />
          Admin Profile
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  );
}
