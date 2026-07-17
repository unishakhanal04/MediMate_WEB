"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, PersonalInfoFormData } from "../../schemas/profile.schema";
import { ProfileData } from "../../types/profile.types";
import { Button } from "../Button";
import { Card } from "../dashboard/Card";

interface PersonalInfoFormProps {
  profile: ProfileData;
  onSubmit: (data: PersonalInfoFormData) => Promise<void> | void;
  submitting?: boolean;
}

const buildDefaults = (profile: ProfileData): PersonalInfoFormData => ({
  username: profile.username,
  email: profile.email,
  phone: profile.phone ?? "",
  dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
  gender: profile.gender,
});

export function PersonalInfoForm({ profile, onSubmit, submitting = false }: PersonalInfoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: buildDefaults(profile),
  });

  useEffect(() => {
    reset(buildDefaults(profile));
  }, [profile, reset]);

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500";

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-900">Personal Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Full Name *</label>
          <input type="text" className={inputClass} {...register("username")} />
          {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Email *</label>
          <input type="email" className={inputClass} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Phone Number (Optional)
            </label>
            <input type="tel" className={inputClass} {...register("phone")} />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Date of Birth (Optional)
            </label>
            <input type="date" className={inputClass} {...register("dateOfBirth")} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Gender *</label>
          <select className={inputClass} {...register("gender")}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>}
        </div>

        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? "Saving..." : "Save Personal Information"}
        </Button>
      </form>
    </Card>
  );
}
