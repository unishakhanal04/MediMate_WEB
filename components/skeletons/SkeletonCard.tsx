interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`} />;
}
