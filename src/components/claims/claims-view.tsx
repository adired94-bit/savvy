"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClaims } from "@/hooks/use-claims";
import { useDashboard } from "@/hooks/use-dashboard";
import { ACTIVE_MARKET } from "@/config/market";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ClaimCase } from "@/types/claims";
import { ApprovalCard } from "./approval-card";
import { CaseDetail } from "./case-detail";
import { CaseList } from "./case-list";

type Filter = "all" | "active" | "done";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "הכל" },
  { id: "active", label: "בטיפול" },
  { id: "done", label: "הושלמו" },
];

/** Amounts are never converted: each currency is totalled on its own, e.g. "₪540 · $30". */
function totalParts(claims: ClaimCase[], amount: (c: ClaimCase) => number): string[] {
  const sums = new Map<string, number>();
  for (const c of claims) {
    const cur = c.currency ?? ACTIVE_MARKET.currency;
    sums.set(cur, (sums.get(cur) ?? 0) + amount(c));
  }
  const parts = [...sums].filter(([, v]) => v > 0).sort(([a]) => (a === ACTIVE_MARKET.currency ? -1 : 1));
  return parts.length ? parts.map(([cur, v]) => formatMoney(v, cur)) : [formatMoney(0)];
}

const isActive = (c: ClaimCase) => c.status === "sent" || c.status === "in_progress";

export function ClaimsView() {
  const { data: claims, isPending } = useClaims();
  const { data: dashboard } = useDashboard();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const waiting = claims?.filter((c) => c.status === "awaiting_approval") ?? [];
  const tracked = (claims ?? []).filter((c) => c.status !== "awaiting_approval");
  const visible = tracked.filter((c) => (filter === "all" ? true : filter === "active" ? isActive(c) : c.status === "resolved"));
  const selected = tracked.find((c) => c.id === selectedId) ?? null;

  const received = totalParts(tracked, (c) => c.actualSaving ?? 0);
  const expected = totalParts(tracked.filter(isActive), (c) => c.estimatedSaving);
  const awaiting = totalParts(waiting, (c) => c.estimatedSaving);

  return (
    <div className="space-y-6 lg:space-y-8">
      <TopBar firstName={dashboard?.user.firstName} title="התביעות שלך" />

      {isPending || !claims ? (
        <Skeleton className="h-96" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "קיבלת עד עכשיו", value: received, accent: true },
              { label: "בדרך אליך", value: expected },
              { label: "מחכה לאישור שלך", value: awaiting },
            ].map((t) => (
              <GlassCard key={t.label} className="p-5">
                <p className="text-sm text-ink-muted">{t.label}</p>
                <p className={cn("mt-1 text-3xl font-bold", t.accent && "text-money-bright")}><span className="flex flex-wrap items-baseline gap-x-3">
                    {t.value.map((v) => (
                      <span key={v} dir="ltr" className="num">
                        {v}
                      </span>
                    ))}
                  </span></p>
              </GlassCard>
            ))}
          </div>

          {waiting.length > 0 && (
            <section>
              <h2 className="mb-3 text-base font-semibold">מחכים לאישור שלך</h2>
              <div className="grid gap-5 lg:grid-cols-2">
                {waiting.map((c) => (
                  <ApprovalCard key={c.id} claim={c} />
                ))}
              </div>
            </section>
          )}

          <section className="grid items-start gap-5 xl:grid-cols-12">
            <div className={cn("xl:col-span-5", selected && "hidden xl:block")}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold">מעקב</h2>
                <div className="flex gap-1 rounded-xl bg-white/[0.04] p-1">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={cn(
                        "rounded-lg px-3 py-1 text-sm transition-colors",
                        filter === f.id ? "bg-card text-ink" : "text-ink-muted hover:text-ink",
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <CaseList cases={visible} selectedId={selectedId} onSelect={setSelectedId} />
            </div>

            <div className={cn("xl:col-span-7", !selected && "hidden xl:block")}>
              {selected ? (
                <div className="xl:sticky xl:top-8">
                  <CaseDetail claim={selected} onBack={() => setSelectedId(null)} />
                </div>
              ) : (
                <div className="grid h-72 place-items-center rounded-card border border-dashed border-line text-center text-sm text-ink-muted">
                  בחרו תיק כדי לראות מה קורה איתו
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
