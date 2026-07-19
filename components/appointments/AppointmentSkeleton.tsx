import { SkeletonCard } from "../skeletons/SkeletonCard";

export function AppointmentSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <SkeletonCard className="h-11 w-11 flex-shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2">
        <SkeletonCard className="h-4 w-1/2" />
        <SkeletonCard className="h-3 w-1/3" />
      </div>
      <SkeletonCard className="hidden h-6 w-20 rounded-full sm:block" />
    </div>
  );
}
