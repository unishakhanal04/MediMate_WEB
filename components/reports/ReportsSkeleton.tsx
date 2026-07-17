import { Card } from "../dashboard/Card";
import { SkeletonCard } from "../skeletons/SkeletonCard";

export function ReportsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="flex flex-col gap-3">
            <SkeletonCard className="h-10 w-10 rounded-xl" />
            <SkeletonCard className="h-6 w-16" />
            <SkeletonCard className="h-4 w-24" />
          </Card>
        ))}
      </div>

      {Array.from({ length: 2 }).map((_, index) => (
        <Card key={index} className="flex flex-col gap-4">
          <SkeletonCard className="h-5 w-1/4" />
          <SkeletonCard className="h-48 w-full" />
        </Card>
      ))}
    </div>
  );
}
