"use client";

import { Ban } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Switch } from "@/components/ui/switch";
import { TOPIC_LABEL } from "@/lib/legal/il";
import { CAPABILITIES, NEVER_DO } from "@/lib/vault/poa";
import { cn } from "@/lib/utils";
import { useVaultStore } from "@/store/vault-store";
import type { ClaimTopic } from "@/types/claims";

const TOPICS = Object.keys(TOPIC_LABEL) as ClaimTopic[];

export function PermissionsPanel() {
  const { poa, setTopics, toggleCapability, setRequireApproval } = useVaultStore();
  const active = poa.status === "active";

  return (
    <GlassCard className={cn(!active && "opacity-60")}>
      <SectionHeader title="מה מותר לנו" subtitle={active ? "אפשר לשנות בכל רגע, וזה נכנס לתוקף מיד." : "ייפתח אחרי החתימה על ייפוי הכוח."} />

      <div className={cn("space-y-6", !active && "pointer-events-none")}>
        <div>
          <p className="mb-2 text-sm font-medium text-ink-muted">נושאים</p>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const on = poa.topics.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => setTopics(on ? poa.topics.filter((x) => x !== t) : [...poa.topics, t])}
                  className={cn("rounded-full px-3.5 py-1.5 text-sm ring-1 ring-inset transition-colors", on ? "bg-money/12 text-money-bright ring-money/30" : "text-ink-muted ring-line hover:text-ink")}
                >
                  {TOPIC_LABEL[t]}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="divide-y divide-line">
          {CAPABILITIES.map((c) => (
            <li key={c.id} className="flex items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{c.label}</p>
                <p className="text-xs text-ink-muted">{c.hint}</p>
              </div>
              <Switch checked={poa.capabilities.includes(c.id)} onChange={() => toggleCapability(c.id)} label={c.label} />
            </li>
          ))}
          <li className="flex items-center gap-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">אישור שלי לפני כל פנייה</p>
              <p className="text-xs text-ink-muted">שום מכתב לא יוצא בלי הלחיצה שלך.</p>
            </div>
            <Switch checked={poa.requireApproval} onChange={setRequireApproval} label="אישור לפני כל פנייה" />
          </li>
        </ul>

        <div className="rounded-2xl border border-line bg-white/[0.03] p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Ban className="size-4 text-danger" />
            מה אנחנו אף פעם לא עושים
          </p>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            {NEVER_DO.map((n) => (
              <li key={n}>• {n}</li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}
