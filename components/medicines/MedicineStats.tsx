import { AdherenceStats } from "../../types/medicine.types";

interface MedicineStatsProps {
  stats: AdherenceStats;
}

export function MedicineStats({ stats }: MedicineStatsProps) {
  const cards = [
    {
      icon: "📈",
      title: "Weekly Adherence",
      value: `${stats.weeklyAdherence}%`,
      accent: "bg-blue-50 text-blue-600",
    },
    {
      icon: "✅",
      title: "Medicines Taken",
      value: stats.medicinesTaken,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: "📋",
      title: "Total Scheduled",
      value: stats.totalScheduled,
      accent: "bg-amber-50 text-amber-600",
    },
    {
      icon: "🔥",
      title: "Current Streak",
      value: `${stats.streak} ${stats.streak === 1 ? "day" : "days"}`,
      accent: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${card.accent}`}>
            {card.icon}
          </span>
          <div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-1 text-sm font-medium text-gray-500">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
