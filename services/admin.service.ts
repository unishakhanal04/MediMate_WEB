import { apiFetch } from "./api-client";
import {
  AdminDashboardSummary,
  AdminReportsOverview,
  AdminUser,
  AdminUserListParams,
  AdminUserListResult,
  UserStatus,
} from "../types/admin.types";

export const adminService = {
  async getDashboardSummary(): Promise<AdminDashboardSummary> {
    return apiFetch<AdminDashboardSummary>("/api/v1/admin/dashboard-summary");
  },

  async getReportsOverview(): Promise<AdminReportsOverview> {
    return apiFetch<AdminReportsOverview>("/api/v1/admin/reports-overview");
  },

  async listUsers(params: AdminUserListParams = {}): Promise<AdminUserListResult> {
    const query = new URLSearchParams();
    query.set("page", String(params.page ?? 1));
    query.set("limit", String(params.limit ?? 10));
    if (params.search?.trim()) query.set("search", params.search.trim());

    return apiFetch<AdminUserListResult>(`/api/v1/admin/members?${query.toString()}`);
  },

  async getUserDetails(id: string): Promise<AdminUser> {
    return apiFetch<AdminUser>(`/api/v1/admin/members/${id}`);
  },

  async updateUserStatus(id: string, status: UserStatus): Promise<AdminUser> {
    return apiFetch<AdminUser>(`/api/v1/admin/members/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
