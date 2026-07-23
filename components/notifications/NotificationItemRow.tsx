import Link from "next/link";
import { NotificationItem, NotificationType } from "../../types/notification.types";

interface NotificationItemRowProps {
  notification: NotificationItem;
}

interface TypeConfig {
  icon: string;
  iconBg: string;
  href: string;
}

const typeConfig: Record<NotificationType, TypeConfig> = {
  medicine_missed: { icon: "⚠️", iconBg: "bg-red-50 dark:bg-red-500/10", href: "/user/medicines" },
  appointment_tomorrow: { icon: "📅", iconBg: "bg-violet-50 dark:bg-violet-500/10", href: "/user/appointments" },
  prescription_uploaded: { icon: "📄", iconBg: "bg-indigo-50 dark:bg-indigo-500/10", href: "/user/prescriptions" },
  low_stock: { icon: "💊", iconBg: "bg-amber-50 dark:bg-amber-500/10", href: "/user/medicines" },
  password_changed: { icon: "🔒", iconBg: "bg-gray-100 dark:bg-gray-800", href: "/user/password" },
};

const timeAgo = (dateStr: string): string => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export function NotificationItemRow({ notification }: NotificationItemRowProps) {
  const config = typeConfig[notification.type];

  return (
    <li>
      <Link
        href={config.href}
        className={`flex gap-4 rounded-xl border p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-800 ${
          notification.read
            ? "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            : "border-blue-200 bg-blue-50/40 dark:border-blue-900/40 dark:bg-blue-500/5"
        }`}
      >
        <span
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-lg ${config.iconBg}`}
          aria-hidden="true"
        >
          {config.icon}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{notification.title}</p>
            <div className="flex flex-shrink-0 items-center gap-2">
              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" title="Unread" />
              )}
              <span className="whitespace-nowrap text-xs text-gray-400 dark:text-gray-500">
                {timeAgo(notification.date)}
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{notification.message}</p>
        </div>
      </Link>
    </li>
  );
}
