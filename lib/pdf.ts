import jsPDF from "jspdf";
import {
  AdherenceReport,
  AppointmentsReport,
  MedicinesReport,
  PrescriptionsReport,
  ReportsInsights,
  ReportsOverview,
} from "../types/report.types";

interface UserReportData {
  overview: ReportsOverview;
  adherence: AdherenceReport;
  medicines: MedicinesReport;
  prescriptions: PrescriptionsReport;
  appointments: AppointmentsReport;
  insights: ReportsInsights | null;
}

export function downloadUserReportPdf(data: UserReportData) {
  const doc = new jsPDF();
  const marginX = 14;
  let y = 18;

  const heading = (text: string) => {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(text, marginX, y);
    y += 8;
  };

  const line = (text: string) => {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(text, marginX, y);
    y += 6;
  };

  const spacer = () => {
    y += 4;
  };

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("MediMate — Health Report", marginX, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated ${new Date().toLocaleString()}`, marginX, y);
  y += 10;

  heading("Overview");
  line(`Weekly Adherence: ${data.overview.weeklyAdherence}%`);
  line(`Current Streak: ${data.overview.currentStreak} day(s)`);
  line(`Active Medicines: ${data.overview.activeMedicines} / ${data.overview.totalMedicines} total`);
  line(`Active Prescriptions: ${data.overview.activePrescriptions} / ${data.overview.totalPrescriptions} total`);
  line(`Upcoming Appointments: ${data.overview.upcomingAppointments}`);
  spacer();

  heading("Adherence");
  line(`Doses Taken: ${data.adherence.medicinesTaken} / ${data.adherence.totalScheduled}`);
  line(`Streak: ${data.adherence.streak} day(s)`);
  spacer();

  heading("Medicines");
  line(`Total: ${data.medicines.totalMedicines} · Active: ${data.medicines.activeMedicines}`);
  line(`Inactive: ${data.medicines.inactiveMedicines} · Completed: ${data.medicines.completedMedicines}`);
  if (data.medicines.refillAlerts.length > 0) {
    line(`Refill Alerts: ${data.medicines.refillAlerts.map((a) => a.name).join(", ")}`);
  }
  spacer();

  heading("Prescriptions");
  line(`Total: ${data.prescriptions.totalPrescriptions} · Active: ${data.prescriptions.activePrescriptions}`);
  line(`Expired: ${data.prescriptions.expiredPrescriptions}`);
  spacer();

  heading("Appointments");
  line(`Total: ${data.appointments.totalAppointments} · Upcoming: ${data.appointments.upcomingAppointments}`);
  line(`Completed: ${data.appointments.completedAppointments} · Cancelled: ${data.appointments.cancelledAppointments}`);
  spacer();

  if (data.insights) {
    heading("Insights");
    const trend = data.insights.adherenceTrend;
    line(
      `Adherence Trend: ${trend.currentPercent}% (${trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : "±"}${Math.abs(
        trend.deltaPercent
      )}% vs last month)`
    );
    if (data.insights.mostMissedMedicine) {
      line(
        `Most Missed Medicine: ${data.insights.mostMissedMedicine.name} (${data.insights.mostMissedMedicine.missedCount} missed)`
      );
    }
    if (data.insights.bestAdherenceDay) {
      line(`Best Adherence Day: ${data.insights.bestAdherenceDay.day} (${data.insights.bestAdherenceDay.percentage}%)`);
    }
    line(`Medicines Completed: ${data.insights.totalMedicinesCompleted}`);
    line(`Appointment Attendance Rate: ${data.insights.appointmentAttendanceRate}%`);
  }

  doc.save(`medimate-report-${new Date().toISOString().split("T")[0]}.pdf`);
}
