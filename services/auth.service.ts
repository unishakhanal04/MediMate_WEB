import Cookies from "js-cookie";
import { RegisterFormData, LoginFormData } from "../schemas/auth.schema";
import { getAuthHeaders, parseResponse } from "./api-client";

const getApiUrl = (path: string) => path;

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  gender: string;
  profileImage?: string;
  role?: "user" | "admin";
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
};

export const authService = {
  async register(data: RegisterFormData) {
    const payload = {
      username: data.username,
      email: data.email,
      gender: data.gender,
      password: data.password,
    };

    const response = await fetch(getApiUrl("/api/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return parseResponse<AuthUser>(response);
  },

  async login(data: LoginFormData) {
    const response = await fetch(getApiUrl("/api/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await parseResponse<{ token: string; user: AuthUser }>(response);

    if (result.token) {
      localStorage.setItem("token", result.token);
      Cookies.set("token", result.token, {
        ...(data.rememberMe && { expires: 30 }),
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return result;
  },

  async whoami() {
    const response = await fetch(getApiUrl("/api/auth/whoami"), {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return parseResponse<AuthUser>(response);
  },

  async updateProfile(data: { username?: string; email?: string; gender?: string; profileImage?: string }) {
    const response = await fetch(getApiUrl("/api/auth/profile"), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return parseResponse<AuthUser>(response);
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    const response = await fetch(getApiUrl("/api/auth/update-password"), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    return parseResponse<{ message: string }>(response);
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(getApiUrl("/api/auth/upload"), {
      method: "POST",
      headers: getAuthHeaders(true),
      body: formData,
    });

    return parseResponse<{ imageUrl: string }>(response);
  },

  async requestPasswordReset(email: string) {
    const response = await fetch(getApiUrl("/api/auth/forgot-password"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return parseResponse<{ message: string }>(response);
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await fetch(getApiUrl("/api/auth/reset-password"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    return parseResponse<{ message: string }>(response);
  },

  logout() {
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken() {
    return localStorage.getItem("token") || Cookies.get("token");
  },
};
