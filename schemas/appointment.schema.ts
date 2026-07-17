import { z } from "zod";

export const appointmentFormSchema = z.object({
  doctorName: z.string().min(1, "Doctor name is required"),
  specialization: z.string().optional(),
  hospital: z.string().optional(),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  appointmentTime: z.string().min(1, "Appointment time is required"),
  purpose: z.string().min(1, "Purpose is required"),
  notes: z.string().optional(),
  reminderEnabled: z.boolean().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
