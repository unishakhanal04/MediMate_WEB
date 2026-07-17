"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicalInfoSchema, MedicalInfoFormData } from "../../schemas/profile.schema";
import { ProfileData } from "../../types/profile.types";
import { Button } from "../Button";
import { Card } from "../dashboard/Card";

interface MedicalInfoFormProps {
  profile: ProfileData;
  onSubmit: (data: MedicalInfoFormData) => Promise<void> | void;
  submitting?: boolean;
}

const buildDefaults = (profile: ProfileData): MedicalInfoFormData => ({
  bloodGroup: profile.bloodGroup ?? "",
  allergies: profile.allergies.join(", "),
  chronicDiseases: profile.chronicDiseases.join(", "),
  height: profile.height?.toString() ?? "",
  weight: profile.weight?.toString() ?? "",
});

export function MedicalInfoForm({ profile, onSubmit, submitting = false }: MedicalInfoFormProps) {
  const { register, handleSubmit, reset } = useForm<MedicalInfoFormData>({
    resolver: zodResolver(medicalInfoSchema),
    defaultValues: buildDefaults(profile),
  });

  useEffect(() => {
    reset(buildDefaults(profile));
  }, [profile, reset]);

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500";

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-900">Medical Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Blood Group (Optional)
            </label>
            <input type="text" placeholder="e.g., O+" className={inputClass} {...register("bloodGroup")} />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Height in cm (Optional)
            </label>
            <input type="number" min="0" className={inputClass} {...register("height")} />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Weight in kg (Optional)
            </label>
            <input type="number" min="0" className={inputClass} {...register("weight")} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Allergies (Optional)</label>
          <input
            type="text"
            placeholder="Comma-separated, e.g., Penicillin, Peanuts"
            className={inputClass}
            {...register("allergies")}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Chronic Diseases (Optional)
          </label>
          <input
            type="text"
            placeholder="Comma-separated, e.g., Diabetes, Hypertension"
            className={inputClass}
            {...register("chronicDiseases")}
          />
        </div>

        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? "Saving..." : "Save Medical Information"}
        </Button>
      </form>
    </Card>
  );
}
