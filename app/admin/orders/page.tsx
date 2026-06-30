"use client";

export default function AdminOrdersPage() {
  return (
    <div className="card">
      <h1>Manage Orders</h1>
      <p>Use this page to manage order records.</p>
      <style jsx>{`
        .card {
          background: #ffffff;
          border: 1px solid #dbe4f0;
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
          font-family: "Segoe UI", system-ui, sans-serif;
          color: #1f2937;
        }

        h1 {
          margin: 0 0 0.5rem;
          color: #0f172a;
        }

        p {
          margin: 0;
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
