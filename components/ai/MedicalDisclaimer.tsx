export function MedicalDisclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
      <span aria-hidden="true">⚠️</span>
      <p>
        This AI assistant provides general information only and is not a substitute for
        professional medical advice. Always consult a doctor or pharmacist for diagnosis,
        medication changes, or urgent concerns.
      </p>
    </div>
  );
}
