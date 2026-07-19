import Link from "next/link";
import { Card } from "./Card";

const actions = [
  {
    icon: "💊",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    title: "My Medicines",
    description: "Track doses and refill requests",
    href: "/user/medicines",
  },
  {
    icon: "📅",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    title: "Schedule Appointment",
    description: "Book a visit with your specialists",
    href: "/user/appointments",
  },
  {
    icon: "📄",
    iconBg: "bg-pink-50 dark:bg-pink-500/10",
    title: "View Prescriptions",
    description: "Access digital Rx and history",
    href: "/user/prescriptions",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {actions.map((action) => (
        <Link key={action.title} href={action.href}>
          <Card className="flex h-full flex-col gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${action.iconBg}`}
              aria-hidden="true"
            >
              {action.icon}
            </span>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{action.title}</p>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
            </div>
          </Card>
        </Link>
      ))}

      <Link href="/user/ai" className="sm:col-span-1">
        <div className="relative flex h-full flex-col justify-between gap-3 overflow-hidden rounded-2xl bg-violet-500 p-6 text-white shadow-sm transition-shadow hover:shadow-md">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-lg"
            aria-hidden="true"
          >
            ✨
          </span>
          <div>
            <p className="font-bold">AI Assistant</p>
            <p className="mt-0.5 text-sm text-violet-100">Get instant health answers</p>
          </div>
          <span className="pointer-events-none absolute -bottom-3 -right-3 text-7xl opacity-20" aria-hidden="true">
            🤖
          </span>
        </div>
      </Link>
    </div>
  );
}
