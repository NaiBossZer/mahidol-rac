import type { PropsWithChildren } from "react";

export type RacCardVariant = "default" | "lac" | "executive" | "interactive" | "featured";

const variants: Record<RacCardVariant, string> = {
  default: "bg-white border-rac-border shadow-[var(--rac-shadow-card)]",
  lac: "bg-white border-rac-lac/15 shadow-[var(--rac-shadow-card)]",
  executive: "bg-slate-900 text-white border-white/10 shadow-[var(--rac-shadow-elevated)]",
  interactive:
    "bg-white border-rac-border shadow-[var(--rac-shadow-card)] transition-transform hover:-translate-y-1 hover:shadow-[var(--rac-shadow-elevated)]",
  featured: "bg-rac-blue text-white border-rac-blue shadow-[var(--rac-shadow-elevated)]",
};

export function RacCard({
  children,
  variant = "default",
  className = "",
}: PropsWithChildren<{ variant?: RacCardVariant; className?: string }>) {
  return (
    <div
      className={`rounded-[var(--rac-radius-lg)] border p-[var(--rac-card-padding)] ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
