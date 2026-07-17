import Cookies from "js-cookie";

export type AdminUser = {
  id: string;
  username: string;
  email: string;
  gender: "male" | "female" | "other";
  role: "user" | "admin";
  status: "active" | "inactive";
  profileImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUserListResponse = {
  data: AdminUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateAdminUserInput = {
  username: string;
  email: string;
  gender: "male" | "female" | "other";
  role: "user" | "admin";
  status: "active" | "inactive";
  password: string;
};

export type UpdateAdminUserInput = {
  username: string;
  email: string;
  gender: "male" | "female" | "other";
  role: "user" | "admin";
  status: "active" | "inactive";
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

const getApiUrl = (path: string) => path;

const parseResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text) {
    throw new Error(`Empty response from ${response.url || "API"}`);
  }

  let result: T | ApiResponse<T>;
  try {
    result = JSON.parse(text) as T | ApiResponse<T>;
  } catch {
    throw new Error(`Invalid JSON response from ${response.url || "API"}`);
  }

  if (!response.ok) {
    if (
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
    ) {
      throw new Error(result.message);
    }

    throw new Error(`Request failed with status ${response.status}`);
  }

  if (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    typeof result.success === "boolean"
  ) {
    if (!result.success) {
      throw new Error(result.message || `Request failed with status ${response.status}`);
    }

    return result.data as T;
  }

  return result as T;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || Cookies.get("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const adminUserService = {
  async listUsers(params: { page?: number; limit?: number; search?: string } = {}) {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params.page ?? 1));
    searchParams.set("limit", String(params.limit ?? 10));

    if (params.search?.trim()) {
      searchParams.set("search", params.search.trim());
    }

    const response = await fetch(getApiUrl(`/api/admin/users?${searchParams.toString()}`), {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    return parseResponse<AdminUserListResponse>(response);
  },

  async getUser(id: string) {
    const response = await fetch(getApiUrl(`/api/admin/users/${id}`), {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    return parseResponse<AdminUser>(response);
  },

  async createUser(data: CreateAdminUserInput) {
    const response = await fetch(getApiUrl("/api/admin/users"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return parseResponse<AdminUser>(response);
  },

  async updateUser(id: string, data: UpdateAdminUserInput) {
    const response = await fetch(getApiUrl(`/api/admin/users/${id}`), {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return parseResponse<AdminUser>(response);
  },

  async deleteUser(id: string) {
    const response = await fetch(getApiUrl(`/api/admin/users/${id}`), {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return parseResponse<{ id: string }>(response);
  },
};
