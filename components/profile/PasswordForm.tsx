"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordFormSchema, PasswordFormData } from "../../schemas/profile.schema";
import { Button } from "../Button";
import { Card } from "../dashboard/Card";

interface PasswordFormProps {
  onSubmit: (data: PasswordFormData) => Promise<void> | void;
  submitting?: boolean;
}

export function PasswordForm({ onSubmit, submitting = false }: PasswordFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
  });

  const handleFormSubmit = async (data: PasswordFormData) => {
    await onSubmit(data);
    reset();
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-900 dark:text-white">Change Password</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password *</label>
          <input type="password" className={inputClass} {...register("currentPassword")} />
          {errors.currentPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">New Password *</label>
          <input type="password" className={inputClass} {...register("newPassword")} />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Confirm New Password *
          </label>
          <input type="password" className={inputClass} {...register("confirmNewPassword")} />
          {errors.confirmNewPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </Card>
  );
}
