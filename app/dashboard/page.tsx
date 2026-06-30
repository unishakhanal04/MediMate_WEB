"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    }
  }, [isAuthenticated, router, updateUser]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-root">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">Medi<span>Mate</span></div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item active">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link href="/dashboard/medicines" className="nav-item">
            <span className="nav-icon">💊</span>
            <span className="nav-text">Medicines</span>
          </Link>
          <Link href="/dashboard/ai" className="nav-item">
            <span className="nav-icon">🤖</span>
            <span className="nav-text">AI Assistant</span>
          </Link>
          <Link href="/dashboard/reminders" className="nav-item">
            <span className="nav-icon">⏰</span>
            <span className="nav-text">Reminders</span>
          </Link>
          <div className="nav-divider"></div>
          <Link href="/dashboard/profile" className="nav-item">
            <span className="nav-icon">👤</span>
            <span className="nav-text">Update Profile</span>
          </Link>
          <Link href="/dashboard/password" className="nav-item">
            <span className="nav-icon">🔒</span>
            <span className="nav-text">Change Password</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div className="header-right">
            <button className="notification-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>
            <div className="user-avatar">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" />
              ) : (
                <span>👤</span>
              )}
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="greeting">
            <h1>Hello, {user?.username}! 👋</h1>
            <p>Welcome back to your health dashboard</p>
          </div>

          <div className="alerts-section">
            <div className="alert-card alert-warning">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <h3>Prescription Refill Needed</h3>
                <p>Your blood pressure medication is running low. Refill by tomorrow.</p>
              </div>
              <button className="alert-action">Refill Now</button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Weekly Adherence</h3>
                <div className="stat-value">94%</div>
                <p className="stat-label">Medication completion rate</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💊</div>
              <div className="stat-content">
                <h3>Medicines Taken</h3>
                <div className="stat-value">12/14</div>
                <p className="stat-label">This week</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <h3>Reminders Set</h3>
                <div className="stat-value">5</div>
                <p className="stat-label">Active reminders</p>
              </div>
            </div>
          </div>

          <div className="today-medicines">
            <div className="section-header">
              <h2>Today&apos;s Medicines</h2>
              <Link href="/dashboard/medicines" className="view-all">View All</Link>
            </div>
            <div className="medicines-list">
              <div className="medicine-item taken">
                <div className="medicine-info">
                  <span className="medicine-name">Metformin 500mg</span>
                  <span className="medicine-time">8:00 AM</span>
                </div>
                <span className="medicine-status taken">✓ Taken</span>
              </div>
              <div className="medicine-item taken">
                <div className="medicine-info">
                  <span className="medicine-name">Lisinopril 10mg</span>
                  <span className="medicine-time">8:00 AM</span>
                </div>
                <span className="medicine-status taken">✓ Taken</span>
              </div>
              <div className="medicine-item pending">
                <div className="medicine-info">
                  <span className="medicine-name">Vitamin D3 1000IU</span>
                  <span className="medicine-time">2:00 PM</span>
                </div>
                <button className="medicine-action">Take Now</button>
              </div>
              <div className="medicine-item pending">
                <div className="medicine-info">
                  <span className="medicine-name">Atorvastatin 20mg</span>
                  <span className="medicine-time">9:00 PM</span>
                </div>
                <span className="medicine-status pending">Pending</span>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-card">
                <span className="action-icon">�</span>
                <span className="action-label">Upload</span>
              </button>
              <button className="action-card">
                <span className="action-icon">➕</span>
                <span className="action-label">Add</span>
              </button>
              <button className="action-card">
                <span className="action-icon">🤖</span>
                <span className="action-label">AI Chat</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className={`overlay ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)}></div>

      <style jsx>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dashboard-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #f1f5f9;
          color: #1e293b;
        }

        .sidebar {
          width: 260px;
          background: #fff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .logo span { color: #2563eb; }

        .close-sidebar {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          color: #64748b;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .nav-item.active {
          background: #eff6ff;
          color: #2563eb;
        }

        .nav-icon { font-size: 1.25rem; }

        .nav-text {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .nav-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 0.5rem 0;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          background: #fef2f2;
          color: #dc2626;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .logout-btn:hover { background: #fee2e2; }

        .main-content {
          flex: 1;
          margin-left: 260px;
          display: flex;
          flex-direction: column;
        }

        .top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .notification-btn {
          position: relative;
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #ef4444;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.1rem 0.35rem;
          border-radius: 10px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-avatar span { font-size: 1.25rem; }

        .dashboard-content {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

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
        }

        .alert-card {
          flex: 1;
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

        .overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .overlay.active { display: block; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .actions-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open { transform: translateX(0); }

          .close-sidebar { display: block; }

          .main-content { margin-left: 0; }

          .menu-btn { display: block; }

          .stats-grid { grid-template-columns: 1fr; }

          .actions-grid { grid-template-columns: repeat(3, 1fr); }

          .dashboard-content { padding: 1rem; }
        }

        @media (max-width: 480px) {
          .actions-grid { grid-template-columns: 1fr; }

          .stat-card { padding: 1rem; }

          .stat-value { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
