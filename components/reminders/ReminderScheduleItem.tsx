import { ReminderLogStatus, formatReminderTime } from "../../services/reminder.service";

interface ReminderScheduleItemProps {
  title: string;
  time: string;
  status?: ReminderLogStatus;
  isNext: boolean;
  isLast: boolean;
  busy: boolean;
  onMarkTaken: () => void;
  onMarkSnooze: () => void;
  onMarkSkip: () => void;
}

export function ReminderScheduleItem({
  title,
  time,
  status,
  isNext,
  isLast,
  busy,
  onMarkTaken,
  onMarkSnooze,
  onMarkSkip,
}: ReminderScheduleItemProps) {
  const taken = status === "taken";
  const snoozed = status === "snoozed";
  const skipped = status === "skipped";

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {!isLast && (
        <span
          className="absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-px bg-gray-200 dark:bg-gray-800"
          aria-hidden="true"
        />
      )}
      <span
        className={`z-10 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 bg-white dark:bg-gray-900 ${
          taken
            ? "border-emerald-500 bg-emerald-500 text-white"
            : isNext
            ? "border-blue-600"
            : "border-gray-300 dark:border-gray-700"
        }`}
        aria-hidden="true"
      >
        {taken && <span className="text-xs leading-none">✓</span>}
        {!taken && isNext && <span className="h-2 w-2 rounded-full bg-blue-600" />}
      </span>

      <div
        className={`flex-1 rounded-xl border p-4 ${
          isNext
            ? "border-blue-200 bg-blue-50/40 dark:border-blue-900/40 dark:bg-blue-500/5"
            : "border-gray-200 dark:border-gray-800"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-base dark:bg-blue-500/10"
              aria-hidden="true"
            >
              💊
            </span>
            <h3 className="truncate font-semibold text-blue-700 dark:text-blue-400">{title}</h3>
          </div>
          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {formatReminderTime(time)}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {taken ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              ✓ Taken
            </span>
          ) : (
            <>
              <button
                disabled={busy}
                onClick={onMarkTaken}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Taken
              </button>
              <button
                disabled={busy}
                onClick={onMarkSnooze}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {snoozed ? "Snoozed" : "Snooze 15m"}
              </button>
              <button
                disabled={busy}
                onClick={onMarkSkip}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  skipped
                    ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {skipped ? "Skipped" : "Skip"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
