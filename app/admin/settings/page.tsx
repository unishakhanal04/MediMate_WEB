"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "../../../contexts/ToastContext";
import { adminService } from "../../../services/admin.service";
import { SystemSettingsSummary } from "../../../types/system-settings.types";
import { AdminNotificationItem } from "../../../types/admin-notification.types";
import { Card } from "../../../components/dashboard/Card";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";

const statusDot: Record<string, string> = {
  connected: "bg-emerald-500",
  configured: "bg-emerald-500",
  connecting: "bg-amber-500",
  disconnecting: "bg-amber-500",
  error: "bg-red-500",
  not_configured: "bg-gray-400",
  disconnected: "bg-red-500",
};

const statusLabel: Record<string, string> = {
  connected: "Connected",
  configured: "Configured",
  connecting: "Connecting",
  disconnecting: "Disconnecting",
  error: "Error",
  not_configured: "Not Configured",
  disconnected: "Disconnected",
};

function StatusCard({ icon, title, status, detail }: { icon: string; title: string; status: string; detail?: string }) {
  return (
    <Card className="flex items-start gap-4">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl dark:bg-gray-800" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusDot[status] ?? "bg-gray-400"}`} aria-hidden="true" />
          <span className="text-base font-bold text-gray-900 dark:text-white">{statusLabel[status] ?? status}</span>
        </div>
        {detail && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{detail}</p>}
      </div>
    </Card>
  );
}

const formatUptime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const eventLabel: Record<string, string> = {
  gemini_api_failed: "GEMINI_API",
  system_error: "SERVER",
};

const timeAgo = (dateStr: string): string => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function AdminSettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState<SystemSettingsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [retesting, setRetesting] = useState(false);
  const [errorEvents, setErrorEvents] = useState<AdminNotificationItem[]>([]);

  const fetchSettings = async () => {
    try {
      const data = await adminService.getSystemSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load system settings:", error);
      toast.error("Unable to load system settings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchErrorEvents = () => {
    adminService
      .getNotifications()
      .then((data) =>
        setErrorEvents(data.items.filter((item) => item.type === "gemini_api_failed" || item.type === "system_error").slice(0, 6))
      )
      .catch((err) => console.error("Failed to load recent system errors:", err));
  };

  useEffect(() => {
    fetchSettings();
    fetchErrorEvents();

    // Real 30s refresh of the error feed below — no live push, just a client poll.
    const interval = window.setInterval(fetchErrorEvents, 30000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReTestSmtp = async () => {
    setRetesting(true);
    try {
      await fetchSettings();
      toast.success("SMTP connection re-tested.");
    } finally {
      setRetesting(false);
    }
  };

  const handleToggleMaintenance = async () => {
    if (!settings) return;
    setConfirmOpen(false);
    setToggling(true);
    try {
      const result = await adminService.setMaintenanceMode(!settings.maintenanceMode);
      setSettings((prev) => (prev ? { ...prev, maintenanceMode: result.maintenanceMode } : prev));
      toast.success(result.maintenanceMode ? "Maintenance mode enabled." : "Maintenance mode disabled.");
    } catch (error) {
      console.error("Failed to update maintenance mode:", error);
      toast.error("Unable to update maintenance mode.");
    } finally {
      setToggling(false);
    }
  };

  if (loading || !settings) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          System Configuration
        </h1>
        <div className="mt-6">
          <AdminSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          System Configuration
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor and manage the health of your core application infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
                <span aria-hidden="true">🛠️</span> Maintenance Mode
              </h2>
              <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                While enabled, non-admin requests are blocked with a 503 response. Use this only during critical
                updates. <span className="font-semibold text-gray-700 dark:text-gray-300">Caution:</span> regular
                users will be unable to use the app until you turn this back off.
              </p>
            </div>
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={toggling}
              className={`relative h-8 w-14 flex-shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                settings.maintenanceMode ? "bg-red-500" : "bg-gray-300 dark:bg-gray-700"
              }`}
              role="switch"
              aria-checked={settings.maintenanceMode}
              aria-label="Toggle maintenance mode"
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  settings.maintenanceMode ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {settings.maintenanceMode && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              ⚠️ Maintenance mode is currently ON — regular users cannot access the app.
            </div>
          )}
        </Card>

        <Card className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Application Version</p>
          <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">v{settings.appVersion}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Uptime: {formatUptime(settings.uptimeSeconds)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col gap-3 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
              <span aria-hidden="true">📧</span> SMTP Connection
            </h2>
            <button
              onClick={handleReTestSmtp}
              disabled={retesting}
              className="text-sm font-semibold text-blue-700 hover:underline disabled:opacity-50 dark:text-blue-400"
            >
              {retesting ? "Testing..." : "Re-test Connection"}
            </button>
          </div>

          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Host</span>
              <span className="font-mono text-gray-900 dark:text-white">
                {settings.smtpHost ? `${settings.smtpHost}:${settings.smtpPort}` : "Not configured"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Encryption</span>
              <span className="text-gray-900 dark:text-white">
                {settings.smtpHost ? (settings.smtpSecure ? "TLS" : "Unencrypted / STARTTLS") : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                  settings.smtpStatus === "connected"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : settings.smtpStatus === "error"
                    ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {statusLabel[settings.smtpStatus]}
              </span>
            </div>
            {settings.smtpStatus === "error" && settings.smtpError && (
              <p className="pt-2 text-xs text-red-600 dark:text-red-400">{settings.smtpError}</p>
            )}
          </div>
        </Card>

        <StatusCard icon="🗄️" title="Database Health" status={settings.databaseStatus} />

        <StatusCard
          icon="✨"
          title="Gemini API Status"
          status={settings.geminiStatus}
          detail={
            settings.recentGeminiFailures > 0
              ? `${settings.recentGeminiFailures} failure${settings.recentGeminiFailures === 1 ? "" : "s"} in the last 24h`
              : "No failures in the last 24h"
          }
        />
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent System Errors</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">Refreshing every 30s</span>
        </div>

        {errorEvents.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No recent errors — everything's healthy.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            {errorEvents.map((event) => (
              <li key={event.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
                <span className="w-24 flex-shrink-0 font-mono text-xs text-gray-400 dark:text-gray-500">{timeAgo(event.date)}</span>
                <span className="w-28 flex-shrink-0 rounded bg-gray-100 px-2 py-0.5 text-center font-mono text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {eventLabel[event.type] ?? event.type}
                </span>
                <span className="min-w-0 flex-1 truncate text-gray-700 dark:text-gray-300">{event.message}</span>
              </li>
            ))}
          </ul>
        )}

        <Link href="/admin/notifications" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400">
          View All Notifications →
        </Link>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title={settings.maintenanceMode ? "Disable maintenance mode?" : "Enable maintenance mode?"}
        message={
          settings.maintenanceMode
            ? "This will restore normal access for all users."
            : "This will immediately block all non-admin users from using the app until you turn it back off."
        }
        confirmLabel={settings.maintenanceMode ? "Disable" : "Enable"}
        destructive={!settings.maintenanceMode}
        onConfirm={handleToggleMaintenance}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
