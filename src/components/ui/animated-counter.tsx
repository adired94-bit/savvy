"use client";

import { animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Money roll-up counter. Writes to the DOM directly so it never re-renders React per frame. */
export function AnimatedCounter({
  value,
  duration = 1.8,
  delay = 0,
  className,
}: {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = formatCurrency(v);
      },
    });
    return () => controls.stop();
  }, [value, duration, delay]);

  return (
    <span ref={ref} className={cn("num", className)} aria-label={formatCurrency(value)}>
      {formatCurrency(0)}
    </span>
  );
}
