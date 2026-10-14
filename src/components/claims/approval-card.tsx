"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, LoaderCircle, Scale } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useApproveClaim } from "@/hooks/use-claims";
import { formatMoney } from "@/lib/format";
import { groundsById, TOPIC_LABEL } from "@/lib/legal";
import { cn } from "@/lib/utils";
import type { ClaimCase } from "@/types/claims";
import { LetterPreview } from "./letter-preview";

/** The one-tap card: what we found, why it is wrong, what you could get, one button. */
export function ApprovalCard({ claim }: { claim: ClaimCase }) {
  const approve = useApproveClaim();
  const [showLetter, setShowLetter] = useState(false);
  const grounds = claim.groundIds.map((id) => groundsById[id]).filter(Boolean);

  return (
    <GlassCard className="flex flex-col border-alert/25">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-ink-muted">
            {claim.provider} · {TOPIC_LABEL[claim.topic]}
          </p>
          <h3 dir="auto" className="mt-1 text-lg font-semibold leading-snug">{claim.title}</h3>
        </div>
        <div className="shrink-0 text-end">
          <p className="text-xs text-ink-muted">אפשר לחסוך</p>
          <p className="num text-3xl font-bold text-money-bright">{formatMoney(claim.estimatedSaving, claim.currency)}</p>
        </div>
      </div>

      <p dir="auto" className="mt-3 text-sm leading-relaxed text-ink-muted">{claim.finding}</p>

      <div className="mt-4 space-y-2">
        {grounds.map((g) => (
          <div key={g.id} className="flex items-start gap-2.5 rounded-xl bg-white/[0.03] px-3 py-2.5 ring-1 ring-inset ring-line">
            <Scale className="mt-0.5 size-4 shrink-0 text-info" />
            <div className="min-w-0 text-sm">
              <p dir="auto">{g.plain}</p>
              <p dir="auto" className="mt-0.5 text-xs text-ink-faint">
                {g.law}
                {g.section ? `, ${g.section}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowLetter((v) => !v)}
        className="mt-4 flex w-fit items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ChevronDown className={cn("size-4 transition-transform", showLetter && "rotate-180")} />
        {showLetter ? "הסתרת המכתב" : "לראות את המכתב לפני שנשלח"}
      </button>
      <AnimatePresence initial={false}>
        {showLetter && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-3">
              <LetterPreview claim={claim} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button size="lg" className="mt-5 w-full" disabled={approve.isPending} onClick={() => approve.mutate(claim.id)}>
        {approve.isPending ? (
          <>
            <LoaderCircle className="size-5 animate-spin" />
            שולחים…
          </>
        ) : (
          <>
            <Check className="size-5" />
            אישור ל-AI לטפל בזה
          </>
        )}
      </Button>
      <p className="mt-2 text-center text-xs text-ink-faint">לא נשלח כלום בלי האישור שלך.</p>
    </GlassCard>
  );
}
