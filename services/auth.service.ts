import Cookies from "js-cookie";
import { API_BASE_URL } from "../lib/constants";
import { RegisterFormData, LoginFormData } from "../schemas/auth.schema";

const getApiUrl = (path: string) => `${API_BASE_URL}${path}`;

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const result: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result.data as T;
};

export const authService = {
  async register(data: RegisterFormData) {
    const { confirmPassword: _confirmPassword, ...payload } = data;

    const response = await fetch(getApiUrl("/api/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await parseResponse<{ token: string; user: { email: string } }>(response);

    if (result.token) {
      Cookies.set("token", result.token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return result;
  },

  async login(data: LoginFormData) {
    const response = await fetch(getApiUrl("/api/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await parseResponse<{ token: string; user: { email: string } }>(response);

    if (result.token) {
      Cookies.set("token", result.token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return result;
  },

  logout() {
    Cookies.remove("token");
  },

  getToken() {
    return Cookies.get("token");
  },
};
