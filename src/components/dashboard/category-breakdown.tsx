"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { CATEGORIES, CATEGORY_ORDER } from "@/config/categories";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import type { CategorySavings } from "@/types/finance";

const SIZE = 200;
const STROKE = 22;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;
const GAP = 4;

export function CategoryBreakdown({ categories }: { categories: CategorySavings[] }) {
  const active = useUiStore((s) => s.activeCategory);
  const setActive = useUiStore((s) => s.setActiveCategory);

  const sorted = CATEGORY_ORDER.map((id) => categories.find((c) => c.id === id)).filter(Boolean) as CategorySavings[];
  const total = sorted.reduce((sum, c) => sum + c.amount, 0);
  const max = Math.max(...sorted.map((c) => c.amount));

  const segments = sorted.map((c, i) => {
    const len = (c.amount / total) * C;
    const offset = sorted.slice(0, i).reduce((sum, p) => sum + (p.amount / total) * C, 0);
    return { ...c, len, offset };
  });

  const focus = active ? sorted.find((c) => c.id === active) : null;

  return (
    <GlassCard className="h-full">
      <SectionHeader title="חיסכון לפי קטגוריה" subtitle="מאז ההצטרפות" />

      <div className="flex flex-col items-center gap-8 md:flex-row md:items-center">
        <div className="relative shrink-0" onMouseLeave={() => setActive(null)}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
            <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgb(255 255 255 / 0.04)" strokeWidth={STROKE} />
            {segments.map((s, i) => (
              <motion.circle
                key={s.id}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={CATEGORIES[s.id].color}
                strokeLinecap="round"
                strokeDashoffset={-s.offset}
                initial={{ strokeDasharray: `0 ${C}`, strokeWidth: STROKE }}
                animate={{
                  strokeDasharray: `${Math.max(s.len - GAP, 0)} ${C}`,
                  strokeWidth: active === s.id ? STROKE + 6 : STROKE,
                  opacity: active && active !== s.id ? 0.3 : 1,
                }}
                transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActive(s.id)}
                className="cursor-pointer"
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-xs text-ink-muted">{focus ? CATEGORIES[focus.id].label : "סה״כ"}</p>
              <p className="num mt-1 text-2xl font-bold">{formatCurrency(focus ? focus.amount : total)}</p>
              {focus && <p className="num mt-0.5 text-xs text-ink-faint">{formatPercent(focus.amount / total)}</p>}
            </div>
          </div>
        </div>

        <ul className="w-full flex-1 space-y-1">
          {sorted.map((c, i) => {
            const meta = CATEGORIES[c.id];
            return (
              <li
                key={c.id}
                onMouseEnter={() => setActive(c.id)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  "rounded-xl px-3 py-2.5 transition-colors",
                  active === c.id ? "bg-white/[0.05]" : "hover:bg-white/[0.03]",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("grid size-8 place-items-center rounded-lg", meta.tint)}>
                    <meta.icon className="size-4" />
                  </div>
                  <span className="flex-1 text-sm">{meta.label}</span>
                  <span className="text-xs text-ink-faint">
                    <span className="num">{c.cases}</span> תיקים
                  </span>
                  <span className="num w-20 text-end text-sm font-semibold">{formatCurrency(c.amount)}</span>
                </div>
                <ProgressBar value={c.amount / max} color={meta.color} delay={0.2 + i * 0.08} className="mt-2 ms-11 w-auto" />
              </li>
            );
          })}
        </ul>
      </div>
    </GlassCard>
  );
}
