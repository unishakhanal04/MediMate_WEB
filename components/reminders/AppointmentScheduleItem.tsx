import { Appointment } from "../../types/appointment.types";
import { formatReminderTime } from "../../services/reminder.service";
import { StatusBadge } from "../common/StatusBadge";

interface AppointmentScheduleItemProps {
  appointment: Appointment;
  isLast: boolean;
  showDate?: boolean;
}

export function AppointmentScheduleItem({ appointment, isLast, showDate = false }: AppointmentScheduleItemProps) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {!isLast && (
        <span
          className="absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-px bg-gray-200 dark:bg-gray-800"
          aria-hidden="true"
        />
      )}
      <span
        className="z-10 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
        aria-hidden="true"
      />

      <div className="flex-1 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-base dark:bg-blue-500/10"
              aria-hidden="true"
            >
              🩺
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-blue-700 dark:text-blue-400">{appointment.purpose}</h3>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {appointment.doctorName}
                {appointment.hospital ? ` · ${appointment.hospital}` : ""}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {showDate
              ? `${new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} · ${formatReminderTime(appointment.appointmentTime)}`
              : formatReminderTime(appointment.appointmentTime)}
          </span>
        </div>

        <div className="mt-3">
          <StatusBadge status={appointment.status} />
        </div>
      </div>
    </div>
  );
}
