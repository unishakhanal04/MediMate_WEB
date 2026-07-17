"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { authService } from "../../../services/auth.service";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function PasswordPage() {
  const router = useRouter();
  const { isAuthenticated, authReady } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (!authReady) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    authService
      .whoami()
      .then((freshUser) => {
        if (freshUser.role === "admin") {
          router.replace("/admin");
        }
      })
      .catch(() => {
        // ignore
      });
  }, [authReady, isAuthenticated, router]);

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      await authService.updatePassword(data.currentPassword, data.newPassword);
      toast.success("Password updated successfully");
      reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Password update failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!authReady || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="password-center">
        <div className="password-card">
          <h1>Change Password</h1>
          <p className="form-sub">Update your password to keep your account secure.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="password-form">
            <div className="field">
              <label htmlFor="currentPassword">Current Password</label>
              <div className="password-wrap">
                <input
                  id="currentPassword"
                  {...registerField("currentPassword")}
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowCurrent(!showCurrent)}
                  aria-label="Toggle password visibility"
                >
                  {showCurrent ? "👁" : "👁"}
                </button>
              </div>
              {errors.currentPassword && <span className="error-text">{errors.currentPassword.message}</span>}
            </div>

            <div className="field">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-wrap">
                <input
                  id="newPassword"
                  {...registerField("newPassword")}
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowNew(!showNew)}
                  aria-label="Toggle password visibility"
                >
                  {showNew ? "👁" : "👁"}
                </button>
              </div>
              {errors.newPassword && <span className="error-text">{errors.newPassword.message}</span>}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-wrap">
                <input
                  id="confirmPassword"
                  {...registerField("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Toggle password visibility"
                >
                  {showConfirm ? "👁" : "👁"}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .password-center {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          min-height: 60vh;
        }

        .password-card {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .password-card h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
          letter-spacing: -0.3px;
        }

        .form-sub {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .password-form { display: flex; flex-direction: column; gap: 1.25rem; }

        .field { display: flex; flex-direction: column; gap: 0.5rem; }

        .field label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
        }

        .field input {
          padding: 0.75rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #1e293b;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          width: 100%;
        }

        .field input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .field input::placeholder { color: #94a3b8; }

        .password-wrap { position: relative; }

        .password-wrap input { padding-right: 2.75rem; }

        .eye-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          color: #94a3b8;
          padding: 0;
        }

        .error-text {
          font-size: 0.75rem;
          color: #ef4444;
        }

        .submit-btn {
          margin-top: 0.5rem;
          padding: 0.8rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover { background: #1d4ed8; }
        .submit-btn:disabled { opacity: 0.8; cursor: not-allowed; }

        @media (max-width: 768px) {
          .password-card { padding: 2rem 1.5rem; }
        }

        :global(.dark) .password-card {
          background: #111827;
          border-color: #1f2937;
        }
        :global(.dark) .password-card h1 {
          color: #f9fafb;
        }
        :global(.dark) .form-sub {
          color: #9ca3af;
        }
        :global(.dark) .field label {
          color: #d1d5db;
        }
        :global(.dark) .field input {
          background: #1f2937;
          border-color: #374151;
          color: #f3f4f6;
        }
        :global(.dark) .eye-btn {
          color: #9ca3af;
        }
      `}</style>
    </>
  );
}
