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
            <div className="doctor-placeholder">
              <div className="hero-orbit">
                <div className="hero-orbit-item hero-orbit-pos-0">
                  <span className="hero-icon" title="Medicines">💊</span>
                </div>
                <div className="hero-orbit-item hero-orbit-pos-72">
                  <span className="hero-icon" title="Appointments">📅</span>
                </div>
                <div className="hero-orbit-item hero-orbit-pos-144">
                  <span className="hero-icon" title="Reminders">⏰</span>
                </div>
                <div className="hero-orbit-item hero-orbit-pos-216">
                  <span className="hero-icon" title="Notifications">🔔</span>
                </div>
                <div className="hero-orbit-item hero-orbit-pos-288">
                  <span className="hero-icon" title="Reports">📊</span>
                </div>
                <div className="hero-orbit-center">
                  <span className="hero-icon hero-orbit-center-icon" title="Health tracking">❤️</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-text">
            <h2>Empathetic Care. Precisely Delivered.</h2>
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
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #334155;
        }

        .nav-login a {
          color: #fff;
          background: #2563eb;
          padding: 0.5rem 1.15rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
          transition: background 0.2s, transform 0.2s;
        }

        .nav-login a:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .auth-main {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .hero-panel {
          background: linear-gradient(160deg, #bfdbfe 0%, #eff6ff 100%);
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
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 16px 44px rgba(37, 99, 235, 0.3);
        }

        .hero-orbit {
          position: relative;
          width: 280px;
          height: 280px;
          animation: hero-orbit-spin 16s linear infinite;
        }

        .hero-orbit-item {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 92px;
          height: 92px;
          margin: -46px 0 0 -46px;
        }

        .hero-orbit-pos-0   { transform: rotate(0deg)   translate(130px) rotate(0deg); }
        .hero-orbit-pos-72  { transform: rotate(72deg)  translate(130px) rotate(-72deg); }
        .hero-orbit-pos-144 { transform: rotate(144deg) translate(130px) rotate(-144deg); }
        .hero-orbit-pos-216 { transform: rotate(216deg) translate(130px) rotate(-216deg); }
        .hero-orbit-pos-288 { transform: rotate(288deg) translate(130px) rotate(-288deg); }

        .hero-icon {
          width: 100%;
          height: 100%;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.75rem;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15);
          animation: hero-icon-counter-spin 16s linear infinite;
        }

        .hero-orbit-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          margin: -50px 0 0 -50px;
        }

        .hero-orbit-center-icon {
          font-size: 3rem;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
          animation: hero-heart-tilt-spin 16s linear infinite;
        }

        @keyframes hero-orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes hero-heart-tilt-spin {
          from { transform: rotate(-15deg); }
          to { transform: rotate(-375deg); }
        }

        @keyframes hero-icon-counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-orbit, .hero-icon, .hero-orbit-center, .hero-orbit-center-icon {
            animation: none;
          }
        }

        .hero-text h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.5rem;
          letter-spacing: -0.3px;
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
        }

        :global(.dark) .auth-root {
          background: #030712;
          color: #f3f4f6;
        }
        :global(.dark) .nav,
        :global(.dark) .form-panel {
          background: #111827;
          border-color: #1f2937;
        }
        :global(.dark) .logo,
        :global(.dark) .form-card h1,
        :global(.dark) .hero-text h2 {
          color: #f9fafb;
        }
        :global(.dark) .nav-login,
        :global(.dark) .form-sub,
        :global(.dark) .terms-text {
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
        :global(.dark) .hero-panel {
          background: linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0.02) 100%);
        }
      `}</style>
    </div>
  );
}
