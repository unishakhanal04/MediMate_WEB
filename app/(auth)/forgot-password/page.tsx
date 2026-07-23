"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
  verifyOtpSchema,
  type VerifyOtpFormData,
} from "../../../schemas/auth.schema";
import { authService } from "../../../services/auth.service";
import { useToast } from "../../../contexts/ToastContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const {
    register: registerOtpField,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtpForm,
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const result = await authService.requestPasswordReset(data.email);
      toast.success(result.message);
      setEmail(data.email);
      setStep("otp");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (data: VerifyOtpFormData) => {
    setLoading(true);
    try {
      const result = await authService.verifyResetOtp(email, data.otp);
      toast.success(result.message);
      router.push(`/reset-password?token=${encodeURIComponent(result.resetToken)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid or expired code";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const result = await authService.requestPasswordReset(email);
      toast.success(result.message);
      resetOtpForm({ otp: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setResending(false);
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
          {step === "otp" ? (
            <>
              <h1>Enter verification code</h1>
              <p className="form-sub">
                We&apos;ve sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.
              </p>

              <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="auth-form" autoComplete="off">
                <div className="field">
                  <label htmlFor="otp">Verification Code</label>
                  <input
                    id="otp"
                    {...registerOtpField("otp")}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    autoComplete="off"
                    className="otp-input"
                  />
                  {otpErrors.otp && <span className="error-text">{otpErrors.otp.message}</span>}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="btn-loader">
                      <span className="spinner" /> Verifying...
                    </span>
                  ) : (
                    "Verify Code"
                  )}
                </button>
              </form>

              <p className="switch-link">
                Didn&apos;t get a code?{" "}
                <button type="button" className="link-btn" onClick={handleResend} disabled={resending}>
                  {resending ? "Sending..." : "Resend code"}
                </button>
              </p>
              <p className="switch-link">
                <button type="button" className="link-btn" onClick={() => setStep("email")}>
                  Use a different email
                </button>
              </p>
            </>
          ) : (
            <>
              <h1>Forgot your password?</h1>
              <p className="form-sub">
                Enter the email address associated with your account and we&apos;ll send you a verification code.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="auth-form" autoComplete="off">
                <div className="field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    {...registerField("email")}
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="off"
                  />
                  {errors.email && <span className="error-text">{errors.email.message}</span>}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="btn-loader">
                      <span className="spinner" /> Sending...
                    </span>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>

              <p className="switch-link">
                Remembered your password? <Link href="/login">Login</Link>
              </p>
            </>
          )}
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

        .otp-input {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 8px;
        }

        .link-btn {
          background: none;
          border: none;
          padding: 0;
          color: #2563eb;
          font-weight: 600;
          font-size: inherit;
          cursor: pointer;
        }

        .link-btn:hover { text-decoration: underline; }
        .link-btn:disabled { opacity: 0.6; cursor: not-allowed; }

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
        :global(.dark) .link-btn {
          color: #60a5fa;
        }
      `}</style>
    </div>
  );
}
