"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { appointmentService } from "../../../services/appointment.service";
import {
  Appointment,
  AppointmentStatus,
  AppointmentFilterParams,
} from "../../../types/appointment.types";
import { AppointmentFormData } from "../../../schemas/appointment.schema";
import { AppointmentList } from "../../../components/appointments/AppointmentList";
import { AppointmentEmptyState } from "../../../components/appointments/AppointmentEmptyState";
import { AppointmentSkeleton } from "../../../components/appointments/AppointmentSkeleton";
import { AppointmentFilters } from "../../../components/appointments/AppointmentFilters";
import { AppointmentForm } from "../../../components/appointments/AppointmentForm";
import { AppointmentCalendar } from "../../../components/appointments/AppointmentCalendar";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { PageHeader } from "../../../components/common/PageHeader";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";

type ViewMode = "list" | "calendar";

export default function AppointmentsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState<AppointmentFilterParams>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchAppointments();
    }
  }, [isAuthenticated, router]);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Unable to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startOfToday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const { upcoming, past } = useMemo(() => {
    const upcomingList: Appointment[] = [];
    const pastList: Appointment[] = [];
    appointments.forEach((appointment) => {
      const isUpcoming =
        appointment.status === "scheduled" && new Date(appointment.appointmentDate) >= startOfToday;
      (isUpcoming ? upcomingList : pastList).push(appointment);
    });
    return { upcoming: upcomingList, past: pastList };
  }, [appointments, startOfToday]);

  const tabAppointments = activeTab === "upcoming" ? upcoming : past;

  const filteredAppointments = useMemo(() => {
    const result = tabAppointments.filter((appointment) => {
      if (
        filters.search &&
        !appointment.purpose.toLowerCase().includes(filters.search.toLowerCase()) &&
        !appointment.doctorName.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.status && appointment.status !== filters.status) {
        return false;
      }
      return true;
    });

    const direction = filters.sortOrder === "desc" ? -1 : 1;
    return [...result].sort(
      (a, b) => direction * (new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    );
  }, [tabAppointments, filters]);

  const openAddModal = () => {
    setEditingAppointment(null);
    setShowModal(true);
  };

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
  };

  const handleSubmit = async (data: AppointmentFormData) => {
    setSubmitting(true);
    try {
      if (editingAppointment) {
        await appointmentService.updateAppointment(editingAppointment._id, data);
        toast.success("Appointment updated successfully.");
      } else {
        await appointmentService.createAppointment(data);
        toast.success("Appointment scheduled successfully.");
      }
      closeModal();
      fetchAppointments();
    } catch (error) {
      console.error("Failed to save appointment:", error);
      toast.error("Unable to save appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      await appointmentService.updateAppointment(id, { status });
      toast.success(`Appointment marked as ${status}.`);
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update appointment status:", error);
      toast.error("Unable to update appointment status.");
    }
  };

  const handleReminderToggle = async (id: string, reminderEnabled: boolean) => {
    try {
      await appointmentService.updateAppointment(id, { reminderEnabled });
      toast.success(reminderEnabled ? "Reminder enabled." : "Reminder disabled.");
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update reminder:", error);
      toast.error("Unable to update reminder. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await appointmentService.deleteAppointment(id);
      toast.success("Appointment deleted successfully.");
      fetchAppointments();
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      toast.error("Unable to delete appointment. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <PageHeader
        icon="📅"
        title="Appointments"
        description="Keep track of your upcoming and past doctor visits."
        action={<Button onClick={openAddModal}>+ Schedule Appointment</Button>}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("upcoming")}
            disabled={viewMode === "calendar"}
            className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-40 ${
              activeTab === "upcoming"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            disabled={viewMode === "calendar"}
            className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-40 ${
              activeTab === "past"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Past ({past.length})
          </button>
        </div>

        <div className="flex gap-2 rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              viewMode === "calendar" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        loading ? (
          <LoadingSpinner message="Loading appointments..." />
        ) : (
          <AppointmentCalendar appointments={appointments} onSelectAppointment={openEditModal} />
        )
      ) : loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <AppointmentSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {appointments.length > 0 && (
            <AppointmentFilters filters={filters} onFiltersChange={setFilters} />
          )}

          {appointments.length === 0 ? (
            <AppointmentEmptyState variant="no-appointments" onAddAppointment={openAddModal} />
          ) : tabAppointments.length === 0 ? (
            <AppointmentEmptyState
              variant={activeTab === "upcoming" ? "no-upcoming" : "no-past"}
              onAddAppointment={activeTab === "upcoming" ? openAddModal : undefined}
            />
          ) : filteredAppointments.length === 0 ? (
            <AppointmentEmptyState variant="no-results" />
          ) : (
            <AppointmentList
              appointments={filteredAppointments}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onReminderToggle={handleReminderToggle}
            />
          )}
        </>
      )}

      <Modal
        open={showModal}
        title={editingAppointment ? "Edit Appointment" : "Schedule Appointment"}
        onClose={closeModal}
      >
        <AppointmentForm
          existingAppointment={editingAppointment}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}
