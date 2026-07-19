import { Appointment } from "../types/appointment.types";

const DEFAULT_DURATION_MINUTES = 30;

const toIcsDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

const escapeText = (text: string) => text.replace(/[\\;,]/g, (char) => `\\${char}`).replace(/\n/g, "\\n");

export function downloadAppointmentIcs(appointment: Appointment) {
  const datePart = appointment.appointmentDate.split("T")[0];
  const start = new Date(`${datePart}T${appointment.appointmentTime}:00`);
  const end = new Date(start.getTime() + DEFAULT_DURATION_MINUTES * 60 * 1000);

  const descriptionParts = [`With ${appointment.doctorName}`];
  if (appointment.specialization) descriptionParts.push(`(${appointment.specialization})`);
  if (appointment.notes) descriptionParts.push(`— ${appointment.notes}`);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MediMate//Appointment//EN",
    "BEGIN:VEVENT",
    `UID:${appointment._id}@medimate.local`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeText(appointment.purpose)}`,
    `DESCRIPTION:${escapeText(descriptionParts.join(" "))}`,
    appointment.hospital ? `LOCATION:${escapeText(appointment.hospital)}` : undefined,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => Boolean(line));

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${appointment.purpose.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "appointment"}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
