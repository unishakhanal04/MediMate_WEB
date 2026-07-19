import { ReminderLogStatus } from "../../services/reminder.service";
import { ReminderScheduleItem } from "./ReminderScheduleItem";

export interface ScheduleEntry {
  id: string;
  title: string;
  time: string;
  status?: ReminderLogStatus;
}

interface TodayScheduleProps {
  entries: ScheduleEntry[];
  busyId: string | null;
  onMarkTaken: (id: string) => void;
  onMarkSnooze: (id: string) => void;
}

export function TodaySchedule({ entries, busyId, onMarkTaken, onMarkSnooze }: TodayScheduleProps) {
  const remaining = entries.filter((entry) => entry.status !== "taken").length;
  const nextId = entries.find((entry) => entry.status !== "taken")?.id;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
          <span aria-hidden="true">🕐</span> Today&apos;s Schedule
        </h2>
        {entries.length > 0 && (
          <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {remaining} {remaining === 1 ? "Task" : "Tasks"} Remaining
          </span>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No medication reminders are scheduled for today.
        </p>
      ) : (
        <div>
          {entries.map((entry, index) => (
            <ReminderScheduleItem
              key={entry.id}
              title={entry.title}
              time={entry.time}
              status={entry.status}
              isNext={entry.id === nextId}
              isLast={index === entries.length - 1}
              busy={busyId === entry.id}
              onMarkTaken={() => onMarkTaken(entry.id)}
              onMarkSnooze={() => onMarkSnooze(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
