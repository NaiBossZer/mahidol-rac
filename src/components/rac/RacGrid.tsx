import type { PropsWithChildren } from "react";

export function RacGrid({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <div className={`grid gap-6 ${className}`}>{children}</div>;
}
