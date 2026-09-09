import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export type RacButtonVariant = "primary" | "secondary" | "ghost";

const variants: Record<RacButtonVariant, string> = {
  primary: "bg-rac-lac text-white hover:bg-rac-lac-dark focus-visible:ring-rac-gold",
  secondary: "bg-rac-blue text-white hover:bg-rac-blue-light focus-visible:ring-rac-gold",
  ghost: "bg-transparent text-rac-blue hover:bg-slate-100 focus-visible:ring-rac-gold",
};

export function RacButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: RacButtonVariant }>) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--rac-radius-md)] px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
