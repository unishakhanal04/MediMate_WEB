// Data contract for GET /api/v1/dashboard, shared between backend and frontend.
// Mirrors the aggregation shape defined in medimatebackend/src/services/dashboard.service.ts.

export interface UserSummary {
  id: string;
  username: string;
  email: string;
  profileImage?: string | null;
}

export interface DashboardOverview {
  activeMedicines: number;
  prescriptions: number;
  upcomingAppointments: number;
  activeReminders: number;
}

export type RecentActivityType =
  | "medicine_taken"
  | "prescription_uploaded"
  | "appointment_booked"
  | "reminder_set";

export interface RecentActivity {
  id: string;
  type: RecentActivityType;
  title: string;
  // ISO 8601 string — dates cross the wire as JSON, not as Date instances.
  timestamp: string;
}

export interface ProfileChecklistItem {
  label: string;
  completed: boolean;
}

export interface ProfileSummary {
  percentage: number;
  checklist: ProfileChecklistItem[];
}

export interface HealthTip {
  title: string;
  tip: string;
  category: string;
}

export interface DashboardResponse {
  user: UserSummary;
  overview: DashboardOverview;
  recentActivity: RecentActivity[];
  profileCompletion: ProfileSummary;
  healthTip: HealthTip;
}
