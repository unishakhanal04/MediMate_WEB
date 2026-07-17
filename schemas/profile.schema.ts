import { z } from "zod";

export const personalInfoSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"], { message: "Please select a gender" }),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export const medicalInfoSchema = z.object({
  bloodGroup: z.string().optional(),
  // Comma-separated in the form, split into string[] on submit before calling profileService.
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
});

export type MedicalInfoFormData = z.infer<typeof medicalInfoSchema>;

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type PasswordFormData = z.infer<typeof passwordFormSchema>;
