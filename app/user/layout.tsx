"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";

const isActivePath = (pathname: string, href: string) => {
  if (href === "/user") {
    return pathname === "/user";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, authReady, logout, updateUser } = useAuth();
  const [accessReady, setAccessReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authReady) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    let alive = true;
    authService
      .whoami()
      .then((freshUser) => {
        if (!alive) return;
        updateUser(freshUser);
        if (freshUser.role === "admin") {
          router.replace("/admin");
          return;
        }
        setAccessReady(true);
      })
      .catch(() => {
        if (!alive) return;
        logout();
        router.replace("/login");
      });

    return () => {
      alive = false;
    };
  }, [authReady, isAuthenticated, logout, router, updateUser]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const navItems = useMemo(
    () => [
      { href: "/user", label: "Dashboard", icon: "🏠" },
      { href: "/user/medicines", label: "Medicines", icon: "💊" },
      { href: "/user/reminders", label: "Reminders", icon: "⏰" },
      { href: "/user/prescriptions", label: "Prescriptions", icon: "📄" },
      { href: "/user/appointments", label: "Appointments", icon: "📅" },
      { href: "/user/reports", label: "Reports & Insights", icon: "📈" },
      { href: "/user/timeline", label: "Health Timeline", icon: "🕒" },
      { href: "/user/ai", label: "AI Assistant", icon: "🤖" },
    ],
    []
  );

  const secondaryNavItems = useMemo(
    () => [
      { href: "/user/profile", label: "Update Profile", icon: "👤" },
      { href: "/user/password", label: "Change Password", icon: "🔒" },
    ],
    []
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!authReady || !isAuthenticated || !accessReady) {
    return (
      <div className="user-shell loading">
        <div className="center-card">
          <div className="spinner" />
          <p>Loading your dashboard...</p>
        </div>
        <style jsx>{`
          .user-shell.loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f1f5f9;
            color: #1e293b;
            font-family: "Segoe UI", system-ui, sans-serif;
          }

          .center-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            padding: 2rem;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
          }

          .spinner {
            width: 2rem;
            height: 2rem;
            border: 3px solid #e2e8f0;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActivePath(pathname, item.href) ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
          <div className="nav-divider"></div>
          {secondaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActivePath(pathname, item.href) ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
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

        <main className="dashboard-content">{children}</main>
      </div>

      <div className={`overlay ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)}></div>

      <style jsx>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .dashboard-root {
          min-height: 100vh;
          display: flex;
          font-family: "Segoe UI", system-ui, sans-serif;
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

        .logo span {
          color: #2563eb;
        }

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

        .nav-icon {
          font-size: 1.25rem;
        }

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

        .logout-btn:hover {
          background: #fee2e2;
        }

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

        .user-avatar span {
          font-size: 1.25rem;
        }

        .dashboard-content {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .overlay.active {
          display: block;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .close-sidebar {
            display: block;
          }

          .main-content {
            margin-left: 0;
          }

          .menu-btn {
            display: block;
          }

          .dashboard-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
