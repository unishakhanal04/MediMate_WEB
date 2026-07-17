import { AddMedicineForm } from "./AddMedicineForm";
import { Medicine } from "../../services/medicine.service";
import { useToast } from "../../contexts/ToastContext";

interface MedicineModalProps {
  open: boolean;
  medicine: Medicine | null;
  onClose: () => void;
  onSuccess: () => void;
  toast: ReturnType<typeof useToast>;
}

export function MedicineModal({ open, medicine, onClose, onSuccess, toast }: MedicineModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{medicine ? "Edit Medicine" : "Add Medicine"}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <AddMedicineForm
          existingMedicine={medicine}
          onToast={(type, message) => toast[type](message)}
          onSuccess={onSuccess}
          onCancel={onClose}
        />
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #fff;
          border-radius: 12px;
          padding: 2rem;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
