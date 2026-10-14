"use client";

import { ArrowRight, CircleAlert, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ACTIVE_MARKET } from "@/config/market";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { InboxDocument } from "@/types/inbox";
import { SOURCE_META } from "./source";

const dateFmt = new Intl.DateTimeFormat(ACTIVE_MARKET.locale, { day: "numeric", month: "short" });
const preciseFmt = new Intl.NumberFormat(ACTIVE_MARKET.locale, { style: "currency", currency: ACTIVE_MARKET.currency });

export function DocumentDetail({ doc, onBack }: { doc: InboxDocument; onBack: () => void }) {
  const flagged = doc.lineItems.filter((l) => l.flag);
  const src = SOURCE_META[doc.source];

  return (
    <GlassCard key={doc.id} className="p-0">
      <div className="p-5 sm:p-6">
        <button onClick={onBack} className="mb-4 flex items-center gap-1 text-sm text-ink-muted hover:text-ink xl:hidden">
          <ArrowRight className="size-4" />
          חזרה לרשימה
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink-muted">{doc.label}</p>
            <h2 className="mt-0.5 text-xl font-bold">{doc.provider}</h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-ink-faint">
              <src.icon className="size-3" /> {src.label}
            </p>
          </div>
          <div className="text-end">
            <p className="text-sm text-ink-muted">סה״כ לתשלום</p>
            <p className="num text-3xl font-bold">{preciseFmt.format(doc.total)}</p>
          </div>
        </div>

        {doc.previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={doc.previewUrl} alt="התמונה שסרקתם" className="mt-5 max-h-56 w-full rounded-xl border border-line object-cover object-top" />
        )}
      </div>

      {doc.potentialSaving ? (
        <div className="mx-5 mb-5 flex flex-wrap items-center gap-4 rounded-2xl border border-money/25 bg-money/[0.07] p-4 sm:mx-6">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink-muted">{doc.finding}</p>
            <p className="mt-0.5 font-semibold">
              אפשר להחזיר לך <span className="num text-xl text-money-bright">{formatCurrency(doc.potentialSaving)}</span>
            </p>
          </div>
          <Button>נטפל בזה</Button>
        </div>
      ) : (
        <p className="mx-5 mb-5 rounded-2xl bg-white/[0.03] p-4 text-sm text-ink-muted sm:mx-6">הכל נראה תקין בחשבון הזה.</p>
      )}

      <div className="border-t border-line">
        <p className="px-5 pt-4 text-sm font-semibold text-ink-muted sm:px-6">מה חויבת עליו</p>
        <ul className="divide-y divide-line">
          {doc.lineItems.map((l) => (
            <li key={l.id} className={cn("px-5 py-3.5 sm:px-6", l.flag && "bg-alert/[0.06]")}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{l.name}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-faint">
                    <span className="num">{dateFmt.format(new Date(l.date))}</span>
                    {l.recurrence === "recurring" && (
                      <span className="flex items-center gap-1">
                        <Repeat className="size-3" /> חוזר כל חודש
                      </span>
                    )}
                  </p>
                </div>
                <p className="num font-bold">{preciseFmt.format(l.amount)}</p>
              </div>
              {l.flag && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-alert">
                  <CircleAlert className="size-4 shrink-0" />
                  {l.flag}
                </p>
              )}
            </li>
          ))}
        </ul>
        {flagged.length > 0 && (
          <p className="border-t border-line px-5 py-3 text-xs text-ink-faint sm:px-6">
            קראנו את המסמך אוטומטית. אם משהו לא נראה נכון, אפשר לתקן.
          </p>
        )}
      </div>
    </GlassCard>
  );
}
