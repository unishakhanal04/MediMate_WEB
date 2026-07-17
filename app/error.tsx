"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="status-root">
      <div className="status-card">
        <Link href="/" className="logo">
          Medi<span>Mate</span>
        </Link>
        <div className="status-icon">⚠️</div>
        <h1>Something went wrong</h1>
        <p className="status-body">
          An unexpected error occurred. You can try again, or head back to the homepage.
        </p>
        <div className="status-actions">
          <button className="btn-solid" onClick={() => unstable_retry()}>
            Try Again
          </button>
          <Link href="/" className="btn-outline">
            Back to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .status-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #f1f5f9;
        }

        .status-card {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border-radius: 16px;
          padding: 3rem 2.5rem;
          text-align: center;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        :global(.logo) {
          display: inline-block;
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          text-decoration: none;
          letter-spacing: -0.5px;
          margin-bottom: 2rem;
        }

        :global(.logo span) { color: #2563eb; }

        .status-icon {
          font-size: 3rem;
          margin-bottom: 0.75rem;
        }

        h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }

        .status-body {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .status-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        :global(.btn-solid) {
          padding: 0.75rem 1.5rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        :global(.btn-solid:hover) { background: #1d4ed8; }

        :global(.btn-outline) {
          padding: 0.75rem 1.5rem;
          background: #fff;
          color: #2563eb;
          border: 1.5px solid #2563eb;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: background 0.2s;
        }

        :global(.btn-outline:hover) { background: #f0f9ff; }
      `}</style>
    </div>
  );
}
