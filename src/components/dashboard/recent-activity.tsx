"use client";

import { ArrowDownLeft, FileText, Radar, TrendingDown } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { formatRelative, formatSignedCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/types/finance";

const KIND = {
  refund: { icon: ArrowDownLeft, cls: "bg-money/12 text-money" },
  price_drop: { icon: TrendingDown, cls: "bg-money/12 text-money" },
  letter: { icon: FileText, cls: "bg-info/12 text-info" },
  detected: { icon: Radar, cls: "bg-alert/12 text-alert" },
} as const;

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  const sorted = [...items].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <GlassCard className="h-full">
      <SectionHeader title="פעילות אחרונה" />
      <ul className="space-y-1">
        {sorted.map((item) => {
          const { icon: Icon, cls } = KIND[item.kind];
          return (
            <li key={item.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.03]">
              <div className={cn("grid size-9 shrink-0 place-items-center rounded-full", cls)}>
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{item.title}</p>
                <p className="text-xs text-ink-faint" suppressHydrationWarning>
                  {item.provider} · {formatRelative(item.at)}
                </p>
              </div>
              {item.amount != null && (
                <span className="num text-sm font-semibold text-money-bright">{formatSignedCurrency(item.amount)}</span>
              )}
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
