"use client";

import { useEffect, useState } from "react";
import { UserPreferences } from "../../types/profile.types";
import { Button } from "../Button";
import { Card } from "../dashboard/Card";

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSubmit: (data: UserPreferences) => Promise<void> | void;
  submitting?: boolean;
}

const toggleConfig: { key: keyof UserPreferences; label: string; description: string }[] = [
  { key: "darkMode", label: "Dark Mode", description: "Use a dark color theme across the app." },
  {
    key: "emailNotifications",
    label: "Email Notifications",
    description: "Receive account and health updates by email.",
  },
  {
    key: "medicineReminders",
    label: "Medicine Reminders",
    description: "Get notified when it's time to take a medicine.",
  },
  {
    key: "appointmentReminders",
    label: "Appointment Reminders",
    description: "Get notified before an upcoming appointment.",
  },
];

export function PreferencesForm({ preferences, onSubmit, submitting = false }: PreferencesFormProps) {
  const [values, setValues] = useState(preferences);

  useEffect(() => {
    setValues(preferences);
  }, [preferences]);

  const toggle = (key: keyof UserPreferences) => {
    setValues((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-900">Preferences</h2>

      <div className="flex flex-col divide-y divide-gray-100">
        {toggleConfig.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={values[key]}
              aria-label={label}
              onClick={() => toggle(key)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                values[key] ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  values[key] ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <Button onClick={() => onSubmit(values)} disabled={submitting} className="self-start">
        {submitting ? "Saving..." : "Save Preferences"}
      </Button>
    </Card>
  );
}
