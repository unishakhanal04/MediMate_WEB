"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";

const isActivePath = (pathname: string, href: string) => {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, authReady, logout, updateUser } = useAuth();
  const [accessReady, setAccessReady] = useState(false);

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
        if (freshUser.role !== "admin") {
          router.replace("/dashboard");
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

  const navItems = useMemo(
    () => [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/products", label: "Manage Products" },
      { href: "/admin/categories", label: "Manage Categories" },
      { href: "/admin/orders", label: "Manage Orders" },
      { href: "/admin/users", label: "User Management" },
    ],
    []
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!authReady || !isAuthenticated || !accessReady) {
    return (
      <div className="admin-shell loading">
        <div className="center-card">
          <div className="spinner" />
          <p>Checking admin access...</p>
        </div>
        <style jsx>{`
          .admin-shell.loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f6fb;
            color: #1f2937;
            font-family: "Segoe UI", system-ui, sans-serif;
          }

          .center-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            padding: 2rem;
            background: #ffffff;
            border: 1px solid #dbe4f0;
            border-radius: 18px;
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
          }

          .spinner {
            width: 2rem;
            height: 2rem;
            border: 3px solid #dbe4f0;
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
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-title">Medimate</div>
            <div className="brand-subtitle">Admin Panel</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActivePath(pathname, item.href) ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-meta">
            <div className="admin-name">{user?.username || "Admin"}</div>
            <div className="admin-email">{user?.email}</div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-panel">{children}</main>

      <style jsx>{`
        .admin-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 260px 1fr;
          background: #f3f6fb;
          color: #1f2937;
          font-family: "Segoe UI", system-ui, sans-serif;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem;
          background: #ffffff;
          border-right: 1px solid #dbe4f0;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 2rem;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          font-weight: 700;
        }

        .brand-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .brand-subtitle {
          font-size: 0.8rem;
          color: #64748b;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-link {
          padding: 0.85rem 1rem;
          border-radius: 12px;
          color: #475569;
          font-weight: 600;
        }

        .nav-link.active,
        .nav-link:hover {
          background: #eaf1ff;
          color: #1d4ed8;
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .admin-meta {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          padding: 0.85rem 1rem;
          border: 1px solid #dbe4f0;
          border-radius: 14px;
          background: #ffffff;
        }

        .admin-name {
          font-weight: 700;
          color: #0f172a;
        }

        .admin-email {
          font-size: 0.85rem;
          color: #64748b;
          word-break: break-word;
        }

        .logout-button {
          border: none;
          border-radius: 12px;
          padding: 0.9rem 1rem;
          background: #fff1f2;
          color: #dc2626;
          font-weight: 700;
          cursor: pointer;
        }

        .main-panel {
          padding: 2rem;
        }

        @media (max-width: 1024px) {
          .admin-shell {
            grid-template-columns: 1fr;
          }

          .sidebar {
            border-right: none;
            border-bottom: 1px solid #dbe4f0;
          }
        }
      `}</style>
    </div>
  );
}

