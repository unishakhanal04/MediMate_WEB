"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentFormSchema, AppointmentFormData } from "../../schemas/appointment.schema";
import { Appointment } from "../../types/appointment.types";
import { Button } from "../Button";

interface AppointmentFormProps {
  existingAppointment?: Appointment | null;
  onSubmit: (data: AppointmentFormData) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
}

const buildDefaults = (appointment?: Appointment | null): AppointmentFormData => ({
  doctorName: appointment?.doctorName ?? "",
  specialization: appointment?.specialization ?? "",
  hospital: appointment?.hospital ?? "",
  appointmentDate: appointment ? new Date(appointment.appointmentDate).toISOString().split("T")[0] : "",
  appointmentTime: appointment?.appointmentTime ?? "",
  purpose: appointment?.purpose ?? "",
  notes: appointment?.notes ?? "",
  reminderEnabled: appointment?.reminderEnabled ?? false,
});

export function AppointmentForm({
  existingAppointment,
  onSubmit,
  onCancel,
  submitting = false,
}: AppointmentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: buildDefaults(existingAppointment),
  });

  useEffect(() => {
    reset(buildDefaults(existingAppointment));
  }, [existingAppointment, reset]);

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Purpose *</label>
        <input type="text" placeholder="e.g., Annual Checkup" className={inputClass} {...register("purpose")} />
        {errors.purpose && <p className="mt-1 text-xs text-red-600">{errors.purpose.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Doctor Name *</label>
        <input type="text" placeholder="e.g., Dr. Sharma" className={inputClass} {...register("doctorName")} />
        {errors.doctorName && <p className="mt-1 text-xs text-red-600">{errors.doctorName.message}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Specialization (Optional)</label>
          <input
            type="text"
            placeholder="e.g., Cardiology"
            className={inputClass}
            {...register("specialization")}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Hospital (Optional)</label>
          <input type="text" className={inputClass} {...register("hospital")} />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Date *</label>
          <input type="date" className={inputClass} {...register("appointmentDate")} />
          {errors.appointmentDate && (
            <p className="mt-1 text-xs text-red-600">{errors.appointmentDate.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Time *</label>
          <input type="time" className={inputClass} {...register("appointmentTime")} />
          {errors.appointmentTime && (
            <p className="mt-1 text-xs text-red-600">{errors.appointmentTime.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Notes (Optional)</label>
        <textarea rows={3} className={inputClass} {...register("notes")} />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" {...register("reminderEnabled")} />
        Enable reminder for this appointment
      </label>

      <div className="mt-2 flex gap-3">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
          {submitting ? "Saving..." : existingAppointment ? "Update Appointment" : "Schedule Appointment"}
        </Button>
      </div>
    </form>
  );
}
