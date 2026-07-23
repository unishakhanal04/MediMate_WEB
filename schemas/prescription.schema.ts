import { z } from "zod";

export const prescriptionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  doctorName: z.string().min(1, "Doctor name is required"),
  hospital: z.string().optional(),
  prescriptionDate: z.string().min(1, "Prescription date is required"),
  expiryDate: z.string().optional(),
  diagnosis: z.string().optional(),
  reviewDate: z.string().optional(),
  notes: z.string().optional(),
  // useFieldArray needs an object per row for stable field ids — flattened to
  // string[] on submit before it's sent to prescriptionService.createPrescription.
  medicines: z.array(z.object({ value: z.string().min(1, "Medicine name is required") })).optional(),
  attachment: z
    .custom<FileList>((val) => val === undefined || val instanceof FileList)
    .optional(),
});

export type PrescriptionFormData = z.infer<typeof prescriptionFormSchema>;
