"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  /** Lift + emerald rim on hover. */
  interactive?: boolean;
  glow?: boolean;
}

export function GlassCard({ className, interactive, glow, children, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={interactive ? { y: -3 } : undefined}
      className={cn(
        "glass relative overflow-hidden p-5 sm:p-6 transition-[box-shadow,border-color] duration-300",
        interactive && "hover:border-line-strong hover:bg-card/70",
        glow && "shadow-glow",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
