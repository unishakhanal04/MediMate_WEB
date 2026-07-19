import Link from "next/link";
import { Appointment } from "../../types/appointment.types";
import { AppointmentScheduleItem } from "./AppointmentScheduleItem";

interface AppointmentScheduleProps {
  appointments: Appointment[];
}

export function AppointmentSchedule({ appointments }: AppointmentScheduleProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
          <span aria-hidden="true">🩺</span> Today&apos;s Appointments
        </h2>
        <Link
          href="/user/appointments"
          className="shrink-0 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          View All
        </Link>
      </div>

      {appointments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No appointment reminders are scheduled for today.
        </p>
      ) : (
        <div>
          {appointments.map((appointment, index) => (
            <AppointmentScheduleItem
              key={appointment._id}
              appointment={appointment}
              isLast={index === appointments.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
