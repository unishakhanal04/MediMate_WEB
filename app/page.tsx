"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#solutions", label: "Solutions" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

const partnerLogos = [1, 2, 3, 4, 5];

const steps = [
  { n: 1, title: "Sync Your Profile", body: "Connect your existing records and wearable devices in under 60 seconds." },
  { n: 2, title: "Monitor & Analyze", body: "Our AI engine processes your data to identify trends and potential health risks." },
  { n: 3, title: "Receive Care", body: "Get personalized insights and connect with doctors when intervention is needed." },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, authReady, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (authReady && isAuthenticated) {
      router.replace(user?.role === "admin" ? "/admin" : "/user");
    }
  }, [authReady, isAuthenticated, router, user?.role]);

  if (!authReady || isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-gray-950 dark:text-white">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            MediMate
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white">
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>

          <button
            className="text-xl text-slate-600 dark:text-gray-400 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 dark:border-gray-800 md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-600 dark:text-gray-400"
              >
                {link.label}
              </a>
            ))}
            <Link href="/login" className="text-sm font-semibold text-slate-900 dark:text-white">
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
            🛡️ FDA Compliant Security
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Healthcare that stays
            <br />
            <span className="italic text-blue-600 dark:text-blue-400">one step ahead</span> of you.
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500 dark:text-gray-400">
            Personalized health management powered by AI. Real-time monitoring, appointment
            synchronization, and intelligent symptom tracking designed for modern living.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Join the Waitlist
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
            >
              Watch Demo
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["👤", "👤", "👤"].map((emoji, i) => (
                <span
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-sm dark:border-gray-950 dark:bg-blue-500/20"
                >
                  {emoji}
                </span>
              ))}
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[10px] font-bold text-white dark:border-gray-950">
                +2k
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400">Trusted by 2,000+ patients and doctors.</p>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-blue-50 p-2 shadow-xl dark:from-amber-500/10 dark:via-orange-500/5 dark:to-blue-500/10">
            <div className="flex h-80 flex-col justify-between rounded-2xl bg-white/50 p-5 backdrop-blur-sm dark:bg-gray-900/60 sm:h-96">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">Welcome to MediMate · Overview</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>

              <div className="flex flex-1 items-end gap-1.5 py-4">
                {[40, 65, 50, 80, 55, 70, 45, 60].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-blue-400/70" style={{ height: `${h}%` }} />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["Heart Rate", "Sleep", "Appts"].map((label) => (
                  <div key={label} className="rounded-lg bg-white/70 p-2 text-center dark:bg-gray-800/70">
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -left-4 top-6 flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <span className="text-lg text-rose-500">❤️</span>
            <div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">72 BPM</p>
              <p className="text-[10px] text-slate-400 dark:text-gray-500">Resting Heart Rate</p>
            </div>
          </div>

          <div className="absolute -bottom-4 right-2 flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            📍 AI Insight: Hydration Low
          </div>
        </div>
      </section>

      {/* ── Partner logos ── */}
      <section className="border-y border-slate-100 bg-slate-50 py-10 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">
            Partnering with world-class institutions
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            {partnerLogos.map((i) => (
              <div key={i} className="h-8 w-28 rounded-md bg-slate-200 dark:bg-gray-800" aria-hidden="true" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Comprehensive Health Intelligence
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-gray-400">
            We&apos;ve designed a suite of tools that work together to provide a holistic view of your
            health journey.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex flex-col justify-between rounded-2xl bg-slate-900 p-7 text-white">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-blue-300">
                  Real-time Analytics
                </span>
                <span className="text-xl">📈</span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-bold">Live Vital Monitoring</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Connect your wearables for continuous tracking of heart rate, sleep quality, and
                  daily activity levels with millisecond precision.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-indigo-50 p-6 dark:bg-indigo-500/10">
                <span className="text-xl">📅</span>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Appointments</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-gray-400">
                  Sync seamlessly with your calendar and get travel time estimates for clinical
                  visits.
                </p>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-6 dark:bg-indigo-500/10">
                <span className="text-xl">🛡️</span>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Privacy First</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-gray-400">
                  Bank-grade encryption for all your medical records and personal data. You own
                  your data.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-blue-600 p-7 text-white">
            <div className="flex items-start justify-between">
              <span className="text-xl">💊</span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-bold">Medication Management</h3>
              <p className="mt-2 text-sm leading-relaxed text-blue-100">
                Never miss a dose with smart reminders that adapt to your schedule and time zone
                automatically.
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-blue-50">
                {["Auto-refill alerts", "Interaction warnings", "Dosage tracking"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span aria-hidden="true">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-indigo-50 p-7 dark:bg-indigo-500/10 sm:flex-row sm:items-center lg:col-span-3">
            <div className="max-w-md">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Telehealth Integrated</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-gray-400">
                Connect with specialists directly through the platform. Share real-time health data
                during video consultations.
              </p>
            </div>
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm dark:bg-gray-800">
              💬
            </span>
          </div>
        </div>
      </section>

      {/* ── Three steps ── */}
      <section id="solutions" className="bg-slate-50 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Three steps to better health
          </h2>
        </div>

        <div className="relative mx-auto mt-14 max-w-4xl px-6">
          <div className="absolute inset-x-[16.5%] top-6 hidden h-px bg-slate-300 dark:bg-gray-700 sm:block" aria-hidden="true" />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {step.n}
                </span>
                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-gray-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
          Patient Stories
        </span>
        <h2 className="mt-4 max-w-lg text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
          Transforming lives through proactive care.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-4xl font-serif text-blue-600 dark:text-blue-400" aria-hidden="true">
              &ldquo;
            </span>
            <p className="-mt-2 text-base italic leading-relaxed text-slate-700 dark:text-gray-300">
              MediMate literally saved my life. The AI picked up on a slight heart rhythm
              abnormality that I hadn&apos;t even noticed. My doctor was able to treat it before it
              became a crisis.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg dark:bg-blue-500/20">
                👩
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Eleanor Vance</p>
                <p className="text-xs text-slate-400 dark:text-gray-500">Active User for 18 Months</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-blue-900 text-4xl">
              🧑‍⚕️
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-4xl">
              ⌚
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-slate-900 text-slate-300">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-lg font-extrabold text-white">MediMate</p>
            <p className="mt-3 max-w-[200px] text-xs leading-relaxed text-slate-400">
              Redefining healthcare through the lens of technology and empathy. Empowering patients
              to live their healthiest lives.
            </p>
            <div className="mt-4 flex gap-3 text-slate-400" aria-hidden="true">
              <span>𝕏</span>
              <span>✉️</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Product</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              {["Features", "AI Engine", "Integrations", "Pricing"].map((label) => (
                <a key={label} href="#" className="text-slate-400 hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Resources</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              {["Support Center", "API Docs", "Case Studies", "Community"].map((label) => (
                <a key={label} href="#" className="text-slate-400 hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Newsletter</p>
            <p className="mt-4 text-sm text-slate-400">
              Stay ahead with health insights delivered to your inbox.
            </p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} MediMate Healthcare. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-5">
              {["Privacy Policy", "Terms of Service", "Security", "Accessibility"].map((label) => (
                <a key={label} href="#" className="hover:text-slate-300">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
