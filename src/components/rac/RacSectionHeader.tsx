import type { PropsWithChildren, ReactNode } from "react";

export function RacSectionHeader({
  eyebrow,
  title,
  description,
  action,
  className = "",
}: PropsWithChildren<{
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-rac-lac">
            {eyebrow}
          </div>
        )}
        <h2 className="font-rac-display text-2xl font-semibold tracking-tight text-rac-blue sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
