import { AuditLogEntry } from "../../types/audit-log.types";
import { getInitials, avatarColorFor } from "../../lib/avatar";

interface AuditLogGroupProps {
  label: string;
  dateLabel: string;
  entries: AuditLogEntry[];
}

const actionMeta: Record<string, { icon: string; label: string; badgeClass: string }> = {
  user_activated: {
    icon: "✅",
    label: "Activated User",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  user_deactivated: {
    icon: "🚫",
    label: "Deactivated User",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  user_updated: {
    icon: "✏️",
    label: "Updated User",
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  user_deleted: {
    icon: "🗑️",
    label: "Deleted User",
    badgeClass: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  },
  report_exported: {
    icon: "⬇️",
    label: "Exported Report",
    badgeClass: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  },
};

const fallbackMeta = { icon: "📝", label: "Admin Action", badgeClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" };

export function AuditLogGroup({ label, dateLabel, entries }: AuditLogGroupProps) {
  return (
    <>
      <tr>
        <td colSpan={4} className="bg-gray-50 px-4 py-2 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{dateLabel}</span>
          </div>
        </td>
      </tr>
      {entries.map((entry) => {
        const meta = actionMeta[entry.action] ?? fallbackMeta;
        return (
          <tr key={entry.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
            <td className="px-4 py-3">
              <p className="font-mono text-sm text-gray-900 dark:text-white">
                {new Date(entry.date).toLocaleTimeString(undefined, { hour12: false })}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Local time</p>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${avatarColorFor(entry.adminId)}`}
                >
                  {getInitials(entry.adminUsername ?? "?")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {entry.adminUsername ?? "Unknown admin"}
                  </p>
                  <p className="truncate font-mono text-[11px] text-gray-400 dark:text-gray-500">
                    ID: {entry.adminId.slice(-6)}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3">
              <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${meta.badgeClass}`}>
                <span aria-hidden="true">{meta.icon}</span> {meta.label}
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              {entry.targetLabel ? `${entry.targetType ?? "record"}: ${entry.targetLabel}` : "—"}
            </td>
          </tr>
        );
      })}
    </>
  );
}
