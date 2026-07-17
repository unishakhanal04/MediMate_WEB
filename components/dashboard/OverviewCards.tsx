import { Card } from "./Card";

interface OverviewStat {
  icon: string;
  title: string;
  count: number;
  description: string;
  actionLabel: string;
}

const overviewStats: OverviewStat[] = [
  {
    icon: "💊",
    title: "Active Medicines",
    count: 0,
    description: "Medicines you're currently tracking.",
    actionLabel: "Manage",
  },
  {
    icon: "📄",
    title: "Prescriptions",
    count: 0,
    description: "Prescriptions uploaded to your account.",
    actionLabel: "View",
  },
  {
    icon: "📅",
    title: "Upcoming Appointments",
    count: 0,
    description: "Appointments scheduled ahead.",
    actionLabel: "View",
  },
  {
    icon: "⏰",
    title: "Active Reminders",
    count: 0,
    description: "Reminders set to keep you on track.",
    actionLabel: "Manage",
  },
];

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {overviewStats.map((stat) => (
        <Card key={stat.title} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-2xl font-semibold text-gray-900">{stat.count}</span>
          </div>

          <div>
            <p className="font-semibold text-gray-900">{stat.title}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
          </div>

          <span className="text-sm font-medium text-blue-600">{stat.actionLabel}</span>
        </Card>
      ))}
    </div>
  );
}
