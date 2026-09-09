import type { PropsWithChildren } from "react";

const gaps: Record<string, string> = {
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "6": "gap-6",
  "8": "gap-8",
  "12": "gap-12",
};

export function RacStack({
  children,
  gap = "6",
  className = "",
}: PropsWithChildren<{ gap?: string; className?: string }>) {
  return <div className={`flex flex-col ${gaps[gap] ?? gaps["6"]} ${className}`}>{children}</div>;
}
