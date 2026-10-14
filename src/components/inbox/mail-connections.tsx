"use client";

import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/format";
import type { MailConnection } from "@/types/inbox";

export function MailConnections({ connections }: { connections: MailConnection[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {connections.map((c) => (
        <div key={c.id} className="flex min-w-60 flex-1 items-center gap-3 rounded-2xl border border-line bg-white/[0.03] p-3.5">
          <div className="grid size-10 place-items-center rounded-xl bg-white/[0.06]">
            <Mail className="size-[18px] text-ink-muted" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{c.label}</p>
            <p className="truncate text-xs text-ink-muted" suppressHydrationWarning>
              {c.connected ? (
                <>
                  <span dir="ltr" className="inline-block">{c.account}</span> · עודכן {c.lastSync && formatRelative(c.lastSync)}
                </>
              ) : (
                "לא מחובר"
              )}
            </p>
          </div>
          {c.connected ? (
            <span className="grid size-7 place-items-center rounded-full bg-money/15 text-money">
              <Check className="size-4" />
            </span>
          ) : (
            <Button size="sm" variant="secondary">
              חיבור
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
