import { Prescription } from "../../types/prescription.types";
import { PrescriptionCard } from "./PrescriptionCard";

interface PrescriptionListProps {
  prescriptions: Prescription[];
  onEdit: (prescription: Prescription) => void;
  onDelete: (id: string) => void;
}

export function PrescriptionList({ prescriptions, onEdit, onDelete }: PrescriptionListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {prescriptions.map((prescription) => (
        <PrescriptionCard
          key={prescription._id}
          prescription={prescription}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
