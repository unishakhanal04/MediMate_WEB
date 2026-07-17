import { EmptyState } from "../common/EmptyState";

interface AdminEmptyStateProps {
  title?: string;
  description?: string;
}

export function AdminEmptyState({
  title = "No data yet",
  description = "Nothing to show here yet.",
}: AdminEmptyStateProps) {
  return <EmptyState icon="🗂️" title={title} description={description} />;
}
