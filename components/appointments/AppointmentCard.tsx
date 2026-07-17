import { Card } from "../dashboard/Card";
import { StatusBadge } from "../common/StatusBadge";
import { Appointment, AppointmentStatus } from "../../types/appointment.types";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onReminderToggle: (id: string, reminderEnabled: boolean) => void;
}

export function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
  onStatusChange,
  onReminderToggle,
}: AppointmentCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">{appointment.purpose}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {appointment.doctorName}
            {appointment.specialization ? ` · ${appointment.specialization}` : ""}
          </p>
        </div>
        <StatusBadge status={appointment.status} className="shrink-0" />
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Date &amp; Time</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {new Date(appointment.appointmentDate).toLocaleDateString()} · {appointment.appointmentTime}
          </span>
        </div>
        {appointment.hospital && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Hospital</span>
            <span className="font-medium text-gray-900 dark:text-white">{appointment.hospital}</span>
          </div>
        )}
      </div>

      {appointment.notes && <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.notes}</p>}

      <button
        onClick={() => onReminderToggle(appointment._id, !appointment.reminderEnabled)}
        aria-pressed={appointment.reminderEnabled}
        className={`flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
          appointment.reminderEnabled
            ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        }`}
      >
        <span aria-hidden="true">{appointment.reminderEnabled ? "🔔" : "🔕"}</span>
        {appointment.reminderEnabled ? "Reminder On" : "Reminder Off"}
      </button>

      <div className="mt-auto flex flex-wrap gap-2">
        {appointment.status === "scheduled" && (
          <>
            <button
              onClick={() => onStatusChange(appointment._id, "completed")}
              className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
            >
              Mark Completed
            </button>
            <button
              onClick={() => onStatusChange(appointment._id, "cancelled")}
              className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
            >
              Cancel
            </button>
          </>
        )}
        <button
          onClick={() => onEdit(appointment)}
          className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(appointment._id)}
          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
        >
          Delete
        </button>
      </div>
    </Card>
  );
}
