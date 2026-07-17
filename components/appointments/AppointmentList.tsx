import { Appointment, AppointmentStatus } from "../../types/appointment.types";
import { AppointmentCard } from "./AppointmentCard";

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onReminderToggle: (id: string, reminderEnabled: boolean) => void;
}

export function AppointmentList({
  appointments,
  onEdit,
  onDelete,
  onStatusChange,
  onReminderToggle,
}: AppointmentListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment._id}
          appointment={appointment}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onReminderToggle={onReminderToggle}
        />
      ))}
    </div>
  );
}
