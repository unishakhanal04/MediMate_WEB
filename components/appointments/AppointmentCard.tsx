"use client";

import { useEffect, useRef, useState } from "react";
import { StatusBadge } from "../common/StatusBadge";
import { Appointment, AppointmentStatus } from "../../types/appointment.types";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onReminderToggle: (id: string, reminderEnabled: boolean) => void;
}

const specialtyIcon = (specialization?: string): { icon: string; bg: string } => {
  const s = (specialization ?? "").toLowerCase();
  if (s.includes("dental") || s.includes("dentist"))
    return { icon: "🦷", bg: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" };
  if (s.includes("eye") || s.includes("ophthal"))
    return { icon: "👁️", bg: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" };
  if (s.includes("heart") || s.includes("cardio"))
    return { icon: "❤️", bg: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" };
  if (s.includes("skin") || s.includes("derm"))
    return { icon: "🌿", bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" };
  if (s.includes("neuro") || s.includes("brain"))
    return { icon: "🧠", bg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" };
  if (s.includes("child") || s.includes("pediatr"))
    return { icon: "🧒", bg: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" };
  return { icon: "🩺", bg: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" };
};

export function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
  onStatusChange,
  onReminderToggle,
}: AppointmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const { icon, bg } = specialtyIcon(appointment.specialization);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
      <span
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-lg ${bg}`}
        aria-hidden="true"
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{appointment.purpose}</p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
          {appointment.doctorName}
          {appointment.specialization ? ` · ${appointment.specialization}` : ""}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true">📅</span>
            {new Date(appointment.appointmentDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true">🕒</span>
            {appointment.appointmentTime}
          </span>
          {appointment.reminderEnabled && (
            <span className="inline-flex items-center gap-1" title="Reminder on">
              <span aria-hidden="true">🔔</span>
            </span>
          )}
        </div>
      </div>

      <StatusBadge status={appointment.status} className="hidden shrink-0 sm:inline-flex" />

      <button
        type="button"
        onClick={() => onEdit(appointment)}
        aria-label="Edit appointment"
        title="Edit appointment"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      >
        ✏️
      </button>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Appointment actions"
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          ⋮
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onEdit(appointment);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Edit / Reschedule
            </button>
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onReminderToggle(appointment._id, !appointment.reminderEnabled);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {appointment.reminderEnabled ? "Turn Off Reminder" : "Turn On Reminder"}
            </button>
            {appointment.status === "scheduled" && (
              <>
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onStatusChange(appointment._id, "completed");
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                >
                  Mark Completed
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onStatusChange(appointment._id, "cancelled");
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10"
                >
                  Cancel Visit
                </button>
              </>
            )}
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onDelete(appointment._id);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
