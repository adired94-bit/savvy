"use client";

import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { formatMoney } from "@/lib/format";
import { groundsById, TOPIC_LABEL } from "@/lib/legal";
import type { ClaimCase } from "@/types/claims";
import { LetterPreview } from "./letter-preview";
import { STATUS_META } from "./status";
import { Timeline } from "./timeline";

export function CaseDetail({ claim, onBack }: { claim: ClaimCase; onBack: () => void }) {
  const meta = STATUS_META[claim.status];
  const resolved = claim.status === "resolved";
  const grounds = claim.groundIds.map((id) => groundsById[id]).filter(Boolean);

  return (
    <GlassCard key={claim.id} className="space-y-6">
      <div>
        <button onClick={onBack} className="mb-4 flex items-center gap-1 text-sm text-ink-muted hover:text-ink xl:hidden">
          <ArrowRight className="size-4" />
          חזרה לרשימה
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink-muted">
              {claim.provider} · {TOPIC_LABEL[claim.topic]}
            </p>
            <h2 dir="auto" className="mt-1 text-xl font-bold">{claim.title}</h2>
            <div className="mt-2">
              <Badge tone={meta.tone}>{meta.label}</Badge>
            </div>
          </div>
          <div className="text-end">
            <p className="text-sm text-ink-muted">{resolved ? "קיבלת" : "אפשר לחסוך"}</p>
            <p className="num text-3xl font-bold text-money-bright">{formatMoney(claim.actualSaving ?? claim.estimatedSaving, claim.currency)}</p>
          </div>
        </div>
        <p dir="auto" className="mt-3 text-sm leading-relaxed text-ink-muted">{claim.finding}</p>
      </div>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-ink-muted">מה קורה עם זה</h3>
        <Timeline claim={claim} />
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-ink-muted">על מה זה מבוסס</h3>
        <ul className="space-y-1.5 text-sm">
          {grounds.map((g) => (
            <li key={g.id} className="text-ink-muted">
              <span className="text-ink">{g.plain}</span> ({g.law}
              {g.section ? `, ${g.section}` : ""})
            </li>
          ))}
        </ul>
      </section>

      {claim.timeline.length > 0 && <LetterPreview claim={claim} />}
    </GlassCard>
  );
}
