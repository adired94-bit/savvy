"use client";

import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ClaimCase } from "@/types/claims";
import { STEPS } from "./status";

/** Vertical timeline: the three milestones always show, reached ones carry the real event. */
export function Timeline({ claim }: { claim: ClaimCase }) {
  return (
    <ol className="relative space-y-0">
      {STEPS.map((step, i) => {
        const ev = [...claim.timeline].reverse().find((e) => e.status === step.status);
        const reached = !!ev;
        const isLast = i === STEPS.length - 1;
        const nextReached = !isLast && claim.timeline.some((e) => e.status === STEPS[i + 1].status);
        const current = reached && !nextReached && claim.status !== "resolved";
        return (
          <li key={step.status} className="relative flex gap-4 pb-7 last:pb-0">
            {!isLast && (
              <span
                className={cn("absolute start-[15px] top-8 bottom-0 w-px", nextReached ? "bg-money" : "bg-line-strong")}
                aria-hidden
              />
            )}
            <motion.div
              initial={false}
              animate={{ scale: current ? [1, 1.12, 1] : 1 }}
              transition={{ repeat: current ? Infinity : 0, duration: 2.4 }}
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full",
                reached ? "bg-money text-obsidian" : "bg-card text-ink-faint ring-1 ring-inset ring-line-strong",
              )}
            >
              {reached && !current ? <Check className="size-4" strokeWidth={3} /> : <Clock className="size-4" />}
            </motion.div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className={cn("font-medium", !reached && "text-ink-faint")}>{ev?.title ?? step.label}</p>
                {ev && (
                  <span className="shrink-0 text-xs text-ink-faint" suppressHydrationWarning>
                    {formatRelative(ev.at)}
                  </span>
                )}
              </div>
              {ev?.detail && <p className="mt-0.5 text-sm text-ink-muted">{ev.detail}</p>}
              {!reached && <p className="mt-0.5 text-sm text-ink-faint">עוד לא התחיל</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
