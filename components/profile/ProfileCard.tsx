"use client";

import { useRef, useState } from "react";
import { Card } from "../dashboard/Card";
import { ProfileData } from "../../types/profile.types";

interface ProfileCardProps {
  profile: ProfileData;
  onImageChange: (file: File) => Promise<void> | void;
}

export function ProfileCard({ profile, onImageChange }: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const initials = profile.username
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      await onImageChange(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
      <div className="relative shrink-0">
        {profile.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.profileImage}
            alt={profile.username}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            {initials}
          </span>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          aria-label="Change profile picture"
          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white shadow-sm ring-2 ring-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:ring-gray-900"
        >
          {uploading ? (
            <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            "📷"
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">{profile.username}</h2>
        <p className="truncate text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
        {profile.phone && <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{profile.phone}</p>}
      </div>
    </Card>
  );
}
