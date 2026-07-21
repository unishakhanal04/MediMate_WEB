import { EmptyState } from "../common/EmptyState";
import { Button } from "../Button";

type AppointmentEmptyStateVariant = "no-appointments" | "no-upcoming" | "no-completed" | "no-cancelled" | "no-results";

interface AppointmentEmptyStateProps {
  variant: AppointmentEmptyStateVariant;
  onAddAppointment?: () => void;
}

const content: Record<
  AppointmentEmptyStateVariant,
  { icon: string; title: string; description: string }
> = {
  "no-appointments": {
    icon: "📅",
    title: "No appointments yet",
    description: "Schedule your next doctor visit to keep track of it here.",
  },
  "no-upcoming": {
    icon: "📅",
    title: "No upcoming appointments",
    description: "Schedule your next doctor visit to keep track of it here.",
  },
  "no-completed": {
    icon: "🗂️",
    title: "No completed appointments",
    description: "Visits you mark as completed will show up here.",
  },
  "no-cancelled": {
    icon: "🚫",
    title: "No cancelled appointments",
    description: "Visits you cancel will show up here.",
  },
  "no-results": {
    icon: "🔍",
    title: "No appointments match your search",
    description: "Try adjusting your search or filters.",
  },
};

export function AppointmentEmptyState({ variant, onAddAppointment }: AppointmentEmptyStateProps) {
  const { icon, title, description } = content[variant];
  const showCta = (variant === "no-appointments" || variant === "no-upcoming") && onAddAppointment;

  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={showCta ? <Button onClick={onAddAppointment}>Schedule an Appointment</Button> : undefined}
    />
  );
}
