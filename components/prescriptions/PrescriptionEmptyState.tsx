import { Card } from "../dashboard/Card";
import { Button } from "../Button";

type PrescriptionEmptyStateVariant = "no-prescriptions" | "no-results" | "no-expired";

interface PrescriptionEmptyStateProps {
  variant: PrescriptionEmptyStateVariant;
  onAddPrescription?: () => void;
}

const content: Record<
  PrescriptionEmptyStateVariant,
  { icon: string; heading: string; message: string }
> = {
  "no-prescriptions": {
    icon: "📄",
    heading: "No prescriptions yet",
    message: "Upload your first prescription to keep it safe and accessible.",
  },
  "no-results": {
    icon: "🔍",
    heading: "No prescriptions match your search",
    message: "Try adjusting your search or filters.",
  },
  "no-expired": {
    icon: "✅",
    heading: "No expired prescriptions",
    message: "Everything on file is still active.",
  },
};

export function PrescriptionEmptyState({ variant, onAddPrescription }: PrescriptionEmptyStateProps) {
  const { icon, heading, message } = content[variant];

  return (
    <Card className="flex flex-col items-center py-12 text-center">
      <span
        className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl"
        aria-hidden="true"
      >
        {icon}
      </span>

      <h2 className="mt-5 text-lg font-bold text-gray-900">{heading}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">{message}</p>

      {variant === "no-prescriptions" && onAddPrescription && (
        <Button className="mt-6" onClick={onAddPrescription}>
          Upload Your First Prescription
        </Button>
      )}
    </Card>
  );
}
