import { EmptyState } from "../common/EmptyState";

export function TimelineEmptyState() {
  return (
    <EmptyState
      icon="🕒"
      title="Nothing to show yet"
      description="Once you take medicines, upload prescriptions, book appointments, or chat with the AI assistant, they'll show up here."
    />
  );
}
