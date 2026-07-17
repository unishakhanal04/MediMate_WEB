"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { prescriptionFormSchema, PrescriptionFormData } from "../../schemas/prescription.schema";
import { Prescription } from "../../types/prescription.types";
import { Button } from "../Button";

interface PrescriptionFormProps {
  existingPrescription?: Prescription | null;
  onSubmit: (data: PrescriptionFormData) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
}

const buildDefaults = (prescription?: Prescription | null): PrescriptionFormData => ({
  title: prescription?.title ?? "",
  doctorName: prescription?.doctorName ?? "",
  hospital: prescription?.hospital ?? "",
  prescriptionDate: prescription
    ? new Date(prescription.prescriptionDate).toISOString().split("T")[0]
    : "",
  expiryDate: prescription?.expiryDate
    ? new Date(prescription.expiryDate).toISOString().split("T")[0]
    : "",
  notes: prescription?.notes ?? "",
  medicines: prescription?.medicines.length
    ? prescription.medicines.map((value) => ({ value }))
    : [{ value: "" }],
});

export function PrescriptionForm({
  existingPrescription,
  onSubmit,
  onCancel,
  submitting = false,
}: PrescriptionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: buildDefaults(existingPrescription),
  });

  useEffect(() => {
    reset(buildDefaults(existingPrescription));
  }, [existingPrescription, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "medicines" });

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Title *</label>
        <input type="text" placeholder="e.g., Flu treatment" className={inputClass} {...register("title")} />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Doctor Name *</label>
        <input type="text" placeholder="e.g., Dr. Sharma" className={inputClass} {...register("doctorName")} />
        {errors.doctorName && <p className="mt-1 text-xs text-red-600">{errors.doctorName.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Hospital (Optional)</label>
        <input type="text" className={inputClass} {...register("hospital")} />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Prescription Date *</label>
          <input type="date" className={inputClass} {...register("prescriptionDate")} />
          {errors.prescriptionDate && (
            <p className="mt-1 text-xs text-red-600">{errors.prescriptionDate.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Expiry Date (Optional)</label>
          <input type="date" className={inputClass} {...register("expiryDate")} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Medicines</label>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Medicine name"
                className={`min-w-0 flex-1 ${inputClass}`}
                {...register(`medicines.${index}.value`)}
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="Remove medicine"
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => append({ value: "" })}
          className="mt-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          + Add Medicine
        </button>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Notes (Optional)</label>
        <textarea rows={3} className={inputClass} {...register("notes")} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Attachment {existingPrescription ? "(leave blank to keep current file)" : "(Optional)"}
        </label>
        <input type="file" accept="image/*,.pdf" className="w-full text-sm" {...register("attachment")} />
      </div>

      <div className="mt-2 flex gap-3">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
          {submitting ? "Saving..." : existingPrescription ? "Update Prescription" : "Save Prescription"}
        </Button>
      </div>
    </form>
  );
}
