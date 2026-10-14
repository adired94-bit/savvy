"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Animated bar that fills from the inline-start edge (right in RTL). */
export function ProgressBar({
  value,
  color = "var(--color-money)",
  className,
  delay = 0,
}: {
  value: number;
  color?: string;
  className?: string;
  delay?: number;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]", className)}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
