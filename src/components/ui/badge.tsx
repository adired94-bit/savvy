import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "money" | "alert" | "danger" | "info" | "neutral";

const tones: Record<Tone, string> = {
  money: "bg-money/12 text-money-bright ring-money/25",
  alert: "bg-alert/12 text-alert ring-alert/25",
  danger: "bg-danger/12 text-danger ring-danger/25",
  info: "bg-info/12 text-info ring-info/25",
  neutral: "bg-white/[0.06] text-ink-muted ring-line",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
