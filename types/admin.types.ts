export type UserGender = "male" | "female" | "other";
export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  gender: UserGender;
  profileImage?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserListResult {
  data: AdminUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminDashboardSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  newUsersThisWeek: number;
  totalMedicines: number;
  activeMedicines: number;
  totalPrescriptions: number;
  totalAppointments: number;
  upcomingAppointments: number;
  totalAiConversations: number;
}

export interface UserGrowthPoint {
  label: string;
  count: number;
}

export interface AdminReportsOverview {
  userGrowth: UserGrowthPoint[];
  appointmentsByStatus: {
    scheduled: number;
    completed: number;
    cancelled: number;
  };
  medicinesByStatus: {
    active: number;
    inactive: number;
    completed: number;
  };
  totalPrescriptions: number;
  prescriptionsExpiringSoon: number;
}
