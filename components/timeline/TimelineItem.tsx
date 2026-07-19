import Link from "next/link";
import { TimelineEvent, TimelineEventType } from "../../types/timeline.types";

interface TimelineItemProps {
  event: TimelineEvent;
}

interface TypeConfig {
  icon: string;
  iconBg: string;
  badgeLabel: string;
  badgeClass: string;
  actionLabel: string;
  href: (event: TimelineEvent) => string;
}

const typeConfig: Record<TimelineEventType, TypeConfig> = {
  medicine_added: {
    icon: "💊",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    badgeLabel: "MEDICATION",
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    actionLabel: "View in Medicines",
    href: () => "/user/medicines",
  },
  medicine_taken: {
    icon: "✅",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    badgeLabel: "MEDICATION",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    actionLabel: "View in Medicines",
    href: () => "/user/medicines",
  },
  medicine_skipped: {
    icon: "⏭️",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    badgeLabel: "MEDICATION",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    actionLabel: "View in Medicines",
    href: () => "/user/medicines",
  },
  medicine_missed: {
    icon: "⚠️",
    iconBg: "bg-red-50 dark:bg-red-500/10",
    badgeLabel: "MEDICATION",
    badgeClass: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    actionLabel: "View in Medicines",
    href: () => "/user/medicines",
  },
  prescription_uploaded: {
    icon: "📄",
    iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
    badgeLabel: "PRESCRIPTION",
    badgeClass: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
    actionLabel: "View Prescription Details",
    href: (event) => `/user/prescriptions/${event.refId}`,
  },
  appointment: {
    icon: "📅",
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    badgeLabel: "APPOINTMENT",
    badgeClass: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    actionLabel: "View Appointment",
    href: () => "/user/appointments",
  },
  ai_conversation: {
    icon: "💬",
    iconBg: "bg-purple-50 dark:bg-purple-500/10",
    badgeLabel: "AI CHAT",
    badgeClass: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    actionLabel: "View Conversation",
    href: () => "/user/ai",
  },
  profile_updated: {
    icon: "👤",
    iconBg: "bg-gray-100 dark:bg-gray-800",
    badgeLabel: "PROFILE",
    badgeClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    actionLabel: "View Profile",
    href: () => "/user/profile",
  },
};

export function TimelineItem({ event }: TimelineItemProps) {
  const config = typeConfig[event.type];

  return (
    <li>
      <Link
        href={config.href(event)}
        className={`flex gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800 ${
          event.type === "medicine_missed" ? "border-l-4 border-l-red-400" : ""
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
            <p className="text-sm font-bold text-gray-900 dark:text-white">{event.title}</p>
            <span className="flex-shrink-0 whitespace-nowrap text-xs text-gray-400 dark:text-gray-500">
              {new Date(event.date).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {event.description && (
            <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{event.description}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${config.badgeClass}`}
            >
              {config.badgeLabel}
            </span>
            <span className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
              {config.actionLabel}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
