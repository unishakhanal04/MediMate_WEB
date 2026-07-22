"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../../../schemas/auth.schema";
import { authService } from "../../../services/auth.service";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { GoogleButton } from "../../../components/auth/GoogleButton";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, authReady, user, login } = useAuth();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      gender: undefined,
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  useEffect(() => {
    if (authReady && isAuthenticated) {
      const destination = user?.role === "admin" ? "/admin" : "/user";
      router.replace(destination);
    }
  }, [authReady, isAuthenticated, router, user?.role]);

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await authService.register(data);
      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
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
      toast.success("Account ready! Redirecting...");
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
        <p className="nav-login">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </header>

      <main className="auth-main">
        <div className="hero-panel">
          <div className="doctor-image">
            <div className="doctor-placeholder">👩‍⚕️</div>
          </div>
          <div className="hero-text">
            <h2>Empathetic Care. Precisely Delivered.</h2>
            <div className="feature-badges">
              <div className="feature-badge">
                <span className="badge-icon">🔒</span>
                <span>SECURE DATA</span>
              </div>
              <div className="feature-badge">
                <span className="badge-icon">🕐</span>
                <span>24/7 SUPPORT</span>
              </div>
              <div className="feature-badge">
                <span className="badge-icon">✨</span>
                <span>AI POWERED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-panel">
          <div className="form-card">
            <h1>Create your account</h1>
            <p className="form-sub">Join MediMate and take control of your health journey.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <div className="field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  {...registerField("username")}
                  type="text"
                  placeholder="Choose a username"
                  autoComplete="off"
                />
                {errors.username && <span className="error-text">{errors.username.message}</span>}
              </div>

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

              <div className="field">
                <label htmlFor="gender">Gender</label>
                <select id="gender" {...registerField("gender")} defaultValue="">
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span className="error-text">{errors.gender.message}</span>}
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
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
                    {showPassword ? "👁" : "👁"}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password.message}</span>}
              </div>

              <div className="field">
                <label htmlFor="confirmPassword">Confirm Password</label>
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
                    {showConfirm ? "👁": "👁"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword.message}</span>
                )}
              </div>

              <div className="field terms-field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...registerField("agreeToTerms")}
                  />
                  <span className="checkbox-text">
                    By creating an account, you agree to our{" "}
                    <Link href="#">Terms of Service</Link> and{" "}
                    <Link href="#">Privacy Policy</Link>.
                  </span>
                </label>
                {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms.message}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loader">
                    <span className="spinner" /> Creating Account...
                  </span>
                ) : (
                  <>
                    Create Account <span className="arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="divider">or continue with</div>
            <div className="social-row">
              <GoogleButton onCredential={handleGoogleCredential} disabled={loading} />
            </div>
          </div>
        </div>
      </main>

      <footer className="auth-footer">
        <div className="footer-brand">
          <span className="footer-logo">MediMate</span>
          <div className="social-icons">
            <span>𝕏</span>
            <span>in</span>
            <span>f</span>
            <span>◎</span>
          </div>
        </div>
        <div className="footer-links-grid">
          <div>
            <p className="footer-col-head">Services</p>
            <Link href="#">Cardiology</Link>
            <Link href="#">Neurology</Link>
            <Link href="#">Pediatrics</Link>
          </div>
          <div>
            <p className="footer-col-head">Support</p>
            <Link href="#">Help Center</Link>
            <Link href="#">Contact Us</Link>
          </div>
          <div>
            <p className="footer-col-head">Legal</p>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} MediMate. All rights reserved.</p>
      </footer>

      <style jsx>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #fff;
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

        .nav-login {
          font-size: 0.875rem;
          color: #64748b;
        }

        .nav-login a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }

        .nav-login a:hover { text-decoration: underline; }

        .auth-main {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .hero-panel {
          background: linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%);
          display: flex;
          flex-direction: column;
          padding: 3rem;
          justify-content: center;
        }

        .doctor-image {
          margin-bottom: 2rem;
        }

        .doctor-placeholder {
          width: 100%;
          max-width: 380px;
          aspect-ratio: 4/5;
          background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8rem;
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.15);
        }

        .hero-text h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.5rem;
          letter-spacing: -0.3px;
        }

        .feature-badges {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .feature-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #475569;
        }

        .badge-icon {
          width: 44px;
          height: 44px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          background: #fff;
          overflow-y: auto;
        }

        .form-card {
          width: 100%;
          max-width: 420px;
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
          margin-bottom: 1.75rem;
          line-height: 1.6;
        }

        .auth-form { display: flex; flex-direction: column; gap: 1rem; }

        .field { display: flex; flex-direction: column; gap: 0.4rem; }

        .field label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
        }

        .field input[type="text"],
        .field input[type="email"],
        .field input[type="password"],
        .field select {
          padding: 0.7rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #1e293b;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          width: 100%;
        }

        .field input:focus,
        .field select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .field input::placeholder { color: #94a3b8; }

        .field select:invalid {
          color: #94a3b8;
        }

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

        .terms-field {
          margin-top: 0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.5;
        }

        .checkbox-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          margin-top: 0.15rem;
          cursor: pointer;
          accent-color: #2563eb;
        }

        .checkbox-text {
          flex: 1;
        }

        .checkbox-text a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .checkbox-text a:hover {
          text-decoration: underline;
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover { background: #1d4ed8; }
        .submit-btn:disabled { opacity: 0.8; cursor: not-allowed; }

        .arrow { font-size: 1.1rem; }

        .divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.25rem 0;
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
          margin-bottom: 1.25rem;
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

        .terms-text {
          font-size: 0.75rem;
          color: #94a3b8;
          text-align: center;
          line-height: 1.5;
        }

        .terms-text a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .terms-text a:hover { text-decoration: underline; }

        .auth-footer {
          background: #fff;
          border-top: 1px solid #e2e8f0;
          padding: 2.5rem 3rem 1.5rem;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .footer-logo {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
        }

        .social-icons {
          display: flex;
          gap: 0.75rem;
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .footer-links-grid {
          display: flex;
          gap: 4rem;
          margin-bottom: 2rem;
        }

        .footer-links-grid > div {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-col-head {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 0.25rem;
        }

        .footer-links-grid a {
          font-size: 0.85rem;
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links-grid a:hover { color: #2563eb; }

        .footer-copy {
          font-size: 0.78rem;
          color: #94a3b8;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
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

        @media (max-width: 900px) {
          .auth-main { grid-template-columns: 1fr; }
          .hero-panel { display: none; }
          .form-panel { padding: 2rem 1.5rem; }
        }

        @media (max-width: 768px) {
          .nav { padding: 1rem 1.5rem; }
          .auth-footer { padding: 2rem 1.5rem 1rem; }
          .footer-links-grid { gap: 2rem; flex-wrap: wrap; }
        }

        :global(.dark) .auth-root {
          background: #030712;
          color: #f3f4f6;
        }
        :global(.dark) .nav,
        :global(.dark) .form-panel,
        :global(.dark) .auth-footer {
          background: #111827;
          border-color: #1f2937;
        }
        :global(.dark) .logo,
        :global(.dark) .form-card h1,
        :global(.dark) .hero-text h2,
        :global(.dark) .footer-logo {
          color: #f9fafb;
        }
        :global(.dark) .nav-login,
        :global(.dark) .form-sub,
        :global(.dark) .terms-text,
        :global(.dark) .footer-links-grid a,
        :global(.dark) .footer-copy,
        :global(.dark) .social-icons {
          color: #9ca3af;
        }
        :global(.dark) .field label {
          color: #d1d5db;
        }
        :global(.dark) .field input,
        :global(.dark) .field select {
          background: #1f2937;
          border-color: #374151;
          color: #f3f4f6;
        }
        :global(.dark) .eye-btn {
          color: #9ca3af;
        }
        :global(.dark) .checkbox-label,
        :global(.dark) .checkbox-text {
          color: #9ca3af;
        }
        :global(.dark) .feature-badge {
          color: #d1d5db;
        }
        :global(.dark) .badge-icon {
          background: #1f2937;
        }
        :global(.dark) .hero-panel {
          background: linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0.02) 100%);
        }
        :global(.dark) .footer-copy {
          border-color: #1f2937;
        }
      `}</style>
    </div>
  );
}
