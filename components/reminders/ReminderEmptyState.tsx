interface ReminderEmptyStateProps {
  onAddReminder: () => void;
}

export function ReminderEmptyState({ onAddReminder }: ReminderEmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:px-12 sm:py-16">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl dark:bg-blue-500/10">
        ⏰
      </span>

      <h2 className="mt-6 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">No reminders yet</h2>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
        Set a reminder for your medications so you never miss a dose.
      </p>

      <button
        onClick={onAddReminder}
        className="mt-8 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:text-base"
      >
        Set New Reminder
      </button>
    </div>
  );
}
