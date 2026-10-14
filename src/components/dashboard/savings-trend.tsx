"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ACTIVE_MARKET } from "@/config/market";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MonthlySavings } from "@/types/finance";

const monthFmt = new Intl.DateTimeFormat(ACTIVE_MARKET.locale, { month: "short" });
/** Bars use up to 80% of the plot height, leaving headroom for the value tip. */
const HEADROOM = 0.8;

export function SavingsTrend({ trend }: { trend: MonthlySavings[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...trend.map((t) => t.amount));
  const avg = trend.reduce((s, t) => s + t.amount, 0) / trend.length;
  const last = trend.length - 1;
  const shown = hover ?? last;
  const pct = (v: number) => (v / max) * HEADROOM * 100;

  return (
    <GlassCard className="flex h-full flex-col">
      <SectionHeader title="מגמת חיסכון חודשית" subtitle={`ממוצע ${formatCurrency(avg)} לחודש`} />

      {/* Time flows with reading direction: oldest month at the inline-start edge */}
      <div className="flex flex-1 flex-col">
        <div className="relative flex min-h-44 flex-1 items-end gap-3 sm:gap-4">
          <div
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-line-strong"
            style={{ bottom: `${pct(avg)}%` }}
          />
          {trend.map((t, i) => (
            <div
              key={t.month}
              className="relative flex h-full flex-1 justify-center"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {shown === i && (
                <motion.span
                  layoutId="trend-tip"
                  className="num absolute z-10 rounded-md bg-ink px-1.5 py-0.5 text-[11px] font-semibold text-obsidian"
                  style={{ bottom: `calc(${pct(t.amount)}% + 6px)` }}
                >
                  {formatCurrency(t.amount)}
                </motion.span>
              )}
              <motion.div
                className={cn(
                  "absolute bottom-0 w-full max-w-11 rounded-t-lg rounded-b-sm transition-colors",
                  i === last
                    ? "bg-money"
                    : hover === i
                      ? "bg-white/[0.18]"
                      : "bg-white/[0.09]",
                )}
                initial={{ height: 0 }}
                animate={{ height: `${pct(t.amount)}%` }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-3 border-t border-line pt-2 sm:gap-4">
          {trend.map((t, i) => (
            <span key={t.month} className={cn("flex-1 text-center text-xs", i === last ? "font-medium text-ink" : "text-ink-faint")}>
              {monthFmt.format(new Date(`${t.month}-01T00:00:00`))}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
