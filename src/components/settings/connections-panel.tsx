"use client";

import { Check, CreditCard, Landmark, Mail, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { useVaultStore } from "@/store/vault-store";
import type { AccountKind } from "@/types/vault";

const GROUPS: { kind: AccountKind; title: string; icon: LucideIcon }[] = [
  { kind: "email", title: "מייל", icon: Mail },
  { kind: "bank", title: "בנקים", icon: Landmark },
  { kind: "card", title: "כרטיסי אשראי", icon: CreditCard },
];

export function ConnectionsPanel() {
  const accounts = useVaultStore((s) => s.accounts);
  const toggle = useVaultStore((s) => s.toggleAccount);

  return (
    <GlassCard>
      <SectionHeader title="חיבורים" subtitle="קריאה בלבד. אנחנו לא יכולים להזיז כסף." />
      <div className="space-y-5">
        {GROUPS.map((g) => (
          <div key={g.kind}>
            <p className="mb-2 text-sm font-medium text-ink-muted">{g.title}</p>
            <ul className="space-y-2">
              {accounts
                .filter((a) => a.kind === g.kind)
                .map((a) => (
                  <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.02] p-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-white/[0.06] text-ink-muted">
                      <g.icon className="size-[18px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-ink-muted">{a.connected ? a.detail : "לא מחובר"}</p>
                    </div>
                    {a.connected ? (
                      <div className="flex items-center gap-2">
                        <span className="grid size-6 place-items-center rounded-full bg-money/15 text-money">
                          <Check className="size-3.5" />
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => toggle(a.id)}>
                          ניתוק
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => toggle(a.id)}>
                        חיבור
                      </Button>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
