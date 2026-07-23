import { useEffect, useState } from "react";
import { medicineService, Medicine, InteractionWarning } from "../../services/medicine.service";

export function AddMedicineForm({
  existingMedicine,
  onToast,
  onSuccess,
  onCancel,
}: {
  existingMedicine?: Medicine | null;
  onToast: (type: "success" | "error", message: string) => void;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: existingMedicine?.name ?? "",
    dosage: existingMedicine?.dosage ?? "",
    frequency: existingMedicine?.frequency ?? "daily" as "daily" | "weekly" | "as_needed",
    times: existingMedicine?.times ?? ["08:00"],
    startDate: existingMedicine
      ? new Date(existingMedicine.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    endDate: existingMedicine?.endDate
      ? new Date(existingMedicine.endDate).toISOString().split("T")[0]
      : "",
    notes: existingMedicine?.notes ?? "",
    quantity: existingMedicine?.quantity !== undefined ? String(existingMedicine.quantity) : "",
    refillThreshold:
      existingMedicine?.refillThreshold !== undefined ? String(existingMedicine.refillThreshold) : "",
    expiryDate: existingMedicine?.expiryDate
      ? new Date(existingMedicine.expiryDate).toISOString().split("T")[0]
      : "",
    mealInstruction: existingMedicine?.mealInstruction ?? ("" as "" | "before_food" | "after_food" | "empty_stomach"),
  });
  const [loading, setLoading] = useState(false);
  const [interactionWarnings, setInteractionWarnings] = useState<InteractionWarning[]>([]);
  const [checkingInteractions, setCheckingInteractions] = useState(false);

  useEffect(() => {
    setFormData({
      name: existingMedicine?.name ?? "",
      dosage: existingMedicine?.dosage ?? "",
      frequency: existingMedicine?.frequency ?? "daily" as "daily" | "weekly" | "as_needed",
      times: existingMedicine?.times ?? ["08:00"],
      startDate: existingMedicine
        ? new Date(existingMedicine.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      endDate: existingMedicine?.endDate
        ? new Date(existingMedicine.endDate).toISOString().split("T")[0]
        : "",
      notes: existingMedicine?.notes ?? "",
      quantity: existingMedicine?.quantity !== undefined ? String(existingMedicine.quantity) : "",
      refillThreshold:
        existingMedicine?.refillThreshold !== undefined ? String(existingMedicine.refillThreshold) : "",
      expiryDate: existingMedicine?.expiryDate
        ? new Date(existingMedicine.expiryDate).toISOString().split("T")[0]
        : "",
      mealInstruction: existingMedicine?.mealInstruction ?? ("" as "" | "before_food" | "after_food" | "empty_stomach"),
    });
    setInteractionWarnings([]);
  }, [existingMedicine]);

  const [formError, setFormError] = useState<string | null>(null);

  const handleNameBlur = async () => {
    const name = formData.name.trim();
    if (!name) {
      setInteractionWarnings([]);
      return;
    }

    setCheckingInteractions(true);
    try {
      const warnings = await medicineService.checkInteractions(name, existingMedicine?._id);
      setInteractionWarnings(warnings);
    } catch (error) {
      console.error("Failed to check medicine interactions:", error);
    } finally {
      setCheckingInteractions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError("Medicine name is required.");
      return;
    }

    if (!formData.dosage.trim()) {
      setFormError("Dosage is required.");
      return;
    }

    if (!formData.times.some((t) => t)) {
      setFormError("At least one scheduled time is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        times: formData.times.filter((t) => t),
        endDate: formData.endDate || undefined,
        quantity: formData.quantity ? Number(formData.quantity) : undefined,
        refillThreshold: formData.refillThreshold ? Number(formData.refillThreshold) : undefined,
        expiryDate: formData.expiryDate || undefined,
        mealInstruction: formData.mealInstruction || undefined,
      };

      if (existingMedicine) {
        await medicineService.updateMedicine(existingMedicine._id, payload);
        onToast("success", "Medicine updated successfully.");
      } else {
        await medicineService.createMedicine(payload);
        onToast("success", "Medicine added successfully.");
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save medicine:", error);
      onToast("error", "Failed to save medicine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addTime = () => {
    setFormData({ ...formData, times: [...formData.times, ""] });
  };

  const removeTime = (index: number) => {
    setFormData({
      ...formData,
      times: formData.times.filter((_, i) => i !== index),
    });
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Medicine Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onBlur={handleNameBlur}
          required
        />
        {checkingInteractions && <p className="interaction-status">Checking for interactions…</p>}
        {!checkingInteractions && interactionWarnings.length > 0 && (
          <div className="interaction-warning">
            <p className="interaction-warning-title">⚠️ Possible interaction</p>
            {interactionWarnings.map((warning, index) => (
              <p key={index}>
                This medicine may interact with <strong>{warning.otherMedicineName}</strong>. Confirm with your
                doctor or pharmacist before taking both.
              </p>
            ))}
            <p className="interaction-warning-note">
              Based on automated FDA label text matching — not a clinical review.
            </p>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Dosage *</label>
        <input
          type="text"
          value={formData.dosage}
          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
          placeholder="e.g., 500mg"
          required
        />
      </div>

      <div className="form-group">
        <label>Frequency *</label>
        <select
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="as_needed">As Needed</option>
        </select>
      </div>

      <div className="form-group">
        <label>Meal Instruction (Optional)</label>
        <select
          value={formData.mealInstruction}
          onChange={(e) => setFormData({ ...formData, mealInstruction: e.target.value as any })}
        >
          <option value="">Not specified</option>
          <option value="before_food">Before Food</option>
          <option value="after_food">After Food</option>
          <option value="empty_stomach">Empty Stomach</option>
        </select>
      </div>

      <div className="form-group">
        <label>Scheduled Times *</label>
        {formData.times.map((time, index) => (
          <div key={index} className="time-input">
            <input
              type="time"
              value={time}
              onChange={(e) => updateTime(index, e.target.value)}
              required
            />
            {formData.times.length > 1 && (
              <button type="button" onClick={() => removeTime(index)}>
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-time-btn" onClick={addTime}>
          + Add Time
        </button>
      </div>

      <div className="form-group">
        <label>Start Date *</label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>End Date (Optional)</label>
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Notes (Optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Quantity Remaining (Optional)</label>
        <input
          type="number"
          min="0"
          placeholder="e.g., 30"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Refill Threshold (Optional)</label>
        <input
          type="number"
          min="0"
          placeholder="Alert when quantity falls to this number (default 5)"
          value={formData.refillThreshold}
          onChange={(e) => setFormData({ ...formData, refillThreshold: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Expiry Date (Optional)</label>
        <input
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
        />
      </div>

      {formError && <div className="field-error">{formError}</div>}
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (existingMedicine ? "Saving..." : "Adding...") : existingMedicine ? "Update Medicine" : "Add Medicine"}
        </button>
      </div>

      <style jsx>{`
        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2563eb;
        }

        .time-input {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .time-input input {
          flex: 1;
        }

        .time-input button {
          padding: 0.5rem 0.75rem;
          background: #fef2f2;
          color: #dc2626;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .add-time-btn {
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          color: #1e293b;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .add-time-btn:hover {
          background: #e2e8f0;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .cancel-btn,
        .submit-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }

        .field-error {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-weight: 600;
        }

        .interaction-status {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .interaction-warning {
          margin-top: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
          font-size: 0.85rem;
        }

        .interaction-warning-title {
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .interaction-warning-note {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          opacity: 0.8;
        }

        :global(.dark) .interaction-status {
          color: #9ca3af;
        }
        :global(.dark) .interaction-warning {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.3);
          color: #fbbf24;
        }

        .cancel-btn {
          background: #f1f5f9;
          color: #1e293b;
        }

        .submit-btn {
          background: #2563eb;
          color: #fff;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        :global(.dark) .form-group label {
          color: #d1d5db;
        }
        :global(.dark) .form-group input,
        :global(.dark) .form-group select,
        :global(.dark) .form-group textarea {
          background: #111827;
          border-color: #374151;
          color: #f3f4f6;
        }
        :global(.dark) .add-time-btn {
          background: #1f2937;
          color: #e5e7eb;
        }
        :global(.dark) .add-time-btn:hover {
          background: #374151;
        }
        :global(.dark) .cancel-btn {
          background: #1f2937;
          color: #e5e7eb;
        }
        :global(.dark) .field-error {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #f87171;
        }
      `}</style>
    </form>
  );
}
