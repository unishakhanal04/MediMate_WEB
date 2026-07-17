import { Card } from "../dashboard/Card";
import { SkeletonCard } from "./SkeletonCard";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Card */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <SkeletonCard className="h-6 w-40" />
            <SkeletonCard className="h-5 w-56" />
            <SkeletonCard className="h-4 w-64" />
          </div>
          <SkeletonCard className="h-4 w-32" />
        </div>
        <SkeletonCard className="mt-4 h-10 w-full" />
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <SkeletonCard className="h-8 w-8 rounded-full" />
              <SkeletonCard className="h-6 w-8" />
            </div>
            <SkeletonCard className="h-4 w-24" />
            <SkeletonCard className="h-3 w-full" />
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="flex h-full flex-col gap-3">
            <div className="flex items-center justify-between">
              <SkeletonCard className="h-8 w-8 rounded-full" />
              <SkeletonCard className="h-4 w-4" />
            </div>
            <SkeletonCard className="h-4 w-28" />
            <SkeletonCard className="h-3 w-full" />
          </Card>
        ))}
      </div>

      {/* Recent Activity + Profile Completion */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <SkeletonCard className="h-5 w-32" />
          <div className="flex flex-col divide-y divide-gray-100">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 py-3">
                <SkeletonCard className="h-6 w-6 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <SkeletonCard className="h-4 w-3/4" />
                  <SkeletonCard className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <SkeletonCard className="h-5 w-40" />
            <SkeletonCard className="h-4 w-20" />
          </div>
          <SkeletonCard className="h-2 w-full" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} className="h-4 w-2/3" />
            ))}
          </div>
          <SkeletonCard className="h-4 w-32" />
        </Card>
      </div>

      {/* Health Tip */}
      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <SkeletonCard className="h-8 w-8 rounded-full" />
          <SkeletonCard className="h-5 w-40" />
        </div>
        <SkeletonCard className="h-4 w-full" />
        <SkeletonCard className="h-4 w-3/4" />
        <SkeletonCard className="h-6 w-24 rounded-full" />
      </Card>
    </div>
  );
}
