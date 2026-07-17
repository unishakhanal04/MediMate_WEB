import { SkeletonCard } from "../skeletons/SkeletonCard";

export function TimelineSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      {[0, 1].map((group) => (
        <div key={group} className="flex flex-col gap-3">
          <SkeletonCard className="h-3 w-24" />
          {[0, 1, 2].map((row) => (
            <SkeletonCard key={row} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}
