import { Card } from "../dashboard/Card";
import { ProfileData } from "../../types/profile.types";

interface ProfileCompletionProps {
  profile: ProfileData;
}

export function ProfileCompletion({ profile }: ProfileCompletionProps) {
  const checklist = [
    { label: "Full Name", completed: Boolean(profile.username) },
    { label: "Email", completed: Boolean(profile.email) },
    { label: "Phone Number", completed: Boolean(profile.phone) },
    { label: "Date of Birth", completed: Boolean(profile.dateOfBirth) },
    { label: "Blood Group", completed: Boolean(profile.bloodGroup) },
    { label: "Height & Weight", completed: Boolean(profile.height && profile.weight) },
    { label: "Profile Photo", completed: Boolean(profile.profileImage) },
  ];

  const completionPercent = Math.round(
    (checklist.filter((item) => item.completed).length / checklist.length) * 100
  );

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-gray-900 dark:text-white">Profile Completion</p>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{completionPercent}% Complete</span>
      </div>

      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all"
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {checklist.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span aria-hidden="true">{item.completed ? "✅" : "❌"}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
