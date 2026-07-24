import Link from "next/link";

export const metadata = {
  title: "Terms of Service — MediMate",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-gray-950 dark:text-white">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            MediMate
          </Link>
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">Last updated: July 2026</p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Not a medical device</h2>
            <p className="mt-2">
              MediMate is a personal organization tool for medicines, prescriptions, and
              appointments. It is not a medical device, and nothing in the app — including AI
              Assistant answers, drug interaction alerts, and OCR-extracted prescription data —
              is a substitute for advice from a licensed doctor or pharmacist. Always confirm
              dosages, interactions, and treatment decisions with a qualified professional.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI-generated content</h2>
            <p className="mt-2">
              Responses from the AI Assistant, prescription scanning, and interaction warnings
              are generated automatically and may be incomplete or inaccurate. Interaction
              warnings are based on automated text matching against FDA label data, not a
              clinical review. You should independently verify anything extracted or suggested by
              these features before acting on it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your account</h2>
            <p className="mt-2">
              You&apos;re responsible for keeping your login credentials secure and for the
              accuracy of the medicine, appointment, and medical information you enter. MediMate
              relies on the accuracy of that information to generate reminders, reports, and
              interaction checks.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Subscriptions</h2>
            <p className="mt-2">
              Some features (such as AI-generated report insights) are part of a paid
              subscription tier, processed through eSewa. Subscription status and billing history
              are visible from your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Changes</h2>
            <p className="mt-2">
              These terms may be updated as MediMate&apos;s features change. Continued use of the
              app after an update means you accept the revised terms.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
