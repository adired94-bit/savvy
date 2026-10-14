"use client";

import { ArrowLeft, Check, ExternalLink, LoaderCircle, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { logSwitchEvent, switchGoUrl } from "@/lib/api/switch";
import { formatMoney } from "@/lib/format";
import { TOPIC_LABEL } from "@/lib/legal";
import { cn } from "@/lib/utils";
import type { SwitchOpportunity } from "@/types/switch";

/** What a representative receives. The user sees this list and ticks the box before anything is sent. */
const SHARED_FIELDS = [
  { id: "full_name", label: "השם המלא שלך" },
  { id: "phone", label: "מספר הטלפון שלך" },
  { id: "current_plan", label: "פרטי החיוב הנוכחי (חברה ומחיר)" },
];

// One impression per card per page load, even if the card remounts.
const seen = new Set<string>();

export function SwitchCard({ item, onDismiss }: { item: SwitchOpportunity; onDismiss: () => void }) {
  const { current, offer, yearlySaving } = item;
  const [asking, setAsking] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  useEffect(() => {
    if (seen.has(item.id)) return;
    seen.add(item.id);
    void logSwitchEvent(item, "impression");
  }, [item]);

  async function sendToAgent() {
    setState("sending");
    const ok = await logSwitchEvent(item, "agent_requested", { shared: SHARED_FIELDS.map((f) => f.id) });
    setState(ok ? "sent" : "failed");
  }

  const canDigital = offer.mode !== "agent";
  const canAgent = offer.mode !== "digital";

  return (
    <GlassCard className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-ink-muted">{TOPIC_LABEL[offer.topic]}</p>
          <h3 dir="auto" className="mt-1 text-lg font-semibold leading-snug">
            אפשר לשלם פחות על {current.label}
          </h3>
        </div>
        <button
          onClick={() => {
            void logSwitchEvent(item, "dismissed");
            onDismiss();
          }}
          aria-label="לא מעניין אותי"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-white/[0.06] hover:text-ink"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
        <div className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-inset ring-line">
          <p className="text-xs text-ink-muted">היום</p>
          <p dir="auto" className="mt-1 truncate text-sm font-medium">{current.provider}</p>
          <p className="mt-1 text-xl font-bold" dir="ltr">
            <span className="num">{formatMoney(current.monthlyPrice, current.currency)}</span>
            <span className="ms-1 text-xs font-normal text-ink-faint">/mo</span>
          </p>
        </div>
        <div className="grid place-items-center text-ink-faint">
          <ArrowLeft className="size-4" />
        </div>
        <div className="rounded-xl bg-money/[0.07] p-3 ring-1 ring-inset ring-money/25">
          <p className="text-xs text-money-bright">מומלץ</p>
          <p dir="auto" className="mt-1 truncate text-sm font-medium">
            {offer.provider}
            {offer.planName ? ` · ${offer.planName}` : ""}
          </p>
          <p className="mt-1 text-xl font-bold text-money-bright" dir="ltr">
            <span className="num">{formatMoney(offer.monthlyPrice, offer.currency)}</span>
            <span className="ms-1 text-xs font-normal text-ink-faint">/mo</span>
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-muted">
        חיסכון של <span className="num text-xl font-bold text-money-bright">{formatMoney(yearlySaving, offer.currency)}</span> בשנה
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {offer.highlights.map((h) => (
          <Badge key={h}>{h}</Badge>
        ))}
        {offer.minTermMonths ? <Badge tone="alert">התחייבות {offer.minTermMonths} חודשים</Badge> : null}
      </div>

      {state === "sent" ? (
        <p role="status" className="mt-5 flex items-center gap-2 rounded-xl bg-money/[0.08] px-3 py-3 text-sm text-money-bright">
          <Check className="size-4 shrink-0" />
          הבקשה נרשמה אצלנו, עם הפרטים שאישרת.
        </p>
      ) : asking ? (
        <div className="mt-5 rounded-2xl border border-line bg-obsidian/50 p-4">
          <p className="text-sm font-medium">מה נשלח לנציג של {offer.provider}</p>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            {SHARED_FIELDS.map((f) => (
              <li key={f.id} className="flex items-center gap-2">
                <Check className="size-3.5 text-money" /> {f.label}
              </li>
            ))}
          </ul>
          <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 size-4 accent-[var(--color-money)]" />
            אני מאשר/ת לשלוח את הפרטים האלה ל-{offer.provider}, כדי שנציג יצור איתי קשר.
          </label>
          {state === "failed" && <p className="mt-2 text-sm text-alert">לא הצלחנו לרשום את הבקשה. נסו שוב.</p>}
          <div className="mt-3 flex gap-2">
            <Button disabled={!agreed || state === "sending"} onClick={sendToAgent} className="flex-1">
              {state === "sending" ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
              שליחה
            </Button>
            <Button variant="ghost" onClick={() => setAsking(false)}>
              ביטול
            </Button>
          </div>
        </div>
      ) : (
        <div className={cn("mt-5 grid gap-2", canDigital && canAgent && "sm:grid-cols-2")}>
          {canDigital && (
            <a
              href={switchGoUrl(item)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-money px-5 text-base font-semibold text-obsidian transition-colors hover:bg-money-bright"
            >
              <ExternalLink className="size-5" />
              מעבר דיגיטלי מהיר
            </a>
          )}
          {canAgent && (
            <Button size="lg" variant={canDigital ? "secondary" : "primary"} onClick={() => setAsking(true)}>
              <Send className="size-5" />
              שלחו את הפרטים לנציג
            </Button>
          )}
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        אם תעברו דרכנו, Savvy מקבלת עמלה מהחברה. המחיר שלכם לא משתנה, ואנחנו מציגים הצעות לפי החיסכון שלכם בלבד.
      </p>
    </GlassCard>
  );
}
