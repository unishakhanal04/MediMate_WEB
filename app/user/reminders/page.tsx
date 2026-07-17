"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { reminderService, Reminder, CreateReminderDTO } from "../../../services/reminder.service";

const defaultDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RemindersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("08:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(defaultDays);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchReminders();
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

  const resetForm = () => {
    setEditingReminder(null);
    setTitle("");
    setTime("08:00");
    setSelectedDays(defaultDays);
    setFormError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setTitle(reminder.title);
    setTime(reminder.time);
    setSelectedDays(reminder.days.length ? reminder.days : defaultDays);
    setFormError(null);
    setShowModal(true);
  };

  const handleSaveReminder = async () => {
    if (!title.trim()) {
      setFormError("Please enter a reminder title.");
      return;
    }

    if (!time) {
      setFormError("Please choose a reminder time.");
      return;
    }

    if (selectedDays.length === 0) {
      setFormError("Please select at least one day for the reminder.");
      return;
    }

    try {
      const payload: CreateReminderDTO = {
        title: title.trim(),
        time,
        days: selectedDays,
      };

      if (editingReminder) {
        const updatedReminder = await reminderService.updateReminder(editingReminder._id, payload);
        setReminders((current) =>
          current.map((item) => (item._id === updatedReminder._id ? updatedReminder : item))
        );
        toast.success("Reminder updated successfully.");
      } else {
        await reminderService.createReminder(payload);
        fetchReminders();
        toast.success("Reminder created successfully.");
      }

      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Failed to save reminder:", err);
      toast.error("Unable to save reminder. Please try again.");
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (!confirm("Delete this reminder?")) {
      return;
    }

    try {
      await reminderService.deleteReminder(id);
      setReminders((current) => current.filter((reminder) => reminder._id !== id));
      toast.success("Reminder deleted successfully.");
    } catch (err) {
      console.error("Failed to delete reminder:", err);
      toast.error("Unable to delete reminder. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="reminders-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading reminders...</p>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: 1rem;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e2e8f0;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          p {
            color: #64748b;
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="reminders-page">
      <div className="page-header">
        <div>
          <h1>Reminders</h1>
          <p>Manage your medication reminders</p>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          + Add Reminder
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⏰</div>
          <h2>No reminders yet</h2>
          <p>Start by adding a reminder to your medication schedule.</p>
          <button className="add-btn" onClick={openAddModal}>
            Add Reminder
          </button>
        </div>
      ) : (
        <div className="reminders-grid">
          {reminders.map((reminder) => (
            <div key={reminder._id} className="reminder-card">
              <div className="reminder-title">
                <h3>{reminder.title}</h3>
                <div className="reminder-actions">
                  <button className="edit-btn" onClick={() => openEditModal(reminder)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteReminder(reminder._id)}>
                    Delete
                  </button>
                </div>
              </div>
              <p className="reminder-time">{reminder.time}</p>
              <div className="reminder-days">
                {reminder.days.map((day) => (
                  <span key={day} className="day-pill">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingReminder ? "Edit Reminder" : "Add Reminder"}</h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <label>
                Title
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Take vitamin D"
                />
              </label>
              <label>
                Time
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </label>
              <div className="days-grid">
                {defaultDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={selectedDays.includes(day) ? "day-btn selected" : "day-btn"}
                    onClick={() => {
                      setSelectedDays((current) =>
                        current.includes(day)
                          ? current.filter((d) => d !== day)
                          : [...current, day]
                      );
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            {formError && <div className="field-error">{formError}</div>}
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={handleSaveReminder}>
                {editingReminder ? "Update Reminder" : "Save Reminder"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .page-header p {
          font-size: 0.95rem;
          color: #64748b;
        }

        .add-btn {
          padding: 0.75rem 1.5rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-btn:hover {
          background: #1d4ed8;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          font-size: 0.9rem;
          color: #64748b;
          text-align: center;
        }

        .reminders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .reminder-card {
          background: #fff;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
          border: 1px solid #e2e8f0;
        }

        .reminder-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .reminder-actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn {
          background: transparent;
          border: 1px solid #93c5fd;
          color: #2563eb;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .edit-btn:hover {
          background: #eff6ff;
        }

        .reminder-title h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #0f172a;
        }

        .delete-btn {
          background: transparent;
          border: 1px solid #f87171;
          color: #b91c1c;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .reminder-time {
          margin: 0 0 1rem;
          color: #475569;
          font-weight: 600;
        }

        .reminder-days {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .day-pill {
          background: #e2e8f0;
          color: #334155;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .modal-content {
          width: min(100%, 560px);
          background: #fff;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #0f172a;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #475569;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .modal-body label {
          display: block;
          margin-bottom: 1rem;
          color: #334155;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .modal-body input {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.85rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-size: 0.95rem;
          color: #0f172a;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .day-btn {
          border: 1px solid #cbd5e1;
          background: #fff;
          color: #475569;
          border-radius: 9999px;
          padding: 0.65rem 0.75rem;
          cursor: pointer;
          font-weight: 600;
        }

        .day-btn.selected {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .secondary-btn,
        .primary-btn {
          border: none;
          border-radius: 10px;
          padding: 0.9rem 1.25rem;
          font-weight: 700;
          cursor: pointer;
        }

        .secondary-btn {
          background: #e2e8f0;
          color: #334155;
        }

        .primary-btn {
          background: #2563eb;
          color: #fff;
        }

        .field-error {
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
