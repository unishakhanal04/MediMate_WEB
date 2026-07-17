import { Card } from "./Card";

interface HealthTipData {
  icon: string;
  title: string;
  tip: string;
  category: string;
}

const healthTip: HealthTipData = {
  icon: "💡",
  title: "Daily Health Tip",
  tip: "Stay hydrated! Drinking enough water throughout the day helps maintain energy levels and supports overall health.",
  category: "Hydration",
};

export function HealthTip() {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{healthTip.icon}</span>
        <p className="font-semibold text-gray-900">{healthTip.title}</p>
      </div>

      <p className="text-sm leading-relaxed text-gray-600">{healthTip.tip}</p>

      <div className="mt-1 border-t border-gray-100 pt-3">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {healthTip.category}
        </span>
      </div>
    </Card>
  );
}
