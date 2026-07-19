import { Reminder, formatReminderTime } from "../../services/reminder.service";
import { StatusBadge } from "../common/StatusBadge";

interface ReminderListProps {
  reminders: Reminder[];
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export function ReminderList({ reminders, onEdit, onDelete }: ReminderListProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            <th scope="col" className="px-4 py-3">Reminder</th>
            <th scope="col" className="px-4 py-3">Time</th>
            <th scope="col" className="px-4 py-3">Days</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((reminder) => (
            <tr
              key={reminder._id}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{reminder.title}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatReminderTime(reminder.time)}</td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{reminder.days.join(", ")}</td>
              <td className="px-4 py-3">
                <StatusBadge status={reminder.enabled ? "active" : "inactive"} label={reminder.enabled ? "Enabled" : "Disabled"} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(reminder)}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(reminder._id)}
                    className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
