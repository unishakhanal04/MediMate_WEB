import Link from "next/link";
import { Card } from "./Card";

interface QuickAction {
  icon: string;
  title: string;
  description: string;
  href: string;
}

const quickActions: QuickAction[] = [
  {
    icon: "💊",
    title: "Add Medicine",
    description: "Track a new medicine and set your dosage schedule.",
    href: "/user/medicines",
  },
  {
    icon: "📄",
    title: "Upload Prescription",
    description: "Save a prescription for quick access anytime.",
    href: "/user/prescriptions",
  },
  {
    icon: "📅",
    title: "Book Appointment",
    description: "Schedule a visit with your healthcare provider.",
    href: "/user/appointments",
  },
  {
    icon: "🤖",
    title: "Ask AI Assistant",
    description: "Get quick answers to your health questions.",
    href: "/user/ai",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {quickActions.map((action) => (
        <Link key={action.title} href={action.href}>
          <Card className="flex h-full flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{action.icon}</span>
              <span className="text-gray-400">→</span>
            </div>

            <div>
              <p className="font-semibold text-gray-900">{action.title}</p>
              <p className="mt-1 text-sm text-gray-500">{action.description}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
