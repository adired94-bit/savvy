"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelative } from "@/lib/format";
import { TOPIC_LABEL } from "@/lib/legal/il";
import { cn } from "@/lib/utils";
import type { ClaimCase } from "@/types/claims";
import { STATUS_META } from "./status";

export function CaseList({ cases, selectedId, onSelect }: { cases: ClaimCase[]; selectedId: string | null; onSelect: (id: string) => void }) {
  if (!cases.length) {
    return <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-muted">אין כאן תיקים כרגע.</p>;
  }
  return (
    <ul className="space-y-2">
      {cases.map((c) => {
        const meta = STATUS_META[c.status];
        const last = c.timeline.at(-1);
        const resolved = c.status === "resolved";
        return (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-start transition-colors",
                selectedId === c.id ? "border-money/40 bg-money/[0.06]" : "border-line bg-white/[0.02] hover:bg-white/[0.045]",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{c.provider}</p>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
                <p className="mt-0.5 truncate text-sm text-ink-muted">{c.title}</p>
                <p className="mt-0.5 text-xs text-ink-faint" suppressHydrationWarning>
                  {TOPIC_LABEL[c.topic]}
                  {last && ` · ${formatRelative(last.at)}`}
                </p>
              </div>
              <div className="text-end">
                <p className="text-[11px] text-ink-faint">{resolved ? "קיבלת" : "אפשר לחסוך"}</p>
                <p className={cn("num text-lg font-bold", resolved && "text-money-bright")}>{formatCurrency(c.actualSaving ?? c.estimatedSaving)}</p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
