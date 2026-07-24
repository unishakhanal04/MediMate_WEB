"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

const statHighlights = [
  { value: "100% Offline", body: "Medicine tracking works without signal", color: "text-blue-600 dark:text-blue-400" },
  { value: "AI-Powered", body: "Drug interaction checks & health assistant", color: "text-violet-600 dark:text-violet-400" },
  { value: "Real-Time", body: "Reminders, even with the app closed", color: "text-emerald-600 dark:text-emerald-400" },
  { value: "Private", body: "You control what's shared", color: "text-amber-600 dark:text-amber-400" },
];

const steps = [
  { n: 1, title: "Add your medicines", body: "Type in your medicine details, dosage, and schedule to get started." },
  { n: 2, title: "Get reminded, automatically", body: "Push notifications fire on schedule, even when the app is closed." },
  { n: 3, title: "Track & understand your trends", body: "See adherence stats, refill alerts, and AI insights in one place." },
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400">
            🔒 Your data, your control
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Never miss a dose, a refill, or an
            <br />
            <span className="italic text-blue-600 dark:text-blue-400">appointment.</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500 dark:text-gray-400">
            MediMate keeps your medicines, prescriptions, and appointments in one place —
            with reminders that reach you even when the app is closed, and AI that helps you
            stay on track without waiting on a doctor&apos;s call.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Start Tracking Free
            </Link>
            <a
              href="#how-it-works"
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
            >
              See How It Works
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
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Built for people managing multiple ongoing conditions.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-blue-50 p-2 shadow-xl dark:from-amber-500/10 dark:via-orange-500/5 dark:to-blue-500/10">
            <div className="flex h-80 flex-col justify-between rounded-2xl bg-white/50 p-5 backdrop-blur-sm dark:bg-gray-900/60 sm:h-96">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">92%</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-gray-400">Adherence this week</p>
                </div>
                <span className="text-slate-400 dark:text-gray-500" aria-hidden="true">⋯</span>
              </div>

              <div className="flex flex-1 items-end gap-1.5 py-4">
                {[40, 65, 50, 80, 55, 70, 45, 60].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-blue-400/70" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 right-2 flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            🔔 3 reminders sent today
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            What&apos;s Inside
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything for managing your own care
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-gray-400">
            One place for medicines, prescriptions, and appointments — built around the
            features you actually have, nothing more.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          {statHighlights.map((stat) => (
            <div key={stat.value}>
              <p className={`text-base font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-gray-400">{stat.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl bg-slate-900 p-7 text-white">
            <div className="flex items-start justify-between">
              <span className="text-xl">💊</span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-bold">Medicine & Reminders</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Today&apos;s dose, next refill, when to take it — all tracked automatically.
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
                {["Offline medicine safe usage", "Push reminders, app open or closed", "Refill & low-stock alerts"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span aria-hidden="true">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-blue-600 p-7 text-white">
            <div className="flex items-start justify-between">
              <span className="text-xl">🔔</span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-bold">Smart Notifications</h3>
              <p className="mt-2 text-sm leading-relaxed text-blue-100">
                Reminders reach you through web push, even if the app is closed —
                a background scheduler keeps watch.
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-blue-50">
                {["Web push, not app-dependent", "Checks due reminders continuously", "Notification history & logs"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span aria-hidden="true">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 p-6 dark:bg-amber-500/10">
            <span className="text-xl">⚠️</span>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Drug Interaction Alerts</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-gray-400">
              New medicines are checked against openFDA label data — flagged as a
              possible interaction, not a clinical diagnosis.
            </p>
          </div>

          <div className="rounded-2xl bg-teal-50 p-6 dark:bg-teal-500/10">
            <span className="text-xl">📅</span>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Appointments</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-gray-400">
              Schedule and track visits with a calendar view of upcoming and past
              appointments.
            </p>
          </div>

          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-violet-50 p-7 dark:bg-violet-500/10 sm:flex-row sm:items-center lg:col-span-2">
            <div className="max-w-md">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Health Assistant & Reports</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-gray-400">
                Chat with an assistant that understands your own medicines and adherence,
                plus AI-generated insights in your reports — always with a clear medical
                disclaimer.
              </p>
            </div>
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm dark:bg-gray-800">
              💬
            </span>
          </div>
        </div>
      </section>

      {/* ── Three steps ── */}
      <section id="how-it-works" className="bg-slate-50 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Three steps to staying in control
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-gray-400">
            No clinician needed to get started — just you and your medicine cabinet.
          </p>
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
          Built for Real Routines
        </span>
        <h2 className="mt-4 max-w-lg text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
          Fewer missed doses, less mental overhead.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-4xl font-serif text-blue-600 dark:text-blue-400" aria-hidden="true">
              &ldquo;
            </span>
            <p className="-mt-2 text-base italic leading-relaxed text-slate-700 dark:text-gray-300">
              I take five different medications and used to lose track of refills
              constantly. The reminders and the adherence chart have changed that — I
              finally have one place that shows me everything at a glance.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg dark:bg-blue-500/20">
                👤
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Early Beta Tester</p>
                <p className="text-xs text-slate-400 dark:text-gray-500">Managing multiple prescriptions</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col justify-center gap-3 rounded-2xl bg-slate-900 p-6 text-white">
              <span className="text-2xl">🗂️</span>
              <p className="text-sm font-semibold leading-relaxed">
                All your medicines, refills & appointments in one timeline.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 rounded-2xl bg-violet-50 p-6 dark:bg-violet-500/10">
              <span className="text-2xl">🔔</span>
              <p className="text-sm font-semibold leading-relaxed text-slate-900 dark:text-white">
                Reminders that reach you offline or with the app closed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-slate-900 px-6 py-14 text-center">
          <h2 className="max-w-xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Take control of your medicine routine today
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            Free to start. No paywalls, no clinical staff required.
          </p>
          <Link
            href="/register"
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-100"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-slate-900 text-slate-300">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-lg font-extrabold text-white">MediMate</p>
            <p className="mt-3 max-w-[200px] text-xs leading-relaxed text-slate-400">
              Helping you manage medicines, prescriptions and appointments in one place, in
              your own time.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Product</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              {[
                { label: "Medicines", href: "/user/medicines" },
                { label: "Prescriptions", href: "/user/prescriptions" },
                { label: "AI Assistant", href: "/user/ai" },
                { label: "Reports", href: "/user/reports" },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="text-slate-400 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Company</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              {[
                { label: "How it Works", href: "#how-it-works" },
                { label: "Pricing", href: "#pricing" },
                { label: "Contact", href: "#contact" },
              ].map((item) => (
                <a key={item.label} href={item.href} className="text-slate-400 hover:text-white">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Legal</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} MediMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
