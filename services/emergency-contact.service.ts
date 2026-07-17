import { apiFetch } from "./api-client";

export type EmergencyContact = {
  _id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type EmergencyContactDTO = {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary?: boolean;
};

export const emergencyContactService = {
  async getAll() {
    return apiFetch<EmergencyContact[]>("/api/emergency-contacts");
  },

  async create(data: EmergencyContactDTO) {
    return apiFetch<EmergencyContact>("/api/emergency-contacts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<EmergencyContactDTO>) {
    return apiFetch<EmergencyContact>(`/api/emergency-contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async remove(id: string) {
    return apiFetch<{ id: string }>(`/api/emergency-contacts/${id}`, { method: "DELETE" });
  },
};
