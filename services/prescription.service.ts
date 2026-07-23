import { apiFetch } from "./api-client";
import {
  Prescription,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest,
  ExtractedPrescriptionData,
} from "../types/prescription.types";

const buildFormData = (data: CreatePrescriptionRequest | UpdatePrescriptionRequest): FormData => {
  const formData = new FormData();
  if (data.title !== undefined) formData.append("title", data.title);
  if (data.doctorName !== undefined) formData.append("doctorName", data.doctorName);
  if (data.hospital !== undefined) formData.append("hospital", data.hospital);
  if (data.prescriptionDate !== undefined) formData.append("prescriptionDate", data.prescriptionDate);
  if (data.expiryDate !== undefined) formData.append("expiryDate", data.expiryDate);
  if (data.diagnosis !== undefined) formData.append("diagnosis", data.diagnosis);
  if (data.reviewDate !== undefined) formData.append("reviewDate", data.reviewDate);
  if (data.notes !== undefined) formData.append("notes", data.notes);
  if (data.medicines !== undefined) formData.append("medicines", JSON.stringify(data.medicines));
  if (data.attachment) formData.append("attachment", data.attachment);
  return formData;
};

export const prescriptionService = {
  async getAllPrescriptions(): Promise<Prescription[]> {
    return apiFetch<Prescription[]>("/api/v1/prescriptions");
  },

  async getPrescriptionById(id: string): Promise<Prescription> {
    return apiFetch<Prescription>(`/api/v1/prescriptions/${id}`);
  },

  async createPrescription(data: CreatePrescriptionRequest): Promise<Prescription> {
    return apiFetch<Prescription>("/api/v1/prescriptions", {
      method: "POST",
      body: buildFormData(data),
    });
  },

  async updatePrescription(id: string, data: UpdatePrescriptionRequest): Promise<Prescription> {
    return apiFetch<Prescription>(`/api/v1/prescriptions/${id}`, {
      method: "PUT",
      body: buildFormData(data),
    });
  },

  async deletePrescription(id: string): Promise<{ id: string }> {
    return apiFetch<{ id: string }>(`/api/v1/prescriptions/${id}`, { method: "DELETE" });
  },

  async extractPrescriptionData(file: File): Promise<ExtractedPrescriptionData> {
    const formData = new FormData();
    formData.append("attachment", file);
    return apiFetch<ExtractedPrescriptionData>("/api/v1/prescriptions/extract", {
      method: "POST",
      body: formData,
    });
  },

  async getActivePrescriptions(): Promise<Prescription[]> {
    return apiFetch<Prescription[]>("/api/v1/prescriptions/active");
  },

  async getExpiredPrescriptions(): Promise<Prescription[]> {
    return apiFetch<Prescription[]>("/api/v1/prescriptions/expired");
  },
};
