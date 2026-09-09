import type { PropsWithChildren } from "react";

export function RacSection({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return <section className={`py-12 sm:py-16 ${className}`}>{children}</section>;
}
