import { AdminNotificationItem, AdminNotificationType } from "../../types/admin-notification.types";

interface AdminNotificationItemRowProps {
  notification: AdminNotificationItem;
}

interface TypeConfig {
  icon: string;
  iconBg: string;
}

const typeConfig: Record<AdminNotificationType, TypeConfig> = {
  new_user_registered: { icon: "🆕", iconBg: "bg-blue-50 dark:bg-blue-500/10" },
  gemini_api_failed: { icon: "🤖", iconBg: "bg-red-50 dark:bg-red-500/10" },
  system_error: { icon: "🔥", iconBg: "bg-red-50 dark:bg-red-500/10" },
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

export function AdminNotificationItemRow({ notification }: AdminNotificationItemRowProps) {
  const config = typeConfig[notification.type];

  return (
    <li
      className={`flex gap-4 rounded-xl border p-4 ${
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
            {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" title="Unread" />}
            <span className="whitespace-nowrap text-xs text-gray-400 dark:text-gray-500">
              {timeAgo(notification.date)}
            </span>
          </div>
        </div>
        <p className="mt-1 truncate text-sm leading-relaxed text-gray-500 dark:text-gray-400">{notification.message}</p>
      </div>
    </li>
  );
}
