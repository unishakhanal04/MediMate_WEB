export interface UserPreferences {
  darkMode: boolean;
  emailNotifications: boolean;
  medicineReminders: boolean;
  appointmentReminders: boolean;
}

export interface ProfileData {
  id: string;
  username: string;
  email: string;
  gender: "male" | "female" | "other";
  profileImage?: string | null;
  phone?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  allergies: string[];
  chronicDiseases: string[];
  height?: number;
  weight?: number;
  preferences: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  bloodGroup?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  height?: number;
  weight?: number;
  profileImage?: string | null;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type UpdatePreferencesRequest = Partial<UserPreferences>;
