"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast("error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);
    showToast("success", "Account created successfully! Redirecting to login...");
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <div className="auth-root">
      {/* ── TOAST ── */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "✅" : "❌"}</span>
          {toast.message}
        </div>
      )}

      {/* ── NAV ── */}
      <header className="nav">
        <Link href="/" className="logo">
          Medi<span>mate</span>
        </Link>
        <nav className="nav-links">
          <Link href="#">About</Link>
          <Link href="#">How it Works</Link>
        </nav>
        <div className="nav-cta">
          <Link href="/login" className="btn-ghost">Login</Link>
          <Link href="/register" className="btn-primary">Signup</Link>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="auth-main">
        {/* Left hero panel */}
        <div className="hero-panel">
          <div className="hero-content">
            <p className="hero-eyebrow">START YOUR JOURNEY TODAY</p>
            <h1 className="hero-heading">
              Start your journey to<br />better health<br />management.
            </h1>
            <p className="hero-sub">
              Medimate helps you track medications, appointments,<br />
              reminders, and get personalized medical care and tips.
            </p>
            <div className="hero-badges">
              <span className="badge">🔒 Private &amp; Secure</span>
              <span className="badge">🩺 Shared Care</span>
            </div>
          </div>
          {/* Bottom feature cards */}
          <div className="hero-cards">
            <div className="hero-card expert">
              <div className="card-icon">👨‍⚕️</div>
              <p className="card-title">Expert Care</p>
              <p className="card-desc">Connect with leading medical experts and partners worldwide.</p>
            </div>
            <div className="hero-card sync">
              <div className="card-icon">🔄</div>
              <p className="card-title">Always Synced</p>
              <p className="card-desc">Your information syncs across multiple devices in real time.</p>
            </div>
            <div className="hero-card privacy">
              <div className="card-icon">🛡️</div>
              <p className="card-title">Data Privacy</p>
              <p className="card-desc">Your data belongs to you — private, secure, and encrypted.</p>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="form-panel">
          <div className="form-card">
            <h2>Create Account</h2>
            <p className="form-sub">Enter your details to get started today.</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field">
                <label htmlFor="fullName">FULL NAME</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="email">EMAIL ADDRESS</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="password">PASSWORD</label>
                  <div className="password-wrap">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                  <div className="password-wrap">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label="Toggle confirm password"
                    >
                      {showConfirm ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                />
                <span>
                  I agree to the{" "}
                  <Link href="#" className="inline-link">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="#" className="inline-link">Privacy Policy</Link>
                </span>
              </label>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loader">
                    <span className="spinner" /> Creating Account...
                  </span>
                ) : (
                  "Create My Account"
                )}
              </button>
            </form>

            <div className="divider"><span>or continue with</span></div>

            <div className="social-row">
              <button className="social-btn">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="social-btn">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M18 9a9 9 0 10-10.406 8.891v-6.29H5.31V9h2.284V7.017c0-2.255 1.343-3.501 3.4-3.501.984 0 2.014.175 2.014.175v2.214h-1.134c-1.118 0-1.467.694-1.467 1.406V9h2.496l-.399 2.601H10.41v6.29A9.002 9.002 0 0018 9z"/>
                </svg>
                Facebook
              </button>
            </div>

            <p className="switch-link">
              Already have an account?{" "}
              <Link href="/login">Log in</Link>
            </p>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="auth-footer">
        <span className="footer-logo">Medimate</span>
        <div className="footer-links">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
          <Link href="#">Accessibility</Link>
          <Link href="#">Contact</Link>
        </div>
      </footer>

      <style jsx>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #f8fafc;
          color: #1e293b;
        }

        /* NAV */
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2.5rem;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .logo {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1e293b;
          text-decoration: none;
          letter-spacing: -0.5px;
        }
        .logo span { color: #2563eb; }
        .nav-links { display: flex; gap: 1.5rem; }
        .nav-links a {
          text-decoration: none;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: #1e293b; }
        .nav-cta { display: flex; align-items: center; gap: 0.75rem; }
        .btn-ghost {
          padding: 0.4rem 1rem;
          border: 1px solid #2563eb;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
          background: #2563eb;
          transition: background 0.2s;
        }
        .btn-ghost:hover { background: #1d4ed8; border-color: #1d4ed8; }
        .btn-primary {
          padding: 0.4rem 1.1rem;
          background: #2563eb;
          color: #fff;
          border: 1px solid #2563eb;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn-primary:hover { background: #1d4ed8; border-color: #1d4ed8; }

        /* MAIN */
        .auth-main {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* HERO */
        .hero-panel {
          background: linear-gradient(160deg, #0f2645 0%, #1d4ed8 60%, #2563eb 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 4rem 3.5rem 0;
          position: relative;
          overflow: hidden;
        }
        .hero-panel::before {
          content: '';
          position: absolute;
          width: 350px; height: 350px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          top: -80px; right: -80px;
        }
        .hero-content { position: relative; z-index: 1; }
        .hero-eyebrow {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.55);
          margin-bottom: 1rem;
          text-transform: uppercase;
        }
        .hero-heading {
          font-size: 2.4rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          letter-spacing: -0.5px;
        }
        .hero-sub {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .hero-badges { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 3rem; }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.9);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          width: fit-content;
          backdrop-filter: blur(8px);
        }

        /* Feature cards at bottom */
        .hero-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .hero-card {
          padding: 1.5rem 1.25rem;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .hero-card:last-child { border-right: none; }
        .card-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .card-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.35rem;
        }
        .card-desc {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.5;
        }

        /* FORM PANEL */
        .form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
          background: #f8fafc;
          overflow-y: auto;
        }
        .form-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 16px;
          padding: 2.25rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
        }
        .form-card h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.35rem;
          letter-spacing: -0.3px;
        }
        .form-sub {
          font-size: 0.83rem;
          color: #64748b;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        /* FIELDS */
        .auth-form { display: flex; flex-direction: column; gap: 1rem; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .field { display: flex; flex-direction: column; gap: 0.4rem; }
        .field label {
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: #94a3b8;
          text-transform: uppercase;
        }
        .field input {
          padding: 0.62rem 0.875rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.88rem;
          color: #1e293b;
          background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          width: 100%;
        }
        .field input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: #fff;
        }
        .field input::placeholder { color: #cbd5e1; }

        .password-wrap { position: relative; }
        .password-wrap input { padding-right: 2.5rem; }
        .eye-btn {
          position: absolute;
          right: 0.7rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          color: #94a3b8;
          padding: 0;
          line-height: 1;
        }

        /* CHECKBOX */
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.8rem;
          color: #64748b;
          cursor: pointer;
          line-height: 1.4;
        }
        .checkbox-label input[type="checkbox"] {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          margin-top: 1px;
          accent-color: #2563eb;
          cursor: pointer;
        }
        .inline-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }
        .inline-link:hover { text-decoration: underline; }

        /* SUBMIT */
        .submit-btn {
          margin-top: 0.25rem;
          padding: 0.75rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          letter-spacing: 0.2px;
        }
        .submit-btn:hover { background: #1d4ed8; }
        .submit-btn:active { transform: scale(0.99); }

        /* DIVIDER */
        .divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.25rem 0;
          color: #94a3b8;
          font-size: 0.78rem;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        /* SOCIAL */
        .social-row { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; }
        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          background: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .social-btn:hover { background: #f8fafc; border-color: #cbd5e1; }

        /* SWITCH */
        .switch-link {
          text-align: center;
          font-size: 0.82rem;
          color: #64748b;
        }
        .switch-link a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }
        .switch-link a:hover { text-decoration: underline; }

        /* FOOTER */
        .auth-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2.5rem;
          background: #fff;
          border-top: 1px solid #e2e8f0;
        }
        .footer-logo {
          font-size: 0.95rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.3px;
        }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-links a {
          font-size: 0.75rem;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: #64748b; }

        /* TOAST */
        .toast {
          position: fixed;
          top: 1.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1.5rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          animation: slideDown 0.3s ease;
          white-space: nowrap;
        }
        .toast-success { background: #fff; border: 1.5px solid #22c55e; color: #15803d; }
        .toast-error   { background: #fff; border: 1.5px solid #ef4444; color: #b91c1c; }
        .toast-icon    { font-size: 1rem; }
        @keyframes slideDown {
          from { opacity: 0; top: 0.5rem; }
          to   { opacity: 1; top: 1.25rem; }
        }

        /* SPINNER */
        .btn-loader { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .spinner {
          width: 16px; height: 16px;
          border: 2.5px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .submit-btn:disabled { opacity: 0.8; cursor: not-allowed; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .auth-main { grid-template-columns: 1fr; }
          .hero-panel { display: none; }
          .form-panel { padding: 2rem 1.25rem; }
          .field-row { grid-template-columns: 1fr; }
          .nav-links { display: none; }
          .footer-links { display: none; }
        }
      `}</style>
    </div>
  );
}