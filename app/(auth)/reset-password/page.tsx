"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "../../../schemas/auth.schema";
import { authService } from "../../../services/auth.service";
import { useToast } from "../../../contexts/ToastContext";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("This reset link is missing its token. Please request a new one.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reset password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <header className="nav">
        <Link href="/" className="logo">
          Medi<span>Mate</span>
        </Link>
        <Link href="/login" className="btn-signup">
          Login
        </Link>
      </header>

      <main className="auth-main">
        <div className="form-card">
          <h1>Reset your password</h1>
          <p className="form-sub">Choose a new password for your account.</p>

          {!token && (
            <p className="error-text field-error">
              This reset link is invalid or missing a token. Please request a new one from the{" "}
              <Link href="/forgot-password">forgot password</Link> page.
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" autoComplete="off">
            <div className="field">
              <label htmlFor="password">New Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  {...registerField("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  👁
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-wrap">
                <input
                  id="confirmPassword"
                  {...registerField("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Toggle confirm password visibility"
                >
                  👁
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword.message}</span>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={loading || !token}>
              {loading ? (
                <span className="btn-loader">
                  <span className="spinner" /> Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <p className="switch-link">
            <Link href="/login">Back to login</Link>
          </p>
        </div>
      </main>

      <style jsx>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #f1f5f9;
          color: #1e293b;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 3rem;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
        }

        .logo {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          text-decoration: none;
          letter-spacing: -0.5px;
        }

        .logo span { color: #2563eb; }

        .btn-signup {
          padding: 0.5rem 1.25rem;
          background: #2563eb;
          color: #fff;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          transition: background 0.2s;
        }

        .btn-signup:hover { background: #1d4ed8; }

        .auth-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }

        .form-card {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .form-card h1 {
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

        .field-error {
          display: block;
          margin-bottom: 1.5rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .field-error a {
          color: #2563eb;
          font-weight: 600;
        }

        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }

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

        .switch-link {
          text-align: center;
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 1.5rem;
        }

        .switch-link a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }

        .switch-link a:hover { text-decoration: underline; }

        .error-text {
          font-size: 0.75rem;
          color: #ef4444;
        }

        .btn-loader { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2.5px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .nav { padding: 1rem 1.5rem; }
        }

        :global(.dark) .auth-root {
          background: #030712;
          color: #f3f4f6;
        }
        :global(.dark) .nav,
        :global(.dark) .form-card {
          background: #111827;
          border-color: #1f2937;
        }
        :global(.dark) .logo,
        :global(.dark) .form-card h1 {
          color: #f9fafb;
        }
        :global(.dark) .form-sub,
        :global(.dark) .switch-link {
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
        :global(.dark) .field-error {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
