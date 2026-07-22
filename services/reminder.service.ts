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

export type ReminderLogStatus = "taken" | "snoozed" | "skipped";

export interface ReminderLog {
  _id: string;
  userId: string;
  reminderId: string;
  date: string;
  status: ReminderLogStatus;
}

const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Local-time day/date keys, kept in sync with the "Mon".."Sun" values stored on
// a reminder's `days` array and the YYYY-MM-DD keys used by reminder logs.
export const getTodayDayAbbrev = (): string => dayAbbreviations[new Date().getDay()];

export const getDayAbbrev = (date: Date): string => dayAbbreviations[date.getDay()];

export const toDateKey = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export const getTodayDateKey = (): string => toDateKey(new Date());

export const formatReminderTime = (time: string): string => {
  const [hoursStr, minutes] = time.split(":");
  const hours = parseInt(hoursStr, 10);
  if (Number.isNaN(hours)) return time;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${period}`;
};

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

  async getLogsForDate(date: string): Promise<ReminderLog[]> {
    const response = await fetch(getApiUrl(`/api/reminders/logs?date=${date}`), {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return parseResponse<ReminderLog[]>(response);
  },

  async getLogsHistory(days: number = 7): Promise<ReminderLog[]> {
    const response = await fetch(getApiUrl(`/api/reminders/logs/range?days=${days}`), {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return parseResponse<ReminderLog[]>(response);
  },

  async setReminderStatus(id: string, date: string, status: ReminderLogStatus): Promise<ReminderLog> {
    const response = await fetch(getApiUrl(`/api/reminders/${id}/status`), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ date, status }),
    });
    return parseResponse<ReminderLog>(response);
  },
};
