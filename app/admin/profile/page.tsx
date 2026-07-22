"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import { useAuth } from "../../../contexts/AuthContext";
import { profileService } from "../../../services/profile.service";
import { adminService } from "../../../services/admin.service";
import { ProfileData } from "../../../types/profile.types";
import { AuditLogEntry } from "../../../types/audit-log.types";
import { Card } from "../../../components/dashboard/Card";
import { Button } from "../../../components/Button";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";
import { AdminEmptyState } from "../../../components/admin/AdminEmptyState";

const targetTypeLabel: Record<string, string> = {
  user: "User Management",
  subscription: "Subscriptions",
  payment: "Payments",
  feedback: "Feedback",
  report: "Reports",
  settings: "System Settings",
};

const moduleFor = (log: AuditLogEntry) => targetTypeLabel[log.targetType ?? ""] ?? "General";

const formatAction = (action: string) =>
  action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AdminProfilePage() {
  const toast = useToast();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("other");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [activity, setActivity] = useState<AuditLogEntry[] | null>(null);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    adminService
      .getAuditLogs({ adminId: user.id, limit: 8 })
      .then((result) => setActivity(result.items))
      .catch((error) => {
        console.error("Failed to load activity history:", error);
        setActivity([]);
      });
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setUsername(data.username);
      setEmail(data.email);
      setGender(data.gender);
    } catch (error) {
      console.error("Failed to load admin profile:", error);
      toast.error("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await profileService.updateProfile({ username, email, gender });
      setProfile(updated);
      if (user) {
        updateUser({ ...user, username: updated.username, email: updated.email });
      }
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update admin profile:", error);
      toast.error("Unable to update profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    setSavingPassword(true);
    try {
      await profileService.updatePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(error instanceof Error ? error.message : "Unable to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";
  const disabledInputClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 outline-none dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400";

  if (loading || !profile) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Admin Profile</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account details, password, and activity.</p>
        </div>
        <AdminSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Admin Profile</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account details, password, and activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Personal Information</h2>
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Role</label>
                <input type="text" value="Admin" disabled className={disabledInputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value as "male" | "female" | "other")} className={inputClass}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </form>
        </Card>

        <Card>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Security</h2>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={savingPassword} className="self-start">
              {savingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Activity History</h2>
          <Link href="/admin/audit-logs" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400">
            View Full Audit Trail →
          </Link>
        </div>

        {activity === null ? (
          <AdminSkeleton />
        ) : activity.length === 0 ? (
          <AdminEmptyState title="No activity yet" description="Actions you take as an admin will show up here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                  <th className="pb-2 pr-4">Action</th>
                  <th className="pb-2 pr-4">Module</th>
                  <th className="pb-2">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {activity.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2.5 pr-4 font-semibold text-gray-900 dark:text-white">
                      {formatAction(log.action)}
                      {log.targetLabel ? (
                        <span className="ml-1 font-normal text-gray-500 dark:text-gray-400">— {log.targetLabel}</span>
                      ) : null}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">{moduleFor(log)}</td>
                    <td className="py-2.5 text-gray-500 dark:text-gray-400">{formatDate(log.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
