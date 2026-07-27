"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../../schemas/auth.schema";
import { authService } from "../../../services/auth.service";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { GoogleButton } from "../../../components/auth/GoogleButton";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, authReady, user } = useAuth();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      portal: "user",
    },
  });

  useEffect(() => {
    if (authReady && isAuthenticated) {
      const destination = user?.role === "admin" ? "/admin" : "/user";
      router.replace(destination);
    }
  }, [authReady, isAuthenticated, router, user?.role]);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const result = await authService.login(data);
      login(result.token, result.user);
      toast.success("Signed in successfully! Redirecting...");
      const destination = result.user.role === "admin" ? "/admin" : "/user";
      setTimeout(() => router.replace(destination), 500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    setLoading(true);
    try {
      const result = await authService.loginWithGoogle(credential);
      login(result.token, result.user);
      toast.success("Signed in successfully! Redirecting...");
      const destination = result.user.role === "admin" ? "/admin" : "/user";
      setTimeout(() => router.replace(destination), 500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google sign-in failed";
      toast.error(message);
      setLoading(false);
    }
  };

  if (!authReady || isAuthenticated) {
    return null;
  }

  return (
    <div className="auth-root">
      <header className="nav">
        <Link href="/" className="logo">
          Medi<span>Mate</span>
        </Link>
        <Link href="/register" className="btn-signup">
          Signup
        </Link>
      </header>

      <main className="auth-main">
        <div className="form-card">
          <h1>Welcome Back</h1>
          <p className="form-sub">
            Your health data is protected with industry-standard security.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" autoComplete="off">
            <div className="field">
              <label>Login As</label>
              <div className="portal-toggle">
                <label className="portal-option">
                  <input type="radio" value="user" {...registerField("portal")} />
                  <span>User</span>
                </label>
                <label className="portal-option">
                  <input type="radio" value="admin" {...registerField("portal")} />
                  <span>Admin</span>
                </label>
              </div>
              {errors.portal && <span className="error-text">{errors.portal.message}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                {...registerField("email")}
                type="email"
                placeholder="name@example.com"
                autoComplete="off"
                defaultValue=""
              />
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  {...registerField("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  defaultValue=""
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "👁" : "👁"}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            <div className="field-row">
              <label className="remember-label">
                <input type="checkbox" {...registerField("rememberMe")} />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loader">
                  <span className="spinner" /> Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="divider">or continue with</div>
          <div className="social-row">
            <GoogleButton onCredential={handleGoogleCredential} disabled={loading} />
          </div>

          <p className="switch-link">
            Don&apos;t have an account? <Link href="/register">Register</Link>
          </p>

          <div className="secure-access-badge">
            <span className="badge-icon">🔒</span>
            <span>Secure medical access</span>
          </div>
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

        .portal-toggle {
          display: flex;
          gap: 1.5rem;
        }

        .portal-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #334155;
          cursor: pointer;
        }

        .portal-option input {
          width: 15px;
          height: 15px;
          cursor: pointer;
          accent-color: #2563eb;
        }

        .field-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -0.5rem;
        }

        .remember-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #475569;
          cursor: pointer;
        }

        .remember-label input {
          width: 15px;
          height: 15px;
          cursor: pointer;
          accent-color: #2563eb;
        }

        .forgot-link {
          font-size: 0.85rem;
          font-weight: 600;
          color: #2563eb;
        }

        .forgot-link:hover { text-decoration: underline; }

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

        .divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.5rem 0;
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .social-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .social-btn {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .social-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

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

        .secure-access-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding: 0.75rem 1rem;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          font-size: 0.8rem;
          color: #0369a1;
          font-weight: 500;
        }

        .secure-access-badge .badge-icon {
          font-size: 1rem;
        }

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
        :global(.dark) .remember-label {
          color: #9ca3af;
        }
        :global(.dark) .portal-option {
          color: #d1d5db;
        }
        :global(.dark) .eye-btn {
          color: #9ca3af;
        }
        :global(.dark) .divider {
          color: #6b7280;
        }
        :global(.dark) .divider::before,
        :global(.dark) .divider::after {
          background: #1f2937;
        }
        :global(.dark) .social-btn {
          background: #1f2937;
          border-color: #374151;
        }
        :global(.dark) .social-btn:hover {
          background: #374151;
          border-color: #4b5563;
        }
        :global(.dark) .secure-access-badge {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }
      `}</style>
    </div>
  );
}
