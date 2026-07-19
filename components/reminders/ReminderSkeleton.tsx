import { SkeletonCard } from "../skeletons/SkeletonCard";

export function ReminderSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-5 flex items-center justify-between">
        <SkeletonCard className="h-5 w-40" />
        <SkeletonCard className="h-6 w-28 rounded-full" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex gap-4">
            <SkeletonCard className="h-6 w-6 flex-shrink-0 rounded-full" />
            <SkeletonCard className="h-20 flex-1 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
