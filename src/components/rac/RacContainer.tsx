import type { PropsWithChildren } from "react";

export function RacContainer({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`mx-auto w-full max-w-[80rem] px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
