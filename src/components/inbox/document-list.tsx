"use client";

import { LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/config/categories";
import { formatMoney, formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { InboxDocument } from "@/types/inbox";
import { SOURCE_META } from "./source";

export function DocumentList({
  documents,
  selectedId,
  onSelect,
}: {
  documents: InboxDocument[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="space-y-2">
      {documents.map((d) => {
        const src = SOURCE_META[d.source];
        const cat = d.category in CATEGORIES ? CATEGORIES[d.category as keyof typeof CATEGORIES] : null;
        const processing = d.status === "processing";
        return (
          <li key={d.id}>
            <button
              disabled={processing}
              onClick={() => onSelect(d.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-start transition-colors",
                selectedId === d.id ? "border-money/40 bg-money/[0.06]" : "border-line bg-white/[0.02] hover:bg-white/[0.045]",
              )}
            >
              <div className={cn("grid size-11 shrink-0 place-items-center rounded-xl", cat ? cat.tint : "bg-white/[0.06] text-ink-muted")}>
                {processing ? <LoaderCircle className="size-5 animate-spin" /> : cat ? <cat.icon className="size-5" /> : <src.icon className="size-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{d.provider}</p>
                  {d.status === "needs_review" && <Badge tone="alert">שווה לבדוק</Badge>}
                </div>
                <p className="truncate text-sm text-ink-muted">{d.finding ?? d.label}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-faint" suppressHydrationWarning>
                  <src.icon className="size-3" />
                  {src.label} · {formatRelative(d.receivedAt)}
                </p>
              </div>
              {!processing && <p className="num text-lg font-bold">{formatMoney(d.total, d.currency)}</p>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
