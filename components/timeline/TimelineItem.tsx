import Link from "next/link";
import { TimelineEvent, TimelineEventType } from "../../types/timeline.types";

interface TimelineItemProps {
  event: TimelineEvent;
}

const iconByType: Record<TimelineEventType, string> = {
  medicine_added: "💊",
  medicine_taken: "✅",
  medicine_skipped: "⏭️",
  medicine_missed: "⚠️",
  prescription_uploaded: "📄",
  appointment: "📅",
  ai_conversation: "💬",
  profile_updated: "👤",
};

const linkByType = (event: TimelineEvent): string => {
  switch (event.type) {
    case "prescription_uploaded":
      return `/user/prescriptions/${event.refId}`;
    case "appointment":
      return "/user/appointments";
    case "ai_conversation":
      return "/user/ai";
    case "profile_updated":
      return "/user/profile";
    default:
      return "/user/medicines";
  }
};

export function TimelineItem({ event }: TimelineItemProps) {
  return (
    <li>
      <Link
        href={linkByType(event)}
        className={`flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-50 ${
          event.type === "medicine_missed" ? "border-l-4 border-l-red-400" : ""
        }`}
      >
        <span className="flex-shrink-0 text-xl" aria-hidden="true">
          {iconByType[event.type]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{event.title}</p>
          {event.description && (
            <p className="truncate text-xs text-gray-500">{event.description}</p>
          )}
        </div>
        <span className="flex-shrink-0 whitespace-nowrap text-xs text-gray-400">
          {new Date(event.date).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </Link>
    </li>
  );
}
