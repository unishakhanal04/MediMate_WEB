interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({ message = "Loading...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex min-h-[60vh] flex-col items-center justify-center gap-4 ${className}`}>
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
        role="status"
        aria-label={message}
      />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
}
