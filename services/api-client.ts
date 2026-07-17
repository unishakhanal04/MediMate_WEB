import Cookies from "js-cookie";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

export const getAuthHeaders = (isFormData = false): Record<string, string> => {
  const token = localStorage.getItem("token") || Cookies.get("token");
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const parseResponse = async <T>(response: Response): Promise<T> => {
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

export const apiFetch = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const isFormData = init.body instanceof FormData;
  const response = await fetch(path, {
    ...init,
    headers: {
      ...getAuthHeaders(isFormData),
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  return parseResponse<T>(response);
};
