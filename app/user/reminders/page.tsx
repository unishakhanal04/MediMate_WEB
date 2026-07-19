"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import {
  reminderService,
  Reminder,
  ReminderLog,
  ReminderLogStatus,
  getTodayDayAbbrev,
  getTodayDateKey,
  toDateKey,
} from "../../../services/reminder.service";
import { appointmentService } from "../../../services/appointment.service";
import { Appointment } from "../../../types/appointment.types";
import { ReminderFormValues } from "../../../components/reminders/ReminderForm";
import { TodaySchedule, ScheduleEntry } from "../../../components/reminders/TodaySchedule";
import { AppointmentSchedule } from "../../../components/reminders/AppointmentSchedule";
import { UpcomingAppointments } from "../../../components/reminders/UpcomingAppointments";
import { ReminderList } from "../../../components/reminders/ReminderList";
import { ReminderForm } from "../../../components/reminders/ReminderForm";
import { ReminderEmptyState } from "../../../components/reminders/ReminderEmptyState";
import { ReminderSkeleton } from "../../../components/reminders/ReminderSkeleton";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";

const todayLabel = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
});

export default function RemindersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"medication" | "appointments">("medication");
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchReminders();
    fetchTodayLogs();
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const data = await reminderService.getAllReminders();
      setReminders(data);
    } catch (err) {
      console.error("Failed to fetch reminders:", err);
      toast.error("Unable to load reminders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayLogs = async () => {
    try {
      const data = await reminderService.getLogsForDate(getTodayDateKey());
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch today's reminder logs:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAllAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  const openAddModal = () => {
    setEditingReminder(null);
    setShowModal(true);
  };

  const openEditModal = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReminder(null);
  };

  const handleSaveReminder = async (values: ReminderFormValues) => {
    setSubmitting(true);
    try {
      if (editingReminder) {
        const updated = await reminderService.updateReminder(editingReminder._id, values);
        setReminders((current) => current.map((item) => (item._id === updated._id ? updated : item)));
        toast.success("Reminder updated successfully.");
      } else {
        await reminderService.createReminder(values);
        await fetchReminders();
        toast.success("Reminder created successfully.");
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save reminder:", err);
      toast.error("Unable to save reminder. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (!confirm("Delete this reminder?")) return;

    try {
      await reminderService.deleteReminder(id);
      setReminders((current) => current.filter((reminder) => reminder._id !== id));
      setLogs((current) => current.filter((log) => log.reminderId !== id));
      toast.success("Reminder deleted successfully.");
    } catch (err) {
      console.error("Failed to delete reminder:", err);
      toast.error("Unable to delete reminder. Please try again.");
    }
  };

  const handleMarkStatus = async (id: string, status: ReminderLogStatus) => {
    setBusyId(id);
    try {
      const log = await reminderService.setReminderStatus(id, getTodayDateKey(), status);
      setLogs((current) => [...current.filter((item) => item.reminderId !== id), log]);
      if (status === "taken") {
        toast.success("Marked as taken.");
      }
    } catch (err) {
      console.error("Failed to update reminder status:", err);
      toast.error("Unable to update this reminder. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const todayAbbrev = getTodayDayAbbrev();
  const todayKey = getTodayDateKey();
  const scheduleEntries: ScheduleEntry[] = reminders
    .filter((reminder) => reminder.enabled && reminder.days.includes(todayAbbrev))
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((reminder) => ({
      id: reminder._id,
      title: reminder.title,
      time: reminder.time,
      status: logs.find((log) => log.reminderId === reminder._id)?.status,
    }));

  const reminderEnabledAppointments = appointments.filter(
    (appointment) => appointment.reminderEnabled && appointment.status === "scheduled"
  );

  const todaysAppointments = reminderEnabledAppointments
    .filter((appointment) => toDateKey(new Date(appointment.appointmentDate)) === todayKey)
    .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));

  const upcomingAppointments = reminderEnabledAppointments
    .filter((appointment) => toDateKey(new Date(appointment.appointmentDate)) > todayKey)
    .sort(
      (a, b) =>
        a.appointmentDate.localeCompare(b.appointmentDate) ||
        a.appointmentTime.localeCompare(b.appointmentTime)
    );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-500/10">
            ⏰
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Health Reminders
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
              Stay on track with your clinical schedule for {todayLabel}.
            </p>
          </div>
        </div>

        <Button className="self-start rounded-full px-6 py-3 sm:self-auto" onClick={openAddModal}>
          + Set New Reminder
        </Button>
      </div>

      <div className="mb-6 inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900">
        <button
          onClick={() => setActiveTab("medication")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            activeTab === "medication"
              ? "bg-white text-blue-700 shadow-sm dark:bg-gray-800 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Medication
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            activeTab === "appointments"
              ? "bg-white text-blue-700 shadow-sm dark:bg-gray-800 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Appointments
        </button>
      </div>

      {activeTab === "appointments" ? (
        <div className="flex flex-col gap-6">
          <AppointmentSchedule appointments={todaysAppointments} />
          <UpcomingAppointments appointments={upcomingAppointments} />
        </div>
      ) : loading ? (
        <ReminderSkeleton />
      ) : (
        <>
          <TodaySchedule
            entries={scheduleEntries}
            busyId={busyId}
            onMarkTaken={(id) => handleMarkStatus(id, "taken")}
            onMarkSnooze={(id) => handleMarkStatus(id, "snoozed")}
          />

          <div className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">All Reminders</h2>
            {reminders.length === 0 ? (
              <ReminderEmptyState onAddReminder={openAddModal} />
            ) : (
              <ReminderList reminders={reminders} onEdit={openEditModal} onDelete={handleDeleteReminder} />
            )}
          </div>
        </>
      )}

      <Modal open={showModal} title={editingReminder ? "Edit Reminder" : "Set New Reminder"} onClose={closeModal}>
        <ReminderForm
          key={editingReminder?._id ?? "new"}
          existingReminder={editingReminder}
          onSubmit={handleSaveReminder}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}
