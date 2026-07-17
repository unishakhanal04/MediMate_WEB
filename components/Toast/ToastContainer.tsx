"use client";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

const icons: Record<ToastType, string> = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => onDismiss(toast.id)}
        >
          <span className="toast-icon">{icons[toast.type]}</span>
          {toast.message}
        </div>
      ))}

      <style jsx>{`
        .toast-stack {
          position: fixed;
          top: 1.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          align-items: center;
        }

        .toast {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1.5rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          animation: slideDown 0.3s ease;
          background: #fff;
          cursor: pointer;
          max-width: min(90vw, 420px);
          text-align: center;
        }

        .toast-success {
          border: 1.5px solid #22c55e;
          color: #15803d;
        }

        .toast-error {
          border: 1.5px solid #ef4444;
          color: #b91c1c;
        }

        .toast-warning {
          border: 1.5px solid #f59e0b;
          color: #92400e;
        }

        .toast-info {
          border: 1.5px solid #2563eb;
          color: #1d4ed8;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-0.75rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
