"use client";

import { ArrowDownLeft, Eye, FileSignature, KeyRound, Send, ShieldOff, type LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { formatRelative } from "@/lib/format";
import { useVaultStore } from "@/store/vault-store";
import type { AuditEntry } from "@/types/vault";

const ICON: Record<AuditEntry["kind"], LucideIcon> = {
  sent: Send,
  reply: ArrowDownLeft,
  read: Eye,
  grant: FileSignature,
  revoke: ShieldOff,
  key: KeyRound,
};

export function AuditLog() {
  const audit = useVaultStore((s) => s.audit);
  return (
    <GlassCard>
      <SectionHeader title="מה עשינו בשמך" subtitle="כל פעולה נרשמת כאן, ואי אפשר למחוק אותה." />
      <ul className="space-y-1">
        {audit.map((a) => {
          const Icon = ICON[a.kind];
          return (
            <li key={a.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-white/[0.03]">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-ink-muted">
                <Icon className="size-4" />
              </div>
              <p className="min-w-0 flex-1 text-sm">{a.text}</p>
              <span className="shrink-0 text-xs text-ink-faint" suppressHydrationWarning>
                {formatRelative(a.at)}
              </span>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
