"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";
import { medicineService, TodayMedicine, AdherenceStats } from "../../services/medicine.service";
import { appointmentService } from "../../services/appointment.service";
import { Appointment } from "../../types/appointment.types";
import { timelineService } from "../../services/timeline.service";
import { TimelineEvent } from "../../types/timeline.types";
import { profileService } from "../../services/profile.service";
import { prescriptionService } from "../../services/prescription.service";
import { StatTile } from "../../components/dashboard/StatTile";
import { HealthTip } from "../../components/dashboard/HealthTip";
import { ProfileCompletion } from "../../components/dashboard/ProfileCompletion";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { AppointmentsPanel } from "../../components/dashboard/AppointmentsPanel";
import { RecentActivity } from "../../components/dashboard/RecentActivity";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

const PROFILE_CHECKLIST_FIELDS = ["phone", "dateOfBirth", "bloodGroup", "height", "weight", "profileImage"] as const;

const healthInsights = [
  {
    title: "Stay Consistent",
    body: "Taking medicines at the same time each day helps build a routine and improves adherence.",
  },
  {
    title: "Keep Moving",
    body: "Even a short daily walk can support circulation and overall wellbeing.",
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const formatUpcomingDay = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateKey = new Date(date);
  dateKey.setHours(0, 0, 0, 0);

  if (dateKey.getTime() === today.getTime()) return "Today";
  if (dateKey.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [todayMedicines, setTodayMedicines] = useState<TodayMedicine[]>([]);
  const [adherenceStats, setAdherenceStats] = useState<AdherenceStats | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentActivity, setRecentActivity] = useState<TimelineEvent[]>([]);
  const [prescriptionsTotal, setPrescriptionsTotal] = useState(0);
  const [renewalsPending, setRenewalsPending] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    authService
      .whoami()
      .then((freshUser) => {
        updateUser(freshUser);
        if (freshUser.role === "admin") {
          router.replace("/admin");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });

    Promise.all([
      medicineService.getTodayMedicines(),
      medicineService.getAdherenceStats(),
      appointmentService.getAllAppointments(),
      timelineService.getTimeline({ pageSize: 5 }),
      prescriptionService.getAllPrescriptions(),
      profileService.getProfile(),
    ])
      .then(([medicines, stats, appointments, activity, prescriptions, profile]) => {
        setTodayMedicines(medicines);
        setAdherenceStats(stats);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        setUpcomingAppointments(
          appointments
            .filter((a) => a.status === "scheduled" && new Date(a.appointmentDate) >= startOfToday)
            .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
            .slice(0, 2)
        );

        setRecentActivity(activity.items);

        setPrescriptionsTotal(prescriptions.length);
        const soon = new Date();
        soon.setDate(soon.getDate() + 30);
        setRenewalsPending(
          prescriptions.filter((p) => p.expiryDate && new Date(p.expiryDate) <= soon).length
        );

        const completedFields = PROFILE_CHECKLIST_FIELDS.filter((field) => Boolean(profile[field])).length;
        setProfileCompletion(Math.round((completedFields / PROFILE_CHECKLIST_FIELDS.length) * 100));
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, router, updateUser]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  const todayTaken = todayMedicines.filter((m) => m.status === "taken").length;
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {getGreeting()}, {user?.username}!
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <HealthTip />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Today's Meds"
          value={`${todayTaken}/${todayMedicines.length}`}
          badge={todayMedicines.length > 0 ? "ACTIVE" : undefined}
          progressPercent={todayMedicines.length > 0 ? (todayTaken / todayMedicines.length) * 100 : 0}
        />
        <StatTile
          label="Weekly Adherence"
          value={`${adherenceStats?.weeklyAdherence ?? 0}%`}
          sublabel={`${adherenceStats?.medicinesTaken ?? 0}/${adherenceStats?.totalScheduled ?? 0} taken this week`}
        />
        <StatTile
          label="Upcoming Appt"
          value={nextAppointment ? formatUpcomingDay(nextAppointment.appointmentDate) : "None"}
          sublabel={
            nextAppointment
              ? `${nextAppointment.appointmentTime} · Dr. ${nextAppointment.doctorName}`
              : "No appointments scheduled"
          }
        />
        <StatTile
          label="Prescriptions"
          value={String(prescriptionsTotal)}
          sublabel={renewalsPending > 0 ? `${renewalsPending} renewal${renewalsPending === 1 ? "" : "s"} pending` : "All up to date"}
        />
      </div>

      <ProfileCompletion percent={profileCompletion} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div>
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h2>
            <QuickActions />
          </div>

          <div className="rounded-2xl bg-indigo-50 p-6 dark:bg-indigo-500/10">
            <div className="mb-4 flex items-center gap-2">
              <span aria-hidden="true">✨</span>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Health Insights</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {healthInsights.map((insight) => (
                <div key={insight.title} className="rounded-xl bg-white p-4 dark:bg-gray-800">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{insight.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{insight.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <AppointmentsPanel appointments={upcomingAppointments} />
          <RecentActivity events={recentActivity} />
        </div>
      </div>

      <Link
        href="/user/medicines"
        aria-label="Add medicine"
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg transition-colors hover:bg-blue-700"
      >
        +
      </Link>
    </div>
  );
}
