import { Card } from "../dashboard/Card";
import { SkeletonCard } from "../skeletons/SkeletonCard";

export function AppointmentSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <SkeletonCard className="h-5 w-3/4" />
          <SkeletonCard className="h-4 w-1/2" />
        </div>
        <SkeletonCard className="h-6 w-16 rounded-full" />
      </div>

      <div className="flex flex-col gap-2">
        <SkeletonCard className="h-3 w-full" />
        <SkeletonCard className="h-3 w-2/3" />
      </div>

      <div className="mt-auto flex gap-2">
        <SkeletonCard className="h-9 w-20 rounded-lg" />
        <SkeletonCard className="h-9 w-20 rounded-lg" />
      </div>
    </Card>
  );
}
