import { Card } from "./Card";

const HEALTH_TIP = "💧 Tip: Drink at least 8 glasses of water today to stay hydrated.";

export function WelcomeCard() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xl font-semibold text-gray-900">Good Morning 👋</p>
          <p className="mt-1 text-lg text-gray-800">Welcome back to MediMate</p>
          <p className="mt-1 text-sm text-gray-500">Your personal healthcare companion.</p>
        </div>

        <div className="text-sm font-medium text-gray-500 sm:text-right">{today}</div>
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
        {HEALTH_TIP}
      </div>
    </Card>
  );
}
