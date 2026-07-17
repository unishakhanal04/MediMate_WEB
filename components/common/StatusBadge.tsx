export type StatusBadgeVariant =
  | "active"
  | "inactive"
  | "completed"
  | "upcoming"
  | "scheduled"
  | "expired"
  | "cancelled";

interface StatusBadgeProps {
  status: StatusBadgeVariant;
  label?: string;
  className?: string;
}

// Canonical color mapping for the whole app going forward. Note: Medicines'
// current badge colors "completed" gray, which this maps to emerald instead —
// a deliberate pick (see task notes), not yet backported to MedicineCard.
const statusStyles: Record<StatusBadgeVariant, string> = {
  active: "bg-emerald-50 text-emerald-700",
  scheduled: "bg-blue-50 text-blue-700",
  upcoming: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  inactive: "bg-red-50 text-red-600",
  expired: "bg-red-50 text-red-600",
  cancelled: "bg-gray-100 text-gray-600",
};

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status]} ${className}`}
    >
      {label ?? status}
    </span>
  );
}
