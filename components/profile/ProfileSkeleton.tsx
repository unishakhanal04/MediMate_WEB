import { Card } from "../dashboard/Card";
import { SkeletonCard } from "../skeletons/SkeletonCard";

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="flex items-center gap-4">
        <SkeletonCard className="h-16 w-16 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <SkeletonCard className="h-5 w-1/3" />
          <SkeletonCard className="h-4 w-1/2" />
        </div>
      </Card>

      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="flex flex-col gap-3">
          <SkeletonCard className="h-5 w-1/4" />
          <SkeletonCard className="h-4 w-full" />
          <SkeletonCard className="h-4 w-full" />
          <SkeletonCard className="h-4 w-2/3" />
        </Card>
      ))}
    </div>
  );
}
