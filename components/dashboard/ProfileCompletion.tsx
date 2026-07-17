import Link from "next/link";
import { Card } from "./Card";

interface ChecklistItem {
  label: string;
  completed: boolean;
}

const completionPercent = 65;

const checklist: ChecklistItem[] = [
  { label: "Full Name", completed: true },
  { label: "Email", completed: true },
  { label: "Phone Number", completed: true },
  { label: "Blood Group", completed: false },
  { label: "Emergency Contact", completed: false },
  { label: "Profile Photo", completed: false },
];

export function ProfileCompletion() {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-gray-900">Complete Your Profile</p>
        <span className="text-sm font-medium text-gray-500">{completionPercent}% Complete</span>
      </div>

      <div className="h-2 w-full rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-blue-600"
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      <ul className="flex flex-col gap-2">
        {checklist.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-sm text-gray-700">
            <span>{item.completed ? "✅" : "❌"}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/user/profile"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Complete Profile →
      </Link>
    </Card>
  );
}
