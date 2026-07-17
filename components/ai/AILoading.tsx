export function AILoading() {
  return (
    <div className="flex justify-start" role="status" aria-label="Assistant is typing">
      <div className="flex gap-1 rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s] dark:bg-gray-500" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s] dark:bg-gray-500" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" />
      </div>
    </div>
  );
}
