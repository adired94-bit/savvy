"use client";

import { motion } from "framer-motion";
import { ChevronLeft, MessageSquareText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { CATEGORIES } from "@/config/categories";
import { formatCurrency, formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Negotiation, NegotiationStage } from "@/types/finance";

const STAGES: { id: NegotiationStage; label: string }[] = [
  { id: "detected", label: "זוהה" },
  { id: "letter_sent", label: "נשלח מכתב" },
  { id: "negotiating", label: "במשא ומתן" },
  { id: "resolved", label: "הושג" },
];

const STAGE_TONE: Record<NegotiationStage, "neutral" | "info" | "alert" | "money"> = {
  detected: "neutral",
  letter_sent: "info",
  negotiating: "alert",
  resolved: "money",
};

function StageTrack({ stage }: { stage: NegotiationStage }) {
  const current = STAGES.findIndex((s) => s.id === stage);
  return (
    <div className="flex items-center gap-1.5" aria-label={`שלב ${current + 1} מתוך ${STAGES.length}`}>
      {STAGES.map((s, i) => (
        <div key={s.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
          <motion.div
            className={cn("h-full rounded-full", stage === "resolved" ? "bg-money" : "bg-money/80")}
            initial={{ width: 0 }}
            animate={{ width: i <= current ? "100%" : "0%" }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
          />
        </div>
      ))}
    </div>
  );
}

function NegotiationCard({ n }: { n: Negotiation }) {
  const cat = CATEGORIES[n.category];
  const stageLabel = STAGES.find((s) => s.id === n.stage)!.label;
  return (
    <GlassCard interactive className="group flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <div className={cn("grid size-10 shrink-0 place-items-center rounded-xl", cat.tint)}>
          <cat.icon className="size-[18px]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">{n.provider}</p>
            <Badge tone={STAGE_TONE[n.stage]}>
              {n.stage !== "resolved" && <span className="size-1.5 animate-pulse-soft rounded-full bg-current" />}
              {stageLabel}
            </Badge>
          </div>
          <p className="mt-0.5 truncate text-sm text-ink-muted">{n.title}</p>
        </div>
      </div>

      <StageTrack stage={n.stage} />

      <div className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
        <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-ink-faint" />
        <span className="line-clamp-2">{n.lastUpdate}</span>
      </div>

      <div className="mt-auto flex items-end justify-between border-t border-line pt-3">
        <div>
          <p className="text-[11px] text-ink-faint">{n.stage === "resolved" ? "חסכנו" : "צפוי לחסוך"}</p>
          <p className="text-xl font-bold text-money-bright">
            <span className="num">{formatCurrency(n.expectedSaving)}</span>
            {n.recurrence === "monthly" && <span className="ms-1 text-xs font-normal text-ink-muted">לחודש</span>}
          </p>
        </div>
        <span className="flex items-center gap-1 text-xs text-ink-faint" suppressHydrationWarning>
          {formatRelative(n.updatedAt)}
          <ChevronLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5 ltr:rotate-180" />
        </span>
      </div>
    </GlassCard>
  );
}

export function ActiveNegotiations({ negotiations }: { negotiations: Negotiation[] }) {
  const open = negotiations.filter((n) => n.stage !== "resolved").length;
  return (
    <section>
      <SectionHeader
        title="בטיפול שלנו"
        subtitle={`${open} תיקים פתוחים`}
        action={
          <button className="text-sm text-money transition-colors hover:text-money-bright">הצגת הכל</button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {negotiations.map((n) => (
          <NegotiationCard key={n.id} n={n} />
        ))}
      </div>
    </section>
  );
}
