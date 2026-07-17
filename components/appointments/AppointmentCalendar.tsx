"use client";

import { useMemo, useState } from "react";
import { Card } from "../dashboard/Card";
import { Appointment } from "../../types/appointment.types";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AppointmentCalendar({ appointments, onSelectAppointment }: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments.forEach((appointment) => {
      const key = new Date(appointment.appointmentDate).toDateString();
      const list = map.get(key) ?? [];
      list.push(appointment);
      map.set(key, list);
    });
    return map;
  }, [appointments]);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = Array.from({ length: firstDay.getDay() }, () => null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const selectedAppointments = selectedDay ? appointmentsByDay.get(selectedDay) ?? [] : [];

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          aria-label="Previous month"
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
        >
          ←
        </button>
        <p className="text-sm font-bold text-gray-900">
          {currentMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </p>
        <button
          onClick={goToNextMonth}
          aria-label="Next month"
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400">
        {WEEKDAY_LABELS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} />;

          const key = day.toDateString();
          const dayAppointments = appointmentsByDay.get(key) ?? [];
          const isToday = key === new Date().toDateString();
          const isSelected = key === selectedDay;

          return (
            <button
              key={key}
              onClick={() => setSelectedDay(isSelected ? null : key)}
              aria-pressed={isSelected}
              aria-label={`${day.toLocaleDateString()}${dayAppointments.length ? `, ${dayAppointments.length} appointment(s)` : ""}`}
              className={`flex flex-col items-center gap-1 rounded-lg py-2 text-sm transition-colors ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : isToday
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{day.getDate()}</span>
              {dayAppointments.length > 0 && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-blue-600"}`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {selectedAppointments.length === 0
              ? "No appointments"
              : `${selectedAppointments.length} appointment${selectedAppointments.length > 1 ? "s" : ""}`}
          </p>
          {selectedAppointments.map((appointment) => (
            <button
              key={appointment._id}
              onClick={() => onSelectAppointment(appointment)}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
            >
              <span className="font-medium text-gray-900">{appointment.purpose}</span>
              <span className="text-gray-500">{appointment.appointmentTime}</span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
