import { apiFetch } from "./api-client";

export const systemService = {
  async getMaintenanceStatus(): Promise<{ maintenanceMode: boolean }> {
    return apiFetch<{ maintenanceMode: boolean }>("/api/v1/system/maintenance-status");
  },
};
