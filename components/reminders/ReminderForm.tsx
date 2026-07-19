"use client";

import { useState } from "react";
import { Reminder } from "../../services/reminder.service";
import { Button } from "../Button";

const defaultDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export interface ReminderFormValues {
  title: string;
  time: string;
  days: string[];
}

interface ReminderFormProps {
  existingReminder?: Reminder | null;
  onSubmit: (values: ReminderFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
}

// Rendered with a `key` tied to the reminder being edited (see RemindersPage), so a
// fresh instance mounts per reminder instead of syncing prop changes via an effect.
export function ReminderForm({ existingReminder, onSubmit, onCancel, submitting = false }: ReminderFormProps) {
  const [title, setTitle] = useState(existingReminder?.title ?? "");
  const [time, setTime] = useState(existingReminder?.time ?? "08:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    existingReminder?.days.length ? existingReminder.days : defaultDays
  );
  const [formError, setFormError] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

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

    setFormError(null);
    onSubmit({ title: title.trim(), time, days: selectedDays });
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Take vitamin D"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Time
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
      </label>

      <div className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Days
        <div className="grid grid-cols-4 gap-2">
          {defaultDays.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                selectedDays.includes(day)
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {formError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-500/10 dark:text-red-400">
          {formError}
        </div>
      )}

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : existingReminder ? "Update Reminder" : "Save Reminder"}
        </Button>
      </div>
    </form>
  );
}
