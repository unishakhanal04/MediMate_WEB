import { ReactNode } from "react";
import { Card } from "../dashboard/Card";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center py-12 text-center">
      <span
        className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl dark:bg-blue-500/10"
        aria-hidden="true"
      >
        {icon}
      </span>

      <h2 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
