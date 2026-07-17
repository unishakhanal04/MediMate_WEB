import Link from "next/link";
import { Card } from "./Card";
import { Appointment } from "../../types/appointment.types";

interface AppointmentsPanelProps {
  appointments: Appointment[];
}

const formatDay = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateKey = new Date(date);
  dateKey.setHours(0, 0, 0, 0);

  if (dateKey.getTime() === today.getTime()) return "Today";
  if (dateKey.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export function AppointmentsPanel({ appointments }: AppointmentsPanelProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-bold text-gray-900 dark:text-white">Appointments</p>
        <Link
          href="/user/appointments"
          aria-label="Schedule appointment"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-500/30 dark:text-blue-400 dark:hover:bg-blue-500/10"
        >
          +
        </Link>
      </div>

      {appointments.length === 0 ? (
        <p className="py-4 text-sm text-gray-400 dark:text-gray-500">No upcoming appointments.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="flex items-center gap-3 py-3">
              <span
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg dark:bg-blue-500/10"
                aria-hidden="true"
              >
                🩺
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                  {appointment.doctorName}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {appointment.specialization || appointment.purpose}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  🕐 {formatDay(appointment.appointmentDate)}, {appointment.appointmentTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
