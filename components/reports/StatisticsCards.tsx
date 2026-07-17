import { Card } from "../dashboard/Card";
import { ReportsOverview } from "../../types/report.types";

interface StatisticsCardsProps {
  overview: ReportsOverview;
}

export function StatisticsCards({ overview }: StatisticsCardsProps) {
  const cards = [
    {
      icon: "📈",
      title: "Weekly Adherence",
      value: `${overview.weeklyAdherence}%`,
      accent: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      icon: "💊",
      title: "Active Medicines",
      value: overview.activeMedicines,
      accent: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      icon: "📄",
      title: "Active Prescriptions",
      value: overview.activePrescriptions,
      accent: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    },
    {
      icon: "📅",
      title: "Upcoming Appointments",
      value: overview.upcomingAppointments,
      accent: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    },
    {
      icon: "🔥",
      title: "Current Streak",
      value: `${overview.currentStreak} ${overview.currentStreak === 1 ? "day" : "days"}`,
      accent: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title} className="flex h-full flex-col gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${card.accent}`}
            aria-hidden="true"
          >
            {card.icon}
          </span>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
