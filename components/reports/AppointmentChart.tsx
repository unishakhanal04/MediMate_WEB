import { Card } from "../dashboard/Card";
import { AppointmentsReport } from "../../types/report.types";

interface AppointmentChartProps {
  report: AppointmentsReport;
}

export function AppointmentChart({ report }: AppointmentChartProps) {
  const segments = [
    { label: "Upcoming", value: report.upcomingAppointments, color: "bg-blue-500" },
    { label: "Completed", value: report.completedAppointments, color: "bg-emerald-500" },
    { label: "Cancelled", value: report.cancelledAppointments, color: "bg-gray-400" },
  ];

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-900">Appointments</h2>

      <div className="flex h-2 overflow-hidden rounded-full bg-gray-100">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={segment.color}
            style={{
              width:
                report.totalAppointments > 0
                  ? `${(segment.value / report.totalAppointments) * 100}%`
                  : "0%",
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        {segments.map((segment) => (
          <span key={segment.label} className="rounded-full bg-gray-50 px-2 py-1 text-gray-600">
            {segment.value} {segment.label}
          </span>
        ))}
      </div>

      {report.nextAppointment ? (
        <div className="rounded-lg bg-blue-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Next Appointment</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{report.nextAppointment.purpose}</p>
          <p className="text-xs text-gray-600">
            {report.nextAppointment.doctorName} ·{" "}
            {new Date(report.nextAppointment.appointmentDate).toLocaleDateString()} ·{" "}
            {report.nextAppointment.appointmentTime}
          </p>
        </div>
      ) : (
        <p className="py-2 text-sm text-gray-500">No upcoming appointments scheduled.</p>
      )}
    </Card>
  );
}
