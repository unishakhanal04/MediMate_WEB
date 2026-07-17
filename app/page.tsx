"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

/* ── tiny hook: fade-in on scroll ── */
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`section-reveal ${visible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, authReady, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (authReady && isAuthenticated) {
      const destination = user?.role === "admin" ? "/admin" : "/user";
      router.replace(destination);
    }
  }, [authReady, isAuthenticated, router, user?.role]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!authReady || isAuthenticated) {
    return null;
  }

  return (
    <div className="root">

      {/* ══════════ NAV ══════════ */}
      <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <Link href="/" className="logo">Medi<span>Mate</span></Link>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link href="#home" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</Link>
          <Link href="#features" onClick={() => setMenuOpen(false)}>Find a doctor</Link>
          <Link href="#testimonials" onClick={() => setMenuOpen(false)}>Testimonials</Link>
          <Link href="#cta" onClick={() => setMenuOpen(false)}>Services</Link>
        </nav>

        <div className="nav-cta">
          <Link href="/login" className="btn-outline">Login</Link>
          <Link href="/register" className="btn-solid">Signup</Link>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      {/* ══════════ HERO ══════════ */}
      <section id="home" className="hero">
        <div className="hero-left">
          <p className="hero-eyebrow">RELIABLE EMPATHY IN CARE</p>
          <h1 className="hero-heading">
            Reliable Empathy in <span className="hero-highlight">Every Care</span>
          </h1>
          <p className="hero-body">
            MediMate seamlessly blends clinical precision with human warmth, giving you the tools to manage medications, sync vitals, and connect with healthcare professionals effortlessly.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn-solid btn-lg">Get Started</Link>
            <Link href="#features" className="btn-outline-dark btn-lg">View Services</Link>
          </div>
          <div className="hero-social-proof">
            <div className="avatar-stack">
              <span className="avatar">👤</span>
              <span className="avatar">👤</span>
              <span className="avatar">👤</span>
            </div>
            <p className="proof-text"><strong>50,000+</strong> users trust MediMate</p>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-wrap">
            <div className="hero-img-placeholder">
              <div className="hero-img-inner">
                <span className="hero-emoji">👩‍⚕️</span>
              </div>
            </div>
            <div className="hero-badge">
              <span className="badge-dot" />
              <span className="badge-pct">Heart Rate</span>
              <span className="badge-label">72 BPM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CORE FEATURES ══════════ */}
      <section id="features" className="features-section">
        <Section>
          <p className="section-eyebrow">Precision-Crafted Features</p>
          <p className="section-sub">
            Intelligent tools designed to simplify your health journey without compromising on the human connection.
          </p>
        </Section>

        <div className="features-grid">
          <Section className="feat-card feat-card--dark feat-card--tall">
            <div className="feat-icon">🔐</div>
            <h3>Prescription Vault</h3>
            <p>Store and organize all your prescriptions in one encrypted space for instant access.</p>
            <Link href="/register" className="feat-link">Start a Conversation →</Link>
            <div className="feat-img-placeholder">
              <span>📋</span>
            </div>
          </Section>

          <Section className="feat-card feat-card--blue">
            <div className="feat-icon">⏰</div>
            <h3>Smart Reminders</h3>
            <p>Receive alerts for each dose, customized to your daily routine and lifestyle.</p>
          </Section>

          <Section className="feat-card feat-card--light">
            <div className="feat-icon">🩺</div>
            <h3>Find Doctors</h3>
            <p>Locate top-rated healthcare providers and book appointments directly through our partnered scheduler.</p>
          </Section>

          <Section className="feat-card feat-card--white">
            <div className="feat-icon">📊</div>
            <h3>Vitals Sync</h3>
            <p>Automatically connect your wearable device to track blood pressure, glucose levels, and heart rate in real time.</p>
          </Section>

          <Section className="feat-card feat-card--blue2">
            <div className="feat-icon">💬</div>
            <h3>24/7 Nurse Chat</h3>
            <p>Immediate access to a licensed nursing professional for non-emergency guidance, anytime, day or night.</p>
            <Link href="/register" className="feat-link feat-link--light">Start a Conversation →</Link>
          </Section>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" className="how-section">
        <Section>
          <p className="section-eyebrow">How It Works</p>
          <p className="section-sub">
            Getting your medications on track takes just a few minutes.
          </p>
        </Section>

        <div className="how-grid">
          {[
            { step: "1", icon: "📝", title: "Sign Up", body: "Create your free MediMate account in seconds." },
            { step: "2", icon: "💊", title: "Add Medications", body: "Log your prescriptions and set your dosage schedule." },
            { step: "3", icon: "⏰", title: "Get Reminders", body: "Receive gentle nudges exactly when it's time for each dose." },
            { step: "4", icon: "📈", title: "Track Progress", body: "Watch your adherence improve with real, easy-to-read insights." },
          ].map((item) => (
            <Section key={item.step} className="how-card">
              <div className="how-step">{item.step}</div>
              <div className="how-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Section>
          ))}
        </div>
      </section>

      {/* ══════════ TRUST BAR ══════════ */}
      <section id="trust" className="trust-section">
        <Section>
          <p className="trust-label">Trusted by 50,000+ Caregivers</p>
          <div className="trust-logos">
            {["HealthCore", "Vitalis", "MediLink", "CareNet"].map((name) => (
              <div key={name} className="trust-logo">
                <span className="trust-dot">◆</span> {name}
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section id="testimonials" className="testimonials-section">
        <Section>
          <p className="section-eyebrow">Loved by Patients &amp; Caregivers</p>
          <p className="section-sub">
            Real stories from people managing their health with MediMate.
          </p>
        </Section>

        <div className="testimonials-grid">
          {[
            {
              quote: "MediMate reminded me every single day — I haven't missed a dose in three months.",
              name: "Sarah K.",
              role: "Caregiver",
              avatar: "👩",
            },
            {
              quote: "The prescription vault alone is worth it. Everything is in one secure place whenever I need it.",
              name: "James O.",
              role: "Patient",
              avatar: "🧑",
            },
            {
              quote: "As a nurse, I recommend MediMate to every family managing multiple medications at home.",
              name: "Priya R.",
              role: "Registered Nurse",
              avatar: "👩‍⚕️",
            },
          ].map((t) => (
            <Section key={t.name} className="testimonial-card">
              <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testimonial-author">
                <span className="testimonial-avatar">{t.avatar}</span>
                <div>
                  <p className="testimonial-name">{t.name}</p>
                  <p className="testimonial-role">{t.role}</p>
                </div>
              </div>
            </Section>
          ))}
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      <section id="cta" className="cta-section">
        <Section>
          <div className="cta-card">
            <h2>Ready for a Healthier Tomorrow?</h2>
            <p>
              Join thousands of users who have transformed their healthcare management with MediMate&apos;s empathetic platform.
            </p>
            <div className="cta-actions">
              <Link href="/register" className="btn-solid btn-lg btn-white">
                Download for iOS
              </Link>
              <Link href="/register" className="btn-outline-white btn-lg">
                Download for Android
              </Link>
            </div>
            <div className="cta-trust">
              <span className="cta-trust-item">🔒 HIPAA Compliant</span>
              <span className="cta-trust-item">⭐ 4.9 App Rating</span>
              <span className="cta-trust-item">🛡️ SOC 2 Certified</span>
            </div>
          </div>
        </Section>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-logo">MediMate</p>
            <p className="footer-tagline">Connecting patients with your most trusted empathetic and professional healthcare solutions.</p>
          </div>
          <div className="footer-links-grid">
            <div>
              <p className="footer-col-head">MediMate</p>
              <Link href="#features">Features</Link>
              <Link href="#trust">About Us</Link>
              <Link href="#">Reminders</Link>
              <Link href="#">Technology</Link>
            </div>
            <div>
              <p className="footer-col-head">Medical Services</p>
              <Link href="#">Cardiology</Link>
              <Link href="#">Neurology</Link>
              <Link href="#">Pediatrics</Link>
              <Link href="#">Technology</Link>
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
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MediMate. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Accessibility</Link>
            <Link href="#">Contact</Link>
          </div>
        </div>
      </footer>

      {/* ══════════ STYLES ══════════ */}
      <style jsx>{`
        /* ── BASE ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .root {
          font-family: 'Segoe UI', system-ui, sans-serif;
          color: #1e293b;
          background: #fff;
          overflow-x: hidden;
        }
        a { text-decoration: none; }

        /* ── SCROLL REVEAL ── */
        .section-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .section-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── NAV ── */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 5%;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          transition: box-shadow 0.3s;
        }
        .nav-scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
        .logo {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.5px;
        }
        .logo span { color: #2563eb; }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-links a {
          font-size: 0.875rem;
          font-weight: 500;
          color: #475569;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: #2563eb; }
        .nav-cta { display: flex; gap: 0.75rem; align-items: center; }

        /* Buttons */
        .btn-outline {
          padding: 0.45rem 1.1rem;
          border: none;
          border-radius: 7px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          background: transparent;
          transition: color 0.2s;
        }
        .btn-outline:hover { color: #2563eb; }
        .btn-solid {
          padding: 0.45rem 1.1rem;
          background: #2563eb;
          color: #fff;
          border-radius: 7px;
          font-size: 0.85rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          display: inline-block;
        }
        .btn-solid:hover { background: #1d4ed8; }
        .btn-solid:active { transform: scale(0.98); }
        .btn-lg { padding: 0.75rem 1.75rem; font-size: 0.95rem; border-radius: 8px; }
        .btn-white {
          background: #fff !important;
          color: #2563eb !important;
        }
        .btn-white:hover { background: #f1f5f9 !important; }
        .btn-play {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-play:hover { border-color: #2563eb; background: #f0f7ff; }
        .play-icon {
          width: 28px; height: 28px;
          background: #2563eb;
          color: #fff;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          padding-left: 2px;
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .hamburger span {
          display: block;
          width: 22px; height: 2px;
          background: #1e293b;
          border-radius: 2px;
          transition: all 0.3s;
        }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          padding: 7rem 5% 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 4rem;
          background: #fff;
        }
        .hero-eyebrow {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: #2563eb;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .hero-heading {
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 800;
          line-height: 1.15;
          color: #0f172a;
          letter-spacing: -0.5px;
          margin-bottom: 1.25rem;
        }
        .hero-highlight { color: #2563eb; }
        .hero-body {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.75;
          margin-bottom: 2rem;
          max-width: 480px;
        }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin-bottom: 1.75rem; }
        .btn-outline-dark {
          padding: 0.75rem 1.75rem;
          background: transparent;
          color: #1e293b;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          display: inline-block;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-outline-dark:hover { border-color: #2563eb; background: #f0f7ff; color: #2563eb; }
        .hero-social-proof {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .avatar-stack { display: flex; }
        .avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #e0f2fe;
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          margin-left: -8px;
        }
        .avatar:first-child { margin-left: 0; }
        .proof-text { font-size: 0.82rem; color: #64748b; }

        /* Hero image */
        .hero-right { display: flex; justify-content: center; }
        .hero-img-wrap { position: relative; width: 100%; max-width: 440px; }
        .hero-img-placeholder {
          width: 100%;
          aspect-ratio: 4/5;
          background: linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .hero-img-inner {
          font-size: 8rem;
          line-height: 1;
          filter: drop-shadow(0 8px 24px rgba(37,99,235,0.2));
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        .hero-badge {
          position: absolute;
          bottom: 1.5rem;
          right: -1rem;
          background: #fff;
          border-radius: 12px;
          padding: 0.75rem 1.1rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid #e2e8f0;
        }
        .badge-dot {
          width: 10px; height: 10px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0.1); }
        }
        .badge-pct { font-size: 1rem; font-weight: 800; color: #0f172a; }
        .badge-label { font-size: 0.72rem; color: #64748b; font-weight: 500; }

        /* ── FEATURES ── */
        .features-section {
          padding: 5rem 5%;
          background: #f8fafc;
        }
        .section-eyebrow {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.75rem;
          letter-spacing: -0.3px;
        }
        .section-sub {
          text-align: center;
          font-size: 0.95rem;
          color: #64748b;
          max-width: 540px;
          margin: 0 auto 3rem;
          line-height: 1.7;
        }

        /* Grid layout */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 1.25rem;
        }

        .feat-card {
          border-radius: 16px;
          padding: 2rem;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .feat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
        }
        .feat-icon { font-size: 1.75rem; margin-bottom: 1rem; }
        .feat-card h3 {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 0.6rem;
          color: inherit;
          line-height: 1.3;
        }
        .feat-card p {
          font-size: 0.875rem;
          line-height: 1.65;
          opacity: 0.85;
        }
        .feat-link {
          display: inline-block;
          margin-top: 1rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #93c5fd;
          transition: color 0.2s;
          text-decoration: none;
        }
        .feat-link:hover { color: #fff; }
        .feat-link--light { color: #fff; opacity: 0.85; }
        .feat-link--light:hover { opacity: 1; }

        /* Card variants */
        .feat-card--dark {
          background: #0f172a;
          color: #fff;
          grid-column: 1;
          grid-row: 1 / 3;
          display: flex;
          flex-direction: column;
          min-height: 380px;
        }
        .feat-card--blue {
          background: #2563eb;
          color: #fff;
          grid-column: 2;
          grid-row: 1;
        }
        .feat-card--light {
          background: #fff;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          grid-column: 3;
          grid-row: 1;
        }
        .feat-card--white {
          background: #fff;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          grid-column: 2;
          grid-row: 2;
        }
        .feat-card--blue2 {
          background: #1d4ed8;
          color: #fff;
          grid-column: 3;
          grid-row: 2;
        }

        .feat-img-placeholder {
          flex: 1;
          background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
          border-radius: 12px;
          margin-top: auto;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
        }
        .feat-img-side {
          width: 120px;
          height: 100%;
          min-height: 80px;
          flex-shrink: 0;
          margin-top: 0;
          font-size: 2rem;
        }
        .feat-text { flex: 1; }

        /* ── HOW IT WORKS ── */
        .how-section {
          padding: 5rem 5%;
          background: #fff;
        }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .how-card {
          position: relative;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 2rem 1.5rem;
          text-align: center;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .how-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
        .how-step {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #2563eb;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .how-icon { font-size: 2rem; margin: 0.75rem 0 1rem; }
        .how-card h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .how-card p {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.6;
        }

        /* ── TESTIMONIALS ── */
        .testimonials-section {
          padding: 5rem 5%;
          background: #f8fafc;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .testimonial-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
        .testimonial-quote {
          font-size: 0.95rem;
          color: #334155;
          line-height: 1.7;
          flex: 1;
        }
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .testimonial-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e0f2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        .testimonial-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
        }
        .testimonial-role {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        /* ── TRUST ── */
        .trust-section {
          padding: 3.5rem 5%;
          background: #fff;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
        }
        .trust-label {
          text-align: center;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 1.75rem;
        }
        .trust-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
          flex-wrap: wrap;
        }
        .trust-logo {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.95rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.3px;
          transition: color 0.2s;
        }
        .trust-logo:hover { color: #2563eb; }
        .trust-dot { font-size: 0.5rem; color: #2563eb; }

        /* ── CTA ── */
        .cta-section {
          padding: 4rem 5%;
          background: #f8fafc;
        }
        .cta-card {
          background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
          border-radius: 20px;
          padding: 4rem;
          text-align: center;
          color: #fff;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }
        .cta-card::before {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          top: -100px; right: -80px;
        }
        .cta-card::after {
          content: '';
          position: absolute;
          width: 200px; height: 200px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
          bottom: -60px; left: -40px;
        }
        .cta-card h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.3px;
          position: relative; z-index: 1;
        }
        .cta-card p {
          font-size: 1rem;
          color: rgba(255,255,255,0.8);
          margin-bottom: 2rem;
          max-width: 480px;
          margin-left: auto; margin-right: auto;
          line-height: 1.7;
          position: relative; z-index: 1;
        }
        .cta-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 2rem;
          position: relative; z-index: 1;
        }
        .btn-outline-white {
          padding: 0.75rem 1.75rem;
          background: transparent;
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.6);
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          display: inline-block;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-outline-white:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
        .cta-trust {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          position: relative; z-index: 1;
        }
        .cta-trust-item {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
        }
        .cta-card a { position: relative; z-index: 1; }

        /* ── FOOTER ── */
        .footer {
          background: #fff;
          border-top: 1px solid #e2e8f0;
          padding: 3rem 5% 1.5rem;
        }
        .footer-top {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        .footer-logo {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.35rem;
        }
        .footer-tagline {
          font-size: 0.78rem;
          color: #94a3b8;
          line-height: 1.6;
          max-width: 220px;
          margin-top: 0.4rem;
        }
        .footer-links-grid {
          display: flex;
          gap: 4rem;
        }
        .footer-links-grid > div {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .footer-col-head {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 0.25rem;
        }
        .footer-links-grid a {
          font-size: 0.85rem;
          color: #64748b;
          transition: color 0.2s;
        }
        .footer-links-grid a:hover { color: #2563eb; }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-bottom p { font-size: 0.78rem; color: #94a3b8; }
        .footer-bottom-links { display: flex; gap: 1.5rem; }
        .footer-bottom-links a { font-size: 0.75rem; color: #94a3b8; transition: color 0.2s; }
        .footer-bottom-links a:hover { color: #64748b; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .features-grid { grid-template-columns: 1fr 1fr; }
          .feat-card--dark { grid-column: 1; grid-row: 1 / 3; }
          .feat-card--blue { grid-column: 2; grid-row: 1; }
          .feat-card--light { grid-column: 2; grid-row: 2; }
          .feat-card--white { grid-column: 1; grid-row: 3; }
          .feat-card--blue2 { grid-column: 2; grid-row: 3; }

          .how-grid { grid-template-columns: 1fr 1fr; }
          .testimonials-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 768px) {
          .hero {
            grid-template-columns: 1fr;
            padding-top: 6rem;
            text-align: center;
          }
          .hero-body { margin-left: auto; margin-right: auto; }
          .hero-actions { justify-content: center; }
          .hero-right { order: -1; }
          .hero-img-wrap { max-width: 280px; margin: 0 auto; }
          .hero-badge { right: 0; }

          .nav-links {
            display: none;
            position: fixed;
            top: 64px; left: 0; right: 0;
            background: #fff;
            flex-direction: column;
            padding: 1.5rem 5%;
            border-bottom: 1px solid #e2e8f0;
            gap: 1.25rem;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          }
          .nav-links.open { display: flex; }
          .hamburger { display: flex; }
          .nav-cta { display: none; }

          .features-grid { grid-template-columns: 1fr; }
          .feat-card--dark,
          .feat-card--blue,
          .feat-card--light,
          .feat-card--white,
          .feat-card--blue2 { grid-column: 1; grid-row: auto; }

          .how-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }

          .trust-logos { gap: 1.5rem; }
          .cta-card { padding: 2.5rem 1.5rem; }
          .cta-card h2 { font-size: 1.5rem; }

          .footer-top { flex-direction: column; }
          .footer-links-grid { gap: 2rem; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
