"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "../../../../contexts/ToastContext";
import { adminService } from "../../../../services/admin.service";
import { AdminUserActivity } from "../../../../types/admin.types";
import { PageHeader } from "../../../../components/common/PageHeader";
import { StatusBadge } from "../../../../components/common/StatusBadge";
import { AdminSkeleton } from "../../../../components/admin/AdminSkeleton";
import { Card } from "../../../../components/dashboard/Card";
import { Button } from "../../../../components/Button";

const timelineIcon: Record<string, string> = {
  medicine_added: "💊",
  medicine_taken: "✅",
  medicine_skipped: "⏭️",
  medicine_missed: "⚠️",
  reminder_snoozed: "⏰",
  prescription_uploaded: "📄",
  appointment_created: "📅",
  appointment_completed: "✔️",
  emergency_contact_added: "🆘",
  ai_conversation: "💬",
  profile_updated: "👤",
  password_changed: "🔒",
};

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
        <span aria-hidden="true">{icon}</span> {title}
      </h2>
      {children}
    </Card>
  );
}

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [activity, setActivity] = useState<AdminUserActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUserActivity(params.id);
      setActivity(data);
    } catch (error) {
      console.error("Failed to load user activity:", error);
      toast.error("Unable to load this user's details.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!activity) return;
    const nextStatus = activity.user.status === "active" ? "inactive" : "active";
    setUpdating(true);
    try {
      await adminService.updateUserStatus(activity.user.id, nextStatus);
      toast.success(`User ${nextStatus === "active" ? "activated" : "deactivated"}.`);
      fetchActivity();
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Unable to update user status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader icon="👤" title="User Details" description="Loading account overview..." />
        <AdminSkeleton />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
        <p>This user could not be found.</p>
        <Link href="/admin/users" className="font-semibold text-blue-600">
          ← Back to User Management
        </Link>
      </div>
    );
  }

  const { user, profile, medicines, appointments, prescriptions, emergencyContacts, timeline, reports, aiUsage } =
    activity;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/users" className="text-sm font-semibold text-blue-600">
        ← Back to User Management
      </Link>

      <PageHeader
        icon="👤"
        title={user.username}
        description={user.email}
        action={
          <Button variant={user.status === "active" ? "outline" : "primary"} onClick={toggleStatus} disabled={updating}>
            {updating ? "Updating..." : user.status === "active" ? "Deactivate User" : "Activate User"}
          </Button>
        }
      />

      <SectionCard title="User Information" icon="ℹ️">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Status</p>
            <StatusBadge status={user.status} className="mt-1" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Role</p>
            <p className="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">{user.role}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Joined</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Last Login</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never logged in"}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Profile" icon="🧾">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Phone</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{profile.phone || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Date of Birth</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Blood Group</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{profile.bloodGroup || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Height / Weight</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {profile.height ? `${profile.height} cm` : "—"} / {profile.weight ? `${profile.weight} kg` : "—"}
            </p>
          </div>
          {profile.allergies.length > 0 && (
            <div className="sm:col-span-2 lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Allergies</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{profile.allergies.join(", ")}</p>
            </div>
          )}
          {profile.chronicDiseases.length > 0 && (
            <div className="sm:col-span-2 lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Chronic Conditions
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {profile.chronicDiseases.join(", ")}
              </p>
            </div>
          )}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Medicines" icon="💊">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {medicines.total} total · {medicines.active} active
          </p>
          {medicines.recent.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {medicines.recent.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800/60">
                  <span className="font-medium text-gray-900 dark:text-white">{m.name}</span>
                  <span className="text-xs capitalize text-gray-500 dark:text-gray-400">{m.dosage} · {m.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No medicines added.</p>
          )}
        </SectionCard>

        <SectionCard title="Appointments" icon="📅">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {appointments.total} total · {appointments.upcoming} upcoming
          </p>
          {appointments.recent.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {appointments.recent.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800/60">
                  <span className="font-medium text-gray-900 dark:text-white">{a.purpose}</span>
                  <span className="text-xs capitalize text-gray-500 dark:text-gray-400">
                    {new Date(a.appointmentDate).toLocaleDateString()} · {a.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No appointments booked.</p>
          )}
        </SectionCard>

        <SectionCard title="Prescriptions" icon="📄">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {prescriptions.total} total · {prescriptions.active} active
          </p>
          {prescriptions.recent.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {prescriptions.recent.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800/60">
                  <span className="font-medium text-gray-900 dark:text-white">{p.title}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {p.doctorName} · {new Date(p.prescriptionDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No prescriptions uploaded.</p>
          )}
        </SectionCard>

        <SectionCard title="Emergency Contacts" icon="🆘">
          {emergencyContacts.contacts.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {emergencyContacts.contacts.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800/60">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {c.name} {c.isPrimary && <span className="ml-1 text-xs font-semibold text-blue-600 dark:text-blue-400">(Primary)</span>}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{c.relationship} · {c.phone}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No emergency contacts added.</p>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Timeline" icon="🕒">
        {timeline.items.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {timeline.items.map((event) => (
              <li key={event.id} className="flex items-start gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800/60">
                <span aria-hidden="true">{timelineIcon[event.type] ?? "•"}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(event.date).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">No recent activity.</p>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard title="Reports" icon="📈">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.weeklyAdherence}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Weekly adherence · {reports.medicinesTaken}/{reports.totalScheduled} doses · {reports.streak}-day streak
          </p>
        </SectionCard>

        <SectionCard title="AI Usage" icon="💬">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{aiUsage.totalConversations}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total conversations</p>
        </SectionCard>
      </div>
    </div>
  );
}
