import { apiFetch } from "./api-client";
import { NotificationsResult } from "../types/notification.types";

export const notificationService = {
  async getNotifications(): Promise<NotificationsResult> {
    return apiFetch<NotificationsResult>("/api/v1/notifications");
  },

  async markAllSeen(): Promise<{ notificationsLastSeenAt: string }> {
    return apiFetch<{ notificationsLastSeenAt: string }>("/api/v1/notifications/mark-seen", {
      method: "POST",
    });
  },
};
