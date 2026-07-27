import { apiFetch } from "./api-client";
import {
  AdminDashboardSummary,
  AdminFeedbackItem,
  AdminFeedbackListParams,
  AdminFeedbackListResult,
  AdminReportsOverview,
  AdminUser,
  AdminUserActivity,
  AdminUserListParams,
  AdminUserListResult,
  FeedbackStatus,
  SystemHealth,
  UserStatus,
} from "../types/admin.types";
import { AuditLogListParams, AuditLogListResult } from "../types/audit-log.types";
import { AdminNotificationsResult } from "../types/admin-notification.types";
import { SystemSettingsSummary } from "../types/system-settings.types";

export const adminService = {
  async getDashboardSummary(): Promise<AdminDashboardSummary> {
    return apiFetch<AdminDashboardSummary>("/api/v1/admin/dashboard-summary");
  },

  async getReportsOverview(): Promise<AdminReportsOverview> {
    return apiFetch<AdminReportsOverview>("/api/v1/admin/reports-overview");
  },

  async getSystemHealth(): Promise<SystemHealth> {
    return apiFetch<SystemHealth>("/api/v1/admin/system-health");
  },

  async getSystemSettings(): Promise<SystemSettingsSummary> {
    return apiFetch<SystemSettingsSummary>("/api/v1/admin/system-settings");
  },

  async setMaintenanceMode(enabled: boolean): Promise<{ maintenanceMode: boolean }> {
    return apiFetch<{ maintenanceMode: boolean }>("/api/v1/admin/system-settings/maintenance-mode", {
      method: "PATCH",
      body: JSON.stringify({ enabled }),
    });
  },

  async getAuditLogs(params: AuditLogListParams = {}): Promise<AuditLogListResult> {
    const query = new URLSearchParams();
    query.set("page", String(params.page ?? 1));
    query.set("limit", String(params.limit ?? 20));
    if (params.action) query.set("action", params.action);
    if (params.adminId) query.set("adminId", params.adminId);

    return apiFetch<AuditLogListResult>(`/api/v1/admin/audit-logs?${query.toString()}`);
  },

  async logReportExport(): Promise<void> {
    await apiFetch("/api/v1/admin/audit-logs/report-export", { method: "POST" });
  },

  async listFeedback(params: AdminFeedbackListParams = {}): Promise<AdminFeedbackListResult> {
    const query = new URLSearchParams();
    query.set("page", String(params.page ?? 1));
    query.set("limit", String(params.limit ?? 15));
    if (params.type) query.set("type", params.type);
    if (params.status) query.set("status", params.status);

    return apiFetch<AdminFeedbackListResult>(`/api/v1/admin/feedback?${query.toString()}`);
  },

  async updateFeedbackStatus(id: string, status: FeedbackStatus): Promise<AdminFeedbackItem> {
    return apiFetch<AdminFeedbackItem>(`/api/v1/admin/feedback/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async getNotifications(): Promise<AdminNotificationsResult> {
    return apiFetch<AdminNotificationsResult>("/api/v1/admin/notifications");
  },

  async markNotificationsSeen(): Promise<{ notificationsLastSeenAt: string }> {
    return apiFetch<{ notificationsLastSeenAt: string }>("/api/v1/admin/notifications/mark-seen", {
      method: "POST",
    });
  },

  async listUsers(params: AdminUserListParams = {}): Promise<AdminUserListResult> {
    const query = new URLSearchParams();
    query.set("page", String(params.page ?? 1));
    query.set("limit", String(params.limit ?? 10));
    if (params.search?.trim()) query.set("search", params.search.trim());
    if (params.status) query.set("status", params.status);
    if (params.sort) query.set("sort", params.sort);

    return apiFetch<AdminUserListResult>(`/api/v1/admin/members?${query.toString()}`);
  },

  async getUserDetails(id: string): Promise<AdminUser> {
    return apiFetch<AdminUser>(`/api/v1/admin/members/${id}`);
  },

  async getUserActivity(id: string): Promise<AdminUserActivity> {
    return apiFetch<AdminUserActivity>(`/api/v1/admin/members/${id}/activity`);
  },

  async updateUserStatus(id: string, status: UserStatus): Promise<AdminUser> {
    return apiFetch<AdminUser>(`/api/v1/admin/members/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
