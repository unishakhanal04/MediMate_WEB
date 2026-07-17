import { Card } from "../dashboard/Card";
import { ProfileData } from "../../types/profile.types";

interface ProfileCardProps {
  profile: ProfileData;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const initials = profile.username
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
      {profile.profileImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.profileImage}
          alt={profile.username}
          className="h-16 w-16 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-700">
          {initials}
        </span>
      )}

      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold text-gray-900">{profile.username}</h2>
        <p className="truncate text-sm text-gray-500">{profile.email}</p>
        {profile.phone && <p className="mt-0.5 text-sm text-gray-500">{profile.phone}</p>}
      </div>
    </Card>
  );
}
