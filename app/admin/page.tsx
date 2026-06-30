"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Use the left menu to manage users and other admin sections.</p>
        </div>
        <Link className="primary" href="/admin/users">
          Go to User Management
        </Link>
      </header>

      <section className="grid">
        <div className="card">
          <h2>User Management</h2>
          <p>View, search, create, edit, delete users, and check user details.</p>
          <Link href="/admin/users">Open Users</Link>
        </div>
        <div className="card">
          <h2>Manage Products</h2>
          <p>Manage your product catalog here.</p>
          <Link href="/admin/products">Open Products</Link>
        </div>
        <div className="card">
          <h2>Manage Categories</h2>
          <p>Manage product categories here.</p>
          <Link href="/admin/categories">Open Categories</Link>
        </div>
        <div className="card">
          <h2>Manage Orders</h2>
          <p>Manage customer orders here.</p>
          <Link href="/admin/orders">Open Orders</Link>
        </div>
      </section>

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
          background: #ffffff;
          border: 1px solid #dbe4f0;
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
        }

        h1 {
          margin: 0 0 0.35rem;
          font-size: 2rem;
          color: #0f172a;
        }

        p {
          margin: 0;
          color: #64748b;
        }

        .primary {
          padding: 0.85rem 1.1rem;
          border-radius: 14px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          font-weight: 700;
          white-space: nowrap;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }

        .card {
          background: #ffffff;
          border: 1px solid #dbe4f0;
          border-radius: 20px;
          padding: 1.25rem;
        }

        .card h2 {
          margin: 0 0 0.35rem;
          color: #0f172a;
          font-size: 1.1rem;
        }

        .card p {
          margin: 0 0 0.75rem;
          color: #64748b;
        }

        .card a {
          color: #1d4ed8;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
