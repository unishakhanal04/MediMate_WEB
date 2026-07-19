import { Appointment } from "../../types/appointment.types";
import { AppointmentScheduleItem } from "./AppointmentScheduleItem";

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
        <span aria-hidden="true">📅</span> Upcoming Appointments
      </h2>

      {appointments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming appointment reminders.</p>
      ) : (
        <div>
          {appointments.map((appointment, index) => (
            <AppointmentScheduleItem
              key={appointment._id}
              appointment={appointment}
              isLast={index === appointments.length - 1}
              showDate
            />
          ))}
        </div>
      )}
    </div>
  );
}
