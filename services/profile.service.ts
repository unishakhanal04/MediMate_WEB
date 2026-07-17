import { apiFetch } from "./api-client";
import {
  ProfileData,
  UpdateProfileRequest,
  UpdatePasswordRequest,
  UpdatePreferencesRequest,
} from "../types/profile.types";

export const profileService = {
  async getProfile(): Promise<ProfileData> {
    return apiFetch<ProfileData>("/api/v1/profile");
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ProfileData> {
    return apiFetch<ProfileData>("/api/v1/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async updatePassword(data: UpdatePasswordRequest): Promise<{ message: string }> {
    return apiFetch<{ message: string }>("/api/v1/profile/password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async updatePreferences(data: UpdatePreferencesRequest): Promise<ProfileData> {
    return apiFetch<ProfileData>("/api/v1/profile/preferences", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
