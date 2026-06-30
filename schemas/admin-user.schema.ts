import { z } from "zod";

export const adminCreateUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),
  role: z.enum(["user", "admin"], {
    message: "Please select a role",
  }),
  status: z.enum(["active", "inactive"], {
    message: "Please select a status",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const adminUpdateUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),
  role: z.enum(["user", "admin"], {
    message: "Please select a role",
  }),
  status: z.enum(["active", "inactive"], {
    message: "Please select a status",
  }),
});

export type AdminCreateUserFormData = z.infer<typeof adminCreateUserSchema>;
export type AdminUpdateUserFormData = z.infer<typeof adminUpdateUserSchema>;
