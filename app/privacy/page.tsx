import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — MediMate",
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">Last updated: July 2026</p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">What we store</h2>
            <p className="mt-2">
              MediMate stores the information you give it in order to run the app: your account
              details (username, email, gender), profile and medical information you choose to
              add (blood group, allergies, height/weight), your medicines, reminders,
              prescriptions (including any prescription image you upload), appointments,
              emergency contacts, and your conversation history with the AI Assistant.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">How it&apos;s used</h2>
            <p className="mt-2">
              This data is used only to power the features you use directly: showing your
              medicine schedule, sending you reminders (including push notifications), checking
              new medicines against openFDA label data for possible interactions, generating your
              adherence reports, and giving the AI Assistant context about your own medicines and
              adherence so it can answer questions relevant to you. Prescription images sent for
              AI extraction are processed in memory and are not stored as part of that process.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Third parties</h2>
            <p className="mt-2">
              MediMate uses Google Gemini to power the AI Assistant and prescription scanning,
              openFDA&apos;s public label database for interaction checks, and eSewa to process
              subscription payments. None of your data is sold or used for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your control</h2>
            <p className="mt-2">
              You can update or delete your medicines, prescriptions, appointments, reminders,
              and emergency contacts at any time from your account. Deleting your account removes
              your personal and medical data from MediMate.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contact</h2>
            <p className="mt-2">
              Questions about this policy can be sent through the Feedback form inside your
              MediMate account.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
