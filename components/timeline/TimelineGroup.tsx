import { TimelineEvent } from "../../types/timeline.types";
import { TimelineItem } from "./TimelineItem";

interface TimelineGroupProps {
  label: string;
  events: TimelineEvent[];
}

export function TimelineGroup({ label, events }: TimelineGroupProps) {
  return (
    <section aria-label={label}>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">{label}</h2>
      <ul className="flex flex-col gap-2">
        {events.map((event) => (
          <TimelineItem key={event.id} event={event} />
        ))}
      </ul>
    </section>
  );
}
