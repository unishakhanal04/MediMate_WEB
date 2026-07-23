import { Card } from "./Card";
import { TimelineEvent, TimelineEventType } from "../../types/timeline.types";

interface RecentActivityProps {
  events: TimelineEvent[];
}

const dotStyleFor: Record<TimelineEventType, { bg: string; icon: string }> = {
  medicine_taken: { bg: "bg-blue-600", icon: "✓" },
  medicine_added: { bg: "bg-amber-500", icon: "+" },
  medicine_skipped: { bg: "bg-amber-500", icon: "!" },
  medicine_missed: { bg: "bg-amber-500", icon: "!" },
  reminder_snoozed: { bg: "bg-amber-500", icon: "⏰" },
  prescription_uploaded: { bg: "bg-violet-600", icon: "" },
  appointment_created: { bg: "bg-blue-600", icon: "" },
  appointment_completed: { bg: "bg-emerald-600", icon: "✓" },
  emergency_contact_added: { bg: "bg-rose-500", icon: "" },
  ai_conversation: { bg: "bg-violet-600", icon: "" },
  profile_updated: { bg: "bg-gray-400", icon: "" },
  password_changed: { bg: "bg-gray-400", icon: "🔒" },
};

export function RecentActivity({ events }: RecentActivityProps) {
  return (
    <Card className="flex flex-col gap-4">
      <p className="text-base font-bold text-gray-900 dark:text-white">Recent Activity</p>

      {events.length === 0 ? (
        <p className="py-4 text-sm text-gray-400 dark:text-gray-500">No recent activity yet.</p>
      ) : (
        <div className="flex flex-col">
          {events.map((event, index) => {
            const dot = dotStyleFor[event.type];
            const isLast = index === events.length - 1;
            return (
              <div key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute left-[9px] top-6 h-full w-px bg-gray-200 dark:bg-gray-800"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`z-10 mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${dot.bg}`}
                  aria-hidden="true"
                >
                  {dot.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{event.title}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {event.description ? `${event.description} · ` : ""}
                    {new Date(event.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
