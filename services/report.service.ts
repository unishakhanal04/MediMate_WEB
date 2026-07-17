import { apiFetch } from "./api-client";
import {
  ReportsOverview,
  AdherenceReport,
  MedicinesReport,
  PrescriptionsReport,
  AppointmentsReport,
  ReportPeriod,
} from "../types/report.types";

export const reportService = {
  async getOverview(): Promise<ReportsOverview> {
    return apiFetch<ReportsOverview>("/api/v1/reports/overview");
  },

  async getAdherence(period: ReportPeriod = "daily", buckets = 14): Promise<AdherenceReport> {
    return apiFetch<AdherenceReport>(`/api/v1/reports/adherence?period=${period}&buckets=${buckets}`);
  },

  async getMedicines(days = 30): Promise<MedicinesReport> {
    return apiFetch<MedicinesReport>(`/api/v1/reports/medicines?days=${days}`);
  },

  async getPrescriptions(): Promise<PrescriptionsReport> {
    return apiFetch<PrescriptionsReport>("/api/v1/reports/prescriptions");
  },

  async getAppointments(): Promise<AppointmentsReport> {
    return apiFetch<AppointmentsReport>("/api/v1/reports/appointments");
  },
};
