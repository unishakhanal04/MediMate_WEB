import { SkeletonCard } from "../skeletons/SkeletonCard";

export function NotificationsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonCard key={index} className="h-[76px] w-full" />
      ))}
    </div>
  );
}
