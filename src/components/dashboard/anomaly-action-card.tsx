"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleCheck, LoaderCircle, Scale, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { CATEGORIES } from "@/config/categories";
import { formatCurrency } from "@/lib/format";
import { useUiStore } from "@/store/ui-store";
import type { Anomaly } from "@/types/finance";

/** One-tap approval card: the core interaction of the product. */
export function AnomalyActionCard({ anomaly }: { anomaly: Anomaly }) {
  const status = useUiStore((s) => s.anomalyStatus[anomaly.id] ?? "pending");
  const approve = useUiStore((s) => s.approveAnomaly);
  const cat = CATEGORIES[anomaly.category];

  return (
    <GlassCard className="flex h-full flex-col border-alert/25">
      <div className="flex items-center justify-between gap-2">
        <Badge tone="alert">
          <TriangleAlert className="size-3.5" />
          כדאי לבדוק
        </Badge>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className={`grid size-11 place-items-center rounded-xl ${cat.tint}`}>
          <cat.icon className="size-5" />
        </div>
        <div>
          <p className="text-xs text-ink-muted">{anomaly.provider}</p>
          <h3 className="font-semibold leading-snug">{anomaly.title}</h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{anomaly.description}</p>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5 text-xs text-ink-muted ring-1 ring-inset ring-line">
        <Scale className="mt-0.5 size-3.5 shrink-0 text-info" />
        <span>{anomaly.legalBasis}</span>
      </div>

      <div className="mt-auto pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm text-ink-muted">אפשר לחסוך</span>
          <span className="num text-3xl font-bold text-money-bright">{formatCurrency(anomaly.amount)}</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status === "handed_off" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 rounded-xl bg-money/12 px-4 py-3 text-sm text-money-bright ring-1 ring-inset ring-money/30"
            >
              <CircleCheck className="size-5 shrink-0" />
              <span>אנחנו על זה. נעדכן אותך בכל שלב.</span>
            </motion.div>
          ) : (
            <motion.div key="cta" exit={{ opacity: 0, scale: 0.96 }}>
              <Button size="lg" className="w-full" disabled={status === "approving"} onClick={() => approve(anomaly.id)}>
                {status === "approving" ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" />
                    רגע…
                  </>
                ) : (
                  <>
                    <Check className="size-5" />
                    אישור ל-AI לטפל בזה
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
