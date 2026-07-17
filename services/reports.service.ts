import { apiFetch } from "./api-client";

export type AdherenceSeriesPoint = {
  label: string;
  scheduled: number;
  taken: number;
  missed: number;
  percentage: number;
};

export type RefillAlert = {
  _id: string;
  name: string;
  dosage: string;
  quantity: number;
  refillThreshold: number;
};

export type MedicineProgress = {
  medicineId: string;
  name: string;
  adherencePercentage: number;
  dosesTaken: number;
  dosesScheduled: number;
};

export const reportsService = {
  async getAdherenceSeries(period: "daily" | "weekly", buckets: number) {
    return apiFetch<AdherenceSeriesPoint[]>(
      `/api/v1/reports/adherence-series?period=${period}&buckets=${buckets}`
    );
  },

  async getRefillAlerts() {
    return apiFetch<RefillAlert[]>("/api/v1/reports/refill-alerts");
  },

  async getMedicineProgress(days: number) {
    return apiFetch<MedicineProgress[]>(`/api/v1/reports/medicine-progress?days=${days}`);
  },
};
