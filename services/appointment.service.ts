import { apiFetch } from "./api-client";
import {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "../types/appointment.types";

export const appointmentService = {
  async getAllAppointments(): Promise<Appointment[]> {
    return apiFetch<Appointment[]>("/api/appointments");
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    return apiFetch<Appointment>(`/api/appointments/${id}`);
  },

  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    return apiFetch<Appointment>("/api/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateAppointment(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    return apiFetch<Appointment>(`/api/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteAppointment(id: string): Promise<{ id: string }> {
    return apiFetch<{ id: string }>(`/api/appointments/${id}`, { method: "DELETE" });
  },

  async getUpcomingAppointments(): Promise<Appointment[]> {
    return apiFetch<Appointment[]>("/api/appointments/upcoming");
  },

  async getPastAppointments(): Promise<Appointment[]> {
    return apiFetch<Appointment[]>("/api/appointments/past");
  },
};
