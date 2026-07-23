import { z } from "zod";

export const emergencyContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  relationship: z.string().min(2, "Relationship is required"),
  phone: z.string().min(6, "A valid phone number is required"),
  email: z.union([z.string().email("Invalid email address"), z.literal("")]).optional(),
  isPrimary: z.boolean().optional(),
  notes: z.string().optional(),
});

export type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>;
