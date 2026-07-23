import { AdminReportsOverview, UserGrowthPoint } from "../types/admin.types";

const escapeCsvValue = (value: string | number): string => {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const trendSection = (title: string, points: UserGrowthPoint[]): string[] => [
  title,
  "Week,Count",
  ...points.map((point) => `${escapeCsvValue(point.label)},${point.count}`),
  "",
];

export function downloadReportsCsv(overview: AdminReportsOverview) {
  const lines: string[] = [
    "MediMate Admin Reports Export",
    `Generated,${new Date().toISOString()}`,
    "",
    "Summary",
    "Metric,Value",
    `Total Prescriptions,${overview.totalPrescriptions}`,
    `Prescriptions Expiring Soon (30d),${overview.prescriptionsExpiringSoon}`,
    `Scheduled Appointments,${overview.appointmentsByStatus.scheduled}`,
    `Completed Appointments,${overview.appointmentsByStatus.completed}`,
    `Cancelled Appointments,${overview.appointmentsByStatus.cancelled}`,
    `Active Medicines,${overview.medicinesByStatus.active}`,
    `Inactive Medicines,${overview.medicinesByStatus.inactive}`,
    `Completed Medicines,${overview.medicinesByStatus.completed}`,
    "",
    ...trendSection("User Registration Trend", overview.userGrowth),
    ...trendSection("Medicine Usage Trend", overview.medicineUsageTrend),
    ...trendSection("Appointment Trend", overview.appointmentTrend),
    ...trendSection("Prescription Upload Trend", overview.prescriptionUploadTrend),
    ...trendSection("AI Usage Trend", overview.aiUsageTrend),
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `medimate-admin-report-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
