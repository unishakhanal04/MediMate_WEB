import { TimelineEvent } from "../../types/timeline.types";
import { TimelineItem } from "./TimelineItem";

interface TimelineGroupProps {
  label: string;
  events: TimelineEvent[];
}

export function TimelineGroup({ label, events }: TimelineGroupProps) {
  return (
    <section aria-label={label}>
      <div className="relative z-10 mb-3 flex items-center gap-3">
        <span
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-50 text-lg text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
          aria-hidden="true"
        >
          🗓️
        </span>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">{label}</h2>
      </div>
      <ul className="ml-[52px] flex flex-col gap-3">
        {events.map((event) => (
          <TimelineItem key={event.id} event={event} />
        ))}
      </ul>
    </section>
  );
}
