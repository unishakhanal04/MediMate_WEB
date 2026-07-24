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
  lastLoginAt?: string;
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
  status?: UserStatus;
  sort?: "recent" | "mostActive";
}

export interface AdminUserActivity {
  user: {
    id: string;
    username: string;
    email: string;
    gender: UserGender;
    role: UserRole;
    status: UserStatus;
    profileImage?: string | null;
    createdAt?: string;
    lastLoginAt?: string;
  };
  profile: {
    phone?: string;
    dateOfBirth?: string;
    bloodGroup?: string;
    height?: number;
    weight?: number;
    allergies: string[];
    chronicDiseases: string[];
  };
  medicines: {
    total: number;
    active: number;
    recent: { id: string; name: string; dosage: string; status: string }[];
  };
  appointments: {
    total: number;
    upcoming: number;
    recent: { id: string; doctorName: string; purpose: string; appointmentDate: string; status: string }[];
  };
  prescriptions: {
    total: number;
    active: number;
    recent: { id: string; title: string; doctorName: string; prescriptionDate: string }[];
  };
  emergencyContacts: {
    total: number;
    contacts: { id: string; name: string; relationship: string; phone: string; isPrimary: boolean }[];
  };
  timeline: {
    items: { id: string; type: string; title: string; description?: string; date: string }[];
  };
  reports: {
    weeklyAdherence: number;
    streak: number;
    medicinesTaken: number;
    totalScheduled: number;
  };
  aiUsage: {
    totalConversations: number;
  };
  subscription: {
    plan: "free" | "premium";
    status: "active" | "expired" | "cancelled" | null;
    expiresAt: string | null;
    priceNpr: number;
  };
}

export interface AdminDashboardSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  newUsersThisWeek: number;
  activeUsersToday: number;
  totalMedicines: number;
  activeMedicines: number;
  medicinesAddedThisWeek: number;
  totalPrescriptions: number;
  prescriptionsUploadedThisWeek: number;
  totalAppointments: number;
  upcomingAppointments: number;
  appointmentsCreatedThisWeek: number;
  totalAiConversations: number;
  averageAdherence: number;
  newUsersThisWeekDeltaPercent: number | null;
  medicinesAddedThisWeekDeltaPercent: number | null;
  appointmentsCreatedThisWeekDeltaPercent: number | null;
  prescriptionsUploadedThisWeekDeltaPercent: number | null;
}

export interface UserGrowthPoint {
  label: string;
  count: number;
}

export type AdminSubscriptionEffectiveStatus = "active" | "expired" | "cancelled";

export interface AdminSubscriptionStats {
  totalSubscriptions: number;
  premiumUsers: number;
  expiredPlans: number;
  renewals: number;
  failedPayments: number;
  totalRevenue: number;
  revenueThisMonth: number;
}

export interface AdminSubscriptionItem {
  id: string;
  userId: string;
  username: string | null;
  email: string | null;
  plan: string;
  status: AdminSubscriptionEffectiveStatus;
  startDate: string;
  expiresAt: string;
}

export interface AdminSubscriptionListResult {
  data: AdminSubscriptionItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminSubscriptionListParams {
  page?: number;
  limit?: number;
  status?: AdminSubscriptionEffectiveStatus;
}

export type FeedbackType = "bug_report" | "suggestion" | "feature_request" | "general";
export type FeedbackStatus = "new" | "reviewed" | "resolved";

export interface AdminFeedbackItem {
  id: string;
  userId: string;
  username: string | null;
  email: string | null;
  type: FeedbackType;
  subject: string;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
}

export interface AdminFeedbackListResult {
  data: AdminFeedbackItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminFeedbackListParams {
  page?: number;
  limit?: number;
  type?: FeedbackType;
  status?: FeedbackStatus;
}

export interface AdminPaymentItem {
  id: string;
  transactionUuid: string;
  userId: string;
  username: string | null;
  email: string | null;
  amount: number;
  gateway: string;
  status: string;
  esewaRefId?: string;
  createdAt: string;
}

export interface AdminPaymentListResult {
  data: AdminPaymentItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminPaymentListParams {
  page?: number;
  limit?: number;
  status?: "pending" | "success" | "failed";
}

export interface SystemHealth {
  apiStatus: "ok";
  databaseStatus: "connected" | "disconnected" | "connecting" | "disconnecting";
  uptimeSeconds: number;
  timestamp: string;
}

export interface AdminReportsKpis {
  todaysRegistrations: number;
  weeklyActiveUsers: number;
  monthlyAiRequests: number;
  medicineCompletionRate: number;
  averageSessionTime: null;
}

export interface AdminReportsOverview {
  kpis: AdminReportsKpis;
  userGrowth: UserGrowthPoint[];
  medicineUsageTrend: UserGrowthPoint[];
  appointmentTrend: UserGrowthPoint[];
  prescriptionUploadTrend: UserGrowthPoint[];
  aiUsageTrend: UserGrowthPoint[];
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
