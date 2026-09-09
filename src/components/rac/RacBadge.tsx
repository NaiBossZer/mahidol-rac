import type { PropsWithChildren } from "react";

export type RacBadgeTone = "brand" | "gold" | "green" | "muted";

const tones: Record<RacBadgeTone, string> = {
  brand: "bg-rac-lac/10 text-rac-lac border-rac-lac/20",
  gold: "bg-rac-gold/15 text-amber-900 border-rac-gold/30",
  green: "bg-rac-green/10 text-rac-green border-rac-green/20",
  muted: "bg-slate-100 text-slate-600 border-slate-200",
};

export function RacBadge({
  children,
  tone = "brand",
  className = "",
}: PropsWithChildren<{ tone?: RacBadgeTone; className?: string }>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
