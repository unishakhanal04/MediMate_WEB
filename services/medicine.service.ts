import { apiFetch } from "./api-client";
import { TodayMedicine, MedicineLog, AdherenceStats } from "../types/medicine.types";

const getApiUrl = (path: string) => path;

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const result: ApiResponse<T> = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Request failed");
  }
  return result.data as T;
};

const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
  return {
    "Content-Type": "application/json",
  };
};

export type { TodayMedicine, AdherenceStats };

export interface Medicine {
  _id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: "daily" | "weekly" | "as_needed";
  times: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  status: "active" | "inactive" | "completed";
  quantity?: number;
  refillThreshold?: number;
  expiryDate?: string;
  mealInstruction?: "before_food" | "after_food" | "empty_stomach";
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicineDTO {
  name: string;
  dosage: string;
  frequency: "daily" | "weekly" | "as_needed";
  times: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  quantity?: number;
  refillThreshold?: number;
  expiryDate?: string;
  mealInstruction?: "before_food" | "after_food" | "empty_stomach";
}

export interface InteractionWarning {
  otherMedicineName: string;
  otherMedicineId?: string;
  snippet: string;
}

export const medicineService = {
  async getTodayMedicines(): Promise<TodayMedicine[]> {
    return apiFetch<TodayMedicine[]>("/api/v1/medicines/today/list");
  },

  async checkInteractions(name: string, excludeMedicineId?: string): Promise<InteractionWarning[]> {
    const { warnings } = await apiFetch<{ warnings: InteractionWarning[] }>(
      "/api/v1/medicines/check-interactions",
      {
        method: "POST",
        body: JSON.stringify({ name, excludeMedicineId }),
      }
    );
    return warnings;
  },

  async markMedicineAsTaken(medicineId: string, scheduledTime: string): Promise<MedicineLog> {
    return apiFetch<MedicineLog>(`/api/v1/medicines/${medicineId}/take`, {
      method: "POST",
      body: JSON.stringify({ scheduledTime }),
    });
  },

  async markAsTaken(medicineId: string, scheduledTime: string): Promise<any> {
    const response = await fetch(getApiUrl(`/api/v1/medicines/${medicineId}/take`), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ scheduledTime }),
    });
    return parseResponse<any>(response);
  },

  async getAdherenceStats(): Promise<AdherenceStats> {
    return apiFetch<AdherenceStats>("/api/v1/medicines/stats/adherence");
  },

  async getAllMedicines(): Promise<Medicine[]> {
    const response = await fetch(getApiUrl("/api/v1/medicines"), {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return parseResponse<Medicine[]>(response);
  },

  async getMedicineById(id: string): Promise<Medicine> {
    const response = await fetch(getApiUrl(`/api/v1/medicines/${id}`), {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return parseResponse<Medicine>(response);
  },

  async createMedicine(data: CreateMedicineDTO): Promise<Medicine> {
    const response = await fetch(getApiUrl("/api/v1/medicines"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return parseResponse<Medicine>(response);
  },

  async updateMedicine(id: string, data: Partial<CreateMedicineDTO>): Promise<Medicine> {
    const response = await fetch(getApiUrl(`/api/v1/medicines/${id}`), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return parseResponse<Medicine>(response);
  },

  async deleteMedicine(id: string): Promise<void> {
    const response = await fetch(getApiUrl(`/api/v1/medicines/${id}`), {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return parseResponse<void>(response);
  },
};
