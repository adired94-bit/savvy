"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors disabled:opacity-50",
        checked ? "justify-end bg-money" : "justify-start bg-white/[0.14]",
      )}
    >
      <motion.span layout transition={{ type: "spring", stiffness: 600, damping: 36 }} className="size-6 rounded-full bg-white shadow" />
    </button>
  );
}
