import Cookies from "js-cookie";
import { RegisterFormData, LoginFormData } from "../schemas/auth.schema";

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

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text) {
    throw new Error(`Empty response from ${response.url || "API"}`);
  }

  let result: ApiResponse<T>;
  try {
    result = JSON.parse(text) as ApiResponse<T>;
  } catch {
    throw new Error(`Invalid JSON response from ${response.url || "API"}`);
  }

  if (!response.ok) {
    throw new Error(result.message || `Request failed with status ${response.status}`);
  }

  if (!result.success) {
    throw new Error(result.message || "Request was not successful");
  }

  return result.data as T;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || Cookies.get("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
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
        expires: 7,
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

    const token = localStorage.getItem("token") || Cookies.get("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(getApiUrl("/api/auth/upload"), {
      method: "POST",
      headers,
      body: formData,
    });

    return parseResponse<{ imageUrl: string }>(response);
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
