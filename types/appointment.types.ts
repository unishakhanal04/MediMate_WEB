export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  _id: string;
  userId: string;
  doctorName: string;
  specialization?: string;
  hospital?: string;
  appointmentDate: string;
  appointmentTime: string;
  purpose: string;
  notes?: string;
  status: AppointmentStatus;
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  doctorName: string;
  specialization?: string;
  hospital?: string;
  appointmentDate: string;
  appointmentTime: string;
  purpose: string;
  notes?: string;
  reminderEnabled?: boolean;
}

export interface UpdateAppointmentRequest extends Partial<CreateAppointmentRequest> {
  status?: AppointmentStatus;
}

// API envelope shapes — the shape apiFetch unwraps internally. Declared here for
// documentation/testing purposes and for any future call site that needs the raw envelope.
export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: Appointment;
}

export interface AppointmentListResponse {
  success: boolean;
  message: string;
  data: Appointment[];
}

export type AppointmentSortOrder = "asc" | "desc";

export interface AppointmentFilterParams {
  search?: string;
  status?: AppointmentStatus;
  sortOrder?: AppointmentSortOrder;
}
