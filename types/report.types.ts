import { AdherenceSeriesPoint, RefillAlert, MedicineProgress } from "../services/reports.service";

export interface ReportsOverview {
  totalMedicines: number;
  activeMedicines: number;
  totalPrescriptions: number;
  activePrescriptions: number;
  upcomingAppointments: number;
  weeklyAdherence: number;
  currentStreak: number;
  memberSince?: string;
}

export interface AdherenceReport {
  weeklyAdherence: number;
  medicinesTaken: number;
  totalScheduled: number;
  streak: number;
  series: AdherenceSeriesPoint[];
}

export interface MedicinesReport {
  totalMedicines: number;
  activeMedicines: number;
  inactiveMedicines: number;
  completedMedicines: number;
  refillAlerts: RefillAlert[];
  medicineProgress: MedicineProgress[];
}

export interface RecentPrescription {
  id: string;
  title: string;
  doctorName: string;
  prescriptionDate: string;
  status: "active" | "expired";
}

export interface PrescriptionsReport {
  totalPrescriptions: number;
  activePrescriptions: number;
  expiredPrescriptions: number;
  recentPrescriptions: RecentPrescription[];
}

export interface NextAppointment {
  id: string;
  doctorName: string;
  purpose: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface AppointmentsReport {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  nextAppointment: NextAppointment | null;
}

export type ReportPeriod = "daily" | "weekly";

export interface InsightsResponse {
  unlocked: boolean;
  insights: ReportsInsights | null;
}

export interface ReportsInsights {
  adherenceTrend: {
    currentPercent: number;
    previousPercent: number;
    deltaPercent: number;
    direction: "up" | "down" | "flat";
  };
  mostMissedMedicine: { name: string; missedCount: number } | null;
  bestAdherenceDay: { day: string; percentage: number } | null;
  totalMedicinesCompleted: number;
  appointmentAttendanceRate: number;
}
