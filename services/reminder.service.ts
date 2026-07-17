import Cookies from "js-cookie";

const getApiUrl = (path: string) => path;

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

export interface Reminder {
  _id: string;
  userId: string;
  medicationId?: string;
  title: string;
  time: string;
  days: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderDTO {
  title: string;
  time: string;
  days?: string[];
  medicationId?: string;
  enabled?: boolean;
}

export type UpdateReminderDTO = Partial<CreateReminderDTO>;

export const reminderService = {
  async getAllReminders(): Promise<Reminder[]> {
    const response = await fetch(getApiUrl("/api/reminders"), {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return parseResponse<Reminder[]>(response);
  },

  async createReminder(data: CreateReminderDTO): Promise<Reminder> {
    const response = await fetch(getApiUrl("/api/reminders"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return parseResponse<Reminder>(response);
  },

  async updateReminder(id: string, data: UpdateReminderDTO): Promise<Reminder> {
    const response = await fetch(getApiUrl(`/api/reminders/${id}`), {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return parseResponse<Reminder>(response);
  },

  async deleteReminder(id: string): Promise<void> {
    const response = await fetch(getApiUrl(`/api/reminders/${id}`), {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return parseResponse<void>(response);
  },
};
