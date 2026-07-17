import { EmptyState } from "../common/EmptyState";

interface ReportsEmptyStateProps {
  title?: string;
  description?: string;
}

export function ReportsEmptyState({
  title = "No data yet",
  description = "Start tracking your medicines, prescriptions, and appointments to see insights here.",
}: ReportsEmptyStateProps) {
  return <EmptyState icon="📊" title={title} description={description} />;
}
