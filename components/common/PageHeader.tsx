import { ReactNode } from "react";

interface PageHeaderProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ icon, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {icon && (
          <span
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-500/10"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">{description}</p>
          )}
        </div>
      </div>

      {action && <div className="self-start sm:self-auto">{action}</div>}
    </div>
  );
}
