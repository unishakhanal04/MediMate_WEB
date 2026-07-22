import { Reminder, ReminderLog, formatReminderTime, getDayAbbrev, toDateKey } from "../../services/reminder.service";

interface ReminderHistoryProps {
  reminders: Reminder[];
  logs: ReminderLog[];
  days?: number;
}

type HistoryStatus = "taken" | "snoozed" | "skipped" | "missed";

const STATUS_META: Record<HistoryStatus, { icon: string; label: string; className: string }> = {
  taken: { icon: "✓", label: "Taken", className: "text-emerald-600 dark:text-emerald-400" },
  snoozed: { icon: "⏰", label: "Snoozed", className: "text-amber-600 dark:text-amber-400" },
  skipped: { icon: "⏭", label: "Skipped", className: "text-gray-500 dark:text-gray-400" },
  missed: { icon: "✗", label: "Missed", className: "text-red-600 dark:text-red-400" },
};

const formatDayLabel = (date: Date, daysAgo: number): string => {
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return date.toLocaleDateString(undefined, { weekday: "long" });
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export function ReminderHistory({ reminders, logs, days = 7 }: ReminderHistoryProps) {
  const dayGroups = Array.from({ length: days - 1 }, (_, i) => i + 1)
    .map((daysAgo) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const dateKey = toDateKey(date);
      const dayAbbrev = getDayAbbrev(date);

      const entries = reminders
        .filter((reminder) => reminder.enabled && reminder.days.includes(dayAbbrev))
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((reminder) => {
          const log = logs.find((l) => l.reminderId === reminder._id && l.date === dateKey);
          const status: HistoryStatus = log ? (log.status as HistoryStatus) : "missed";
          return { id: reminder._id, title: reminder.title, time: reminder.time, status };
        });

      return { dateKey, label: formatDayLabel(date, daysAgo), entries };
    })
    .filter((group) => group.entries.length > 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
        <span aria-hidden="true">📜</span> Reminder History
      </h2>

      {dayGroups.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No reminder history yet.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {dayGroups.map((group) => (
            <div key={group.dateKey}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {group.label}
              </p>
              <div className="flex flex-col gap-1.5">
                {group.entries.map((entry) => {
                  const meta = STATUS_META[entry.status];
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm dark:border-gray-800"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {formatReminderTime(entry.time)}
                        </span>
                        <span className="truncate font-medium text-gray-900 dark:text-white">{entry.title}</span>
                      </div>
                      <span className={`flex shrink-0 items-center gap-1 text-xs font-semibold ${meta.className}`}>
                        {meta.icon} {meta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
