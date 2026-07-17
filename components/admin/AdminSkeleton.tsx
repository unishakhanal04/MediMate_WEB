import { Card } from "../dashboard/Card";
import { SkeletonCard } from "../skeletons/SkeletonCard";

export function AdminSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <SkeletonCard className="h-14 w-full" />
          </Card>
        ))}
      </div>
      <Card>
        <SkeletonCard className="h-64 w-full" />
      </Card>
    </div>
  );
}
