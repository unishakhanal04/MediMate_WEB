"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { reportService } from "../../../services/report.service";
import {
  ReportsOverview as ReportsOverviewData,
  AdherenceReport,
  MedicinesReport,
  PrescriptionsReport,
  AppointmentsReport,
  ReportPeriod,
  InsightsResponse,
} from "../../../types/report.types";
import { downloadUserReportPdf } from "../../../lib/pdf";
import { PageHeader } from "../../../components/common/PageHeader";
import { ReportsOverview } from "../../../components/reports/ReportsOverview";
import { InsightsSection } from "../../../components/reports/InsightsSection";
import { ReportsFilters } from "../../../components/reports/ReportsFilters";
import { AdherenceChart } from "../../../components/reports/AdherenceChart";
import { MedicineChart } from "../../../components/reports/MedicineChart";
import { PrescriptionChart } from "../../../components/reports/PrescriptionChart";
import { AppointmentChart } from "../../../components/reports/AppointmentChart";
import { ReportsSkeleton } from "../../../components/reports/ReportsSkeleton";
import { ReportsEmptyState } from "../../../components/reports/ReportsEmptyState";
import { Button } from "../../../components/Button";

export default function ReportsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const [days, setDays] = useState(30);

  const [overview, setOverview] = useState<ReportsOverviewData | null>(null);
  const [adherence, setAdherence] = useState<AdherenceReport | null>(null);
  const [medicines, setMedicines] = useState<MedicinesReport | null>(null);
  const [prescriptions, setPrescriptions] = useState<PrescriptionsReport | null>(null);
  const [appointments, setAppointments] = useState<AppointmentsReport | null>(null);
  const [insightsResponse, setInsightsResponse] = useState<InsightsResponse | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const fetchAll = async () => {
    try {
      const [overviewData, adherenceData, medicinesData, prescriptionsData, appointmentsData, insightsData] =
        await Promise.all([
          reportService.getOverview(),
          reportService.getAdherence(period, period === "daily" ? 14 : 8),
          reportService.getMedicines(days),
          reportService.getPrescriptions(),
          reportService.getAppointments(),
          reportService.getInsights(),
        ]);
      setOverview(overviewData);
      setAdherence(adherenceData);
      setMedicines(medicinesData);
      setPrescriptions(prescriptionsData);
      setAppointments(appointmentsData);
      setInsightsResponse(insightsData);
    } catch (error) {
      console.error("Failed to load reports:", error);
      toast.error("Unable to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || loading) return;

    reportService
      .getAdherence(period, period === "daily" ? 14 : 8)
      .then(setAdherence)
      .catch((error) => {
        console.error("Failed to load adherence report:", error);
        toast.error("Unable to load the adherence chart.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  useEffect(() => {
    if (!isAuthenticated || loading) return;

    reportService
      .getMedicines(days)
      .then(setMedicines)
      .catch((error) => {
        console.error("Failed to load medicines report:", error);
        toast.error("Unable to load medicine progress.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  if (!isAuthenticated) {
    return null;
  }

  const hasNoData =
    overview !== null && overview.totalMedicines === 0 && overview.totalPrescriptions === 0;

  const handleExportPdf = () => {
    if (!overview || !adherence || !medicines || !prescriptions || !appointments) return;
    setExportingPdf(true);
    try {
      downloadUserReportPdf({
        overview,
        adherence,
        medicines,
        prescriptions,
        appointments,
        insights: insightsResponse?.insights ?? null,
      });
      toast.success("Report exported.");
    } catch (error) {
      console.error("Failed to export PDF report:", error);
      toast.error("Unable to export the report.");
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon="📊"
        title="Reports & Insights"
        description="Track your medication adherence, prescriptions, and appointments over time."
        action={
          !loading && overview && !hasNoData ? (
            <Button onClick={handleExportPdf} disabled={exportingPdf}>
              {exportingPdf ? "Exporting..." : "⬇️ Download PDF Report"}
            </Button>
          ) : undefined
        }
      />

      {loading || !overview || !adherence || !medicines || !prescriptions || !appointments || !insightsResponse ? (
        <ReportsSkeleton />
      ) : hasNoData ? (
        <ReportsEmptyState />
      ) : (
        <div className="flex flex-col gap-6">
          <ReportsOverview overview={overview} />

          {insightsResponse.insights && <InsightsSection insights={insightsResponse.insights} />}

          <ReportsFilters period={period} onPeriodChange={setPeriod} days={days} onDaysChange={setDays} />

          <AdherenceChart series={adherence.series} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MedicineChart report={medicines} />
            <PrescriptionChart report={prescriptions} />
          </div>

          <AppointmentChart report={appointments} />
        </div>
      )}
    </div>
  );
}
