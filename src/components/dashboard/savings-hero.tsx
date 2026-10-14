"use client";

import { motion } from "framer-motion";
import { Repeat, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { DashboardData } from "@/types/finance";

export function SavingsHero({ savings, openCases }: { savings: DashboardData["savings"]; openCases: number }) {
  return (
    <GlassCard className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-money/60" />
            <span className="relative size-2.5 rounded-full bg-money" />
          </span>
          מטפלים עכשיו ב-<span className="num">{openCases}</span> תיקים
        </div>
        <Badge tone="money">
          <TrendingUp className="size-3.5" />
          <span className="num">+{formatPercent(savings.monthDelta)}</span> מהחודש הקודם
        </Badge>
      </div>

      <div className="relative grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:items-end">
        <div>
          <p className="text-sm font-medium text-ink-muted">נחסך החודש</p>
          <AnimatedCounter value={savings.month} className="mt-2 text-[3.25rem] font-bold leading-none tracking-tight text-money sm:text-display" />
        </div>
        <div className="sm:border-s sm:border-line sm:ps-8">
          <p className="text-sm font-medium text-ink-muted">סה״כ נחסך מאז ההצטרפות</p>
          <AnimatedCounter value={savings.lifetime} delay={0.15} duration={2.2} className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-sm"
      >
        <div className="grid size-8 place-items-center rounded-lg bg-money/12 text-money">
          <Repeat className="size-4" />
        </div>
        <p className="text-ink-muted">
          ההוזלות הקבועות שהשגנו שוות לך{" "}
          <span className="num font-semibold text-ink">{formatCurrency(savings.annualizedRecurring)}</span> בשנה
        </p>
      </motion.div>
    </GlassCard>
  );
}
