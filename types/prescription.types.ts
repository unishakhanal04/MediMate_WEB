export interface Prescription {
  _id: string;
  userId: string;
  title: string;
  doctorName: string;
  hospital?: string;
  prescriptionDate: string;
  expiryDate?: string;
  diagnosis?: string;
  reviewDate?: string;
  medicines: string[];
  notes?: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionRequest {
  title: string;
  doctorName: string;
  hospital?: string;
  prescriptionDate: string;
  expiryDate?: string;
  diagnosis?: string;
  reviewDate?: string;
  medicines?: string[];
  notes?: string;
  attachment?: File;
}

export interface UpdatePrescriptionRequest extends Partial<Omit<CreatePrescriptionRequest, "attachment">> {
  attachment?: File;
}

// API envelope shapes — the shape apiFetch unwraps internally. Declared here for
// documentation/testing purposes and for any future call site that needs the raw envelope.
export interface PrescriptionResponse {
  success: boolean;
  message: string;
  data: Prescription;
}

export interface PrescriptionListResponse {
  success: boolean;
  message: string;
  data: Prescription[];
}

// The backend has no stored "status" field — a prescription's active/expired state is
// always derived from expiryDate. This lives here, once, so every component that needs
// to display or filter by status computes it the same way instead of duplicating the
// date comparison.
export type PrescriptionDisplayStatus = "active" | "expired";

export const getPrescriptionDisplayStatus = (
  prescription: Pick<Prescription, "expiryDate">
): PrescriptionDisplayStatus => {
  if (prescription.expiryDate && new Date(prescription.expiryDate) < new Date()) {
    return "expired";
  }
  return "active";
};

export interface PrescriptionFilterParams {
  search?: string;
  status?: PrescriptionDisplayStatus;
}

// Returned by POST /api/v1/prescriptions/extract — an AI-read best guess at the
// document's fields. Every field may be null/empty when the model wasn't confident,
// so the caller must treat this as a prefill to review, not a finished record.
export interface ExtractedPrescriptionData {
  doctorName: string | null;
  hospital: string | null;
  prescriptionDate: string | null;
  diagnosis: string | null;
  medicines: string[];
  notes: string | null;
}
