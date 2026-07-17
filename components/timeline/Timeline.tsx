import { TimelineEvent } from "../../types/timeline.types";
import { TimelineGroup } from "./TimelineGroup";

interface TimelineProps {
  events: TimelineEvent[];
}

const dayLabel = (dateKey: string) => {
  const today = new Date();
  const todayKey = today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toDateString();

  if (dateKey === todayKey) return "Today";
  if (dateKey === yesterdayKey) return "Yesterday";
  return new Date(dateKey).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

export function Timeline({ events }: TimelineProps) {
  const groups: { key: string; events: TimelineEvent[] }[] = [];
  for (const event of events) {
    const key = new Date(event.date).toDateString();
    const group = groups.find((g) => g.key === key);
    if (group) {
      group.events.push(event);
    } else {
      groups.push({ key, events: [event] });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <TimelineGroup key={group.key} label={dayLabel(group.key)} events={group.events} />
      ))}
    </div>
  );
}
