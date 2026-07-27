"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "../../contexts/ToastContext";
import { adminService } from "../../services/admin.service";
import { SystemHealth } from "../../types/admin.types";
import { downloadReportsCsv } from "../../lib/csv";
import { EyeIcon, DownloadIcon, PulseIcon } from "./icons";

const dbStatusStyle: Record<SystemHealth["databaseStatus"], string> = {
  connected: "text-emerald-600 dark:text-emerald-400",
  connecting: "text-amber-600 dark:text-amber-400",
  disconnecting: "text-amber-600 dark:text-amber-400",
  disconnected: "text-red-600 dark:text-red-400",
};

const formatUptime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const pillBase =
  "flex flex-shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const pillOutline =
  "border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-800 dark:text-gray-300 dark:hover:border-blue-900 dark:hover:bg-blue-500/10";
const pillPrimary = "bg-blue-700 text-white hover:bg-blue-800";

export function QuickActions() {
  const toast = useToast();
  const [exporting, setExporting] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [health, setHealth] = useState<SystemHealth | null>(null);

  const handleExportReports = async () => {
    setExporting(true);
    try {
      const overview = await adminService.getReportsOverview();
      downloadReportsCsv(overview);
      adminService.logReportExport().catch((err) => console.error("Failed to log report export:", err));
      toast.success("Reports exported.");
    } catch (error) {
      console.error("Failed to export reports:", error);
      toast.error("Unable to export reports. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleCheckHealth = async () => {
    setCheckingHealth(true);
    try {
      const result = await adminService.getSystemHealth();
      setHealth(result);
    } catch (error) {
      console.error("Failed to check system health:", error);
      toast.error("Unable to reach the system health check.");
      setHealth(null);
    } finally {
      setCheckingHealth(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/users" className={`${pillBase} ${pillPrimary}`}>
          <EyeIcon /> View Users
        </Link>

        <button onClick={handleExportReports} disabled={exporting} className={`${pillBase} ${pillOutline}`}>
          <DownloadIcon /> {exporting ? "Exporting..." : "Export CSV"}
        </button>

        <button onClick={handleCheckHealth} disabled={checkingHealth} className={`${pillBase} ${pillOutline}`}>
          <PulseIcon /> {checkingHealth ? "Checking..." : "Health Check"}
        </button>
      </div>

      {health && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800/60">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">● API: {health.apiStatus}</span>
          <span className={`font-semibold ${dbStatusStyle[health.databaseStatus]}`}>
            ● Database: {health.databaseStatus}
          </span>
          <span className="text-gray-500 dark:text-gray-400">Uptime: {formatUptime(health.uptimeSeconds)}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Checked {new Date(health.timestamp).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}
