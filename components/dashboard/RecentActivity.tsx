import { Card } from "./Card";

interface Activity {
  id: string;
  icon: string;
  title: string;
  timestamp: string;
}

const activities: Activity[] = [
  { id: "1", icon: "💊", title: "You took Paracetamol 500mg", timestamp: "Today, 8:00 AM" },
  { id: "2", icon: "📄", title: "Uploaded a new prescription", timestamp: "Yesterday, 4:30 PM" },
  { id: "3", icon: "📅", title: "Booked an appointment with Dr. Sharma", timestamp: "2 days ago" },
  { id: "4", icon: "⏰", title: "Reminder set for Vitamin D", timestamp: "3 days ago" },
];

export function RecentActivity() {
  return (
    <Card>
      <p className="font-semibold text-gray-900">Recent Activity</p>

      {activities.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-1 py-6 text-center">
          <p className="font-medium text-gray-700">No recent activity yet.</p>
          <p className="text-sm text-gray-500">
            Add a medicine or upload a prescription to see your activity here.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-gray-100">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 py-3">
              <span className="text-xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
