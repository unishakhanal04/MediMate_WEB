"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";
import { medicineService, TodayMedicine, AdherenceStats } from "../../services/medicine.service";
import { reportsService, RefillAlert } from "../../services/reports.service";
import { appointmentService } from "../../services/appointment.service";
import { Appointment } from "../../types/appointment.types";
import { timelineService } from "../../services/timeline.service";
import { TimelineEvent, TimelineEventType } from "../../types/timeline.types";

const timelineIconFor: Record<TimelineEventType, string> = {
  medicine_added: "💊",
  medicine_taken: "✅",
  medicine_skipped: "⏭️",
  medicine_missed: "⚠️",
  prescription_uploaded: "📄",
  appointment: "📅",
  ai_conversation: "💬",
  profile_updated: "👤",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [todayMedicines, setTodayMedicines] = useState<TodayMedicine[]>([]);
  const [adherenceStats, setAdherenceStats] = useState<AdherenceStats | null>(null);
  const [refillAlerts, setRefillAlerts] = useState<RefillAlert[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentActivity, setRecentActivity] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      // Fetch fresh user data from backend
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

      // Fetch dashboard data
      Promise.all([
        medicineService.getTodayMedicines(),
        medicineService.getAdherenceStats(),
        reportsService.getRefillAlerts(),
        appointmentService.getAllAppointments(),
        timelineService.getTimeline({ pageSize: 5 }),
      ])
        .then(([medicines, stats, alerts, appointments, activity]) => {
          setTodayMedicines(medicines);
          setAdherenceStats(stats);
          setRefillAlerts(alerts);

          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);
          setUpcomingAppointments(
            appointments
              .filter((a) => a.status === "scheduled" && new Date(a.appointmentDate) >= startOfToday)
              .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
              .slice(0, 3)
          );

          setRecentActivity(activity.items);
        })
        .catch((err) => {
          console.error("Failed to fetch dashboard data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isAuthenticated, router, updateUser]);

  const handleTakeMedicine = async (medicineId: string, scheduledTime: string) => {
    try {
      await medicineService.markAsTaken(medicineId, scheduledTime);
      // Refresh data
      const [medicines, stats] = await Promise.all([
        medicineService.getTodayMedicines(),
        medicineService.getAdherenceStats(),
      ]);
      setTodayMedicines(medicines);
      setAdherenceStats(stats);
    } catch (error) {
      console.error("Failed to mark medicine as taken:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: 1rem;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e2e8f0;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          p {
            color: #64748b;
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="greeting">
        <h1>Hello, {user?.username}! 👋</h1>
        <p>Welcome back to your health dashboard</p>
      </div>

      {refillAlerts.length > 0 && (
        <div className="alerts-section">
          {refillAlerts.map((alert) => (
            <div key={alert._id} className="alert-card alert-warning">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <h3>{alert.name} Refill Needed</h3>
                <p>
                  {alert.dosage} · {alert.quantity} left (refill at {alert.refillThreshold})
                </p>
              </div>
              <Link href="/user/medicines" className="alert-action">
                Refill Now
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Weekly Adherence</h3>
            <div className="stat-value">{adherenceStats?.weeklyAdherence || 0}%</div>
            <p className="stat-label">Medication completion rate</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💊</div>
          <div className="stat-content">
            <h3>Medicines Taken</h3>
            <div className="stat-value">{adherenceStats?.medicinesTaken || 0}/{adherenceStats?.totalScheduled || 0}</div>
            <p className="stat-label">This week</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>Streak</h3>
            <div className="stat-value">{adherenceStats?.streak || 0}</div>
            <p className="stat-label">Days in a row</p>
          </div>
        </div>
      </div>

      <div className="today-medicines">
        <div className="section-header">
          <h2>Today&apos;s Medicines</h2>
          <Link href="/user/medicines" className="view-all">View All</Link>
        </div>
        <div className="medicines-list">
          {todayMedicines.length === 0 ? (
            <div className="no-medicines">
              <p>No medicines scheduled for today</p>
            </div>
          ) : (
            todayMedicines.map((medicine) => (
              <div key={`${medicine._id}-${medicine.time}`} className={`medicine-item ${medicine.status}`}>
                <div className="medicine-info">
                  <span className="medicine-name">{medicine.name} {medicine.dosage}</span>
                  <span className="medicine-time">{medicine.time}</span>
                </div>
                {medicine.status === "taken" ? (
                  <span className="medicine-status taken">✓ Taken</span>
                ) : medicine.status === "pending" ? (
                  <button
                    className="medicine-action"
                    onClick={() => handleTakeMedicine(medicine._id, medicine.time)}
                  >
                    Take Now
                  </button>
                ) : (
                  <span className="medicine-status pending">{medicine.status}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-columns">
        <div className="upcoming-appointments">
          <div className="section-header">
            <h2>Upcoming Appointments</h2>
            <Link href="/user/appointments" className="view-all">View All</Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div className="no-medicines">
              <p>No upcoming appointments scheduled</p>
            </div>
          ) : (
            <div className="appointments-mini-list">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-mini-item">
                  <div className="medicine-info">
                    <span className="medicine-name">{appointment.purpose}</span>
                    <span className="medicine-time">
                      {new Date(appointment.appointmentDate).toLocaleDateString()} · {appointment.appointmentTime}
                    </span>
                  </div>
                  {appointment.doctorName && (
                    <span className="appointment-mini-doctor">{appointment.doctorName}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="recent-activity">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link href="/user/timeline" className="view-all">View All</Link>
          </div>
          {recentActivity.length === 0 ? (
            <div className="no-medicines">
              <p>No recent activity yet</p>
            </div>
          ) : (
            <div className="activity-mini-list">
              {recentActivity.map((entry) => (
                <div key={entry.id} className="activity-mini-item">
                  <span className="activity-icon">{timelineIconFor[entry.type]}</span>
                  <div className="medicine-info">
                    <span className="medicine-name">{entry.title}</span>
                    <span className="medicine-time">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link href="/user/prescriptions" className="action-card">
            <span className="action-icon">📤</span>
            <span className="action-label">Upload</span>
          </Link>
          <Link href="/user/medicines" className="action-card">
            <span className="action-icon">➕</span>
            <span className="action-label">Add</span>
          </Link>
          <Link href="/user/ai" className="action-card">
            <span className="action-icon">🤖</span>
            <span className="action-label">AI Chat</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .greeting h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .greeting p {
          font-size: 0.95rem;
          color: #64748b;
        }

        .alerts-section {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .alert-card {
          flex: 1;
          min-width: 260px;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .alert-warning {
          background: #fffbeb;
          border-color: #fcd34d;
        }

        .alert-icon { font-size: 1.5rem; }

        .alert-content { flex: 1; }

        .alert-content h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 0.25rem;
        }

        .alert-content p {
          font-size: 0.85rem;
          color: #b45309;
        }

        .alert-action {
          padding: 0.5rem 1rem;
          background: #f59e0b;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-content h3 {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .today-medicines {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .view-all {
          color: #2563eb;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .medicines-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .medicine-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          background: #f8fafc;
        }

        .medicine-item.taken { background: #f0fdf4; }

        .medicine-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .medicine-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }

        .medicine-time {
          font-size: 0.8rem;
          color: #64748b;
        }

        .medicine-status {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .medicine-status.taken { color: #16a34a; }

        .medicine-status.pending { color: #f59e0b; }

        .medicine-action {
          padding: 0.5rem 1rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        .no-medicines {
          padding: 2rem;
          text-align: center;
          color: #64748b;
        }

        .dashboard-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .upcoming-appointments,
        .recent-activity {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .appointments-mini-list,
        .activity-mini-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .appointment-mini-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          background: #f8fafc;
          gap: 0.75rem;
        }

        .appointment-mini-doctor {
          font-size: 0.8rem;
          color: #64748b;
          white-space: nowrap;
        }

        .activity-mini-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          background: #f8fafc;
        }

        .activity-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .quick-actions h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .action-card:hover {
          border-color: #2563eb;
          background: #f0f9ff;
        }

        .action-icon { font-size: 2rem; }

        .action-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .actions-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr; }

          .actions-grid { grid-template-columns: repeat(3, 1fr); }

          .dashboard-columns { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .actions-grid { grid-template-columns: 1fr; }

          .stat-card { padding: 1rem; }

          .stat-value { font-size: 1.5rem; }
        }
      `}</style>
    </>
  );
}
