import { Appointment } from "../../types/appointment.types";
import { downloadAppointmentIcs } from "../../lib/ics";

interface AppointmentHeroCardProps {
  appointment: Appointment;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (id: string) => void;
}

export function AppointmentHeroCard({ appointment, onReschedule, onCancel }: AppointmentHeroCardProps) {
  const handleCancel = () => {
    if (confirm("Cancel this appointment?")) {
      onCancel(appointment._id);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-md sm:p-8">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
        <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
        Next Appointment
      </span>

      <h2 className="mt-4 max-w-xl text-2xl font-bold leading-tight sm:text-3xl">
        {appointment.purpose} with {appointment.doctorName}
      </h2>

      <p className="mt-2 text-sm font-medium text-blue-100 sm:text-base">
        {new Date(appointment.appointmentDate).toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}{" "}
        at {appointment.appointmentTime}
      </p>

      <div className="mt-5 flex flex-wrap gap-6">
        {appointment.hospital && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-200">Location</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold">
              <span aria-hidden="true">📍</span>
              {appointment.hospital}
            </p>
          </div>
        )}
        {appointment.specialization && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-200">Specialty</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold">
              <span aria-hidden="true">🩺</span>
              {appointment.specialization}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => downloadAppointmentIcs(appointment)}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
        >
          Add to Calendar
        </button>
        <button
          type="button"
          onClick={() => onReschedule(appointment)}
          className="rounded-lg bg-blue-800/60 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800/80"
        >
          Reschedule
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-100 underline-offset-2 transition-colors hover:text-white hover:underline"
        >
          Cancel Visit
        </button>
      </div>
    </div>
  );
}
