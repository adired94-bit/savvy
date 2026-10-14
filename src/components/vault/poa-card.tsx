"use client";

import { Ban, FileSignature, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { TOPIC_LABEL } from "@/lib/legal/il";
import { formatDate } from "@/lib/vault/poa";
import { useVaultStore } from "@/store/vault-store";
import { PoaWizard } from "./poa-wizard";

export function PoaCard() {
  const poa = useVaultStore((s) => s.poa);
  const revoke = useVaultStore((s) => s.revokePoa);
  const [open, setOpen] = useState(false);
  const active = poa.status === "active";

  return (
    <GlassCard className={active ? "border-money/30" : undefined}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`grid size-12 shrink-0 place-items-center rounded-2xl ${active ? "bg-money/15 text-money" : "bg-white/[0.06] text-ink-muted"}`}>
            {active ? <ShieldCheck className="size-6" /> : <FileSignature className="size-6" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">ייפוי כוח</h2>
              {active ? <Badge tone="money">פעיל</Badge> : poa.status === "revoked" ? <Badge tone="danger">בוטל</Badge> : <Badge>לא נחתם</Badge>}
            </div>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-muted">
              {active
                ? `אנחנו פועלים בשמך בנושאי ${poa.topics.map((t) => TOPIC_LABEL[t]).join(", ")}.`
                : poa.status === "revoked"
                  ? "ייפוי הכוח בוטל. אנחנו לא שולחים שום דבר בשמך עד שתחתום שוב."
                  : "כדי שנוכל לפנות לחברות בשמך צריך חתימה קצרה. זה לוקח פחות מדקה."}
            </p>
            {active && poa.signedAt && poa.expiresAt && (
              <p className="mt-2 text-xs text-ink-faint">
                נחתם ב-{formatDate(poa.signedAt)} · בתוקף עד {formatDate(poa.expiresAt)}
              </p>
            )}
          </div>
        </div>

        {active ? (
          <Button variant="secondary" size="lg" className="border-danger/40 text-danger hover:bg-danger/10" onClick={revoke}>
            <Ban className="size-5" />
            ביטול עכשיו
          </Button>
        ) : (
          <Button size="lg" onClick={() => setOpen(true)}>
            <FileSignature className="size-5" />
            {poa.status === "revoked" ? "חתימה מחדש" : "חתימה על ייפוי כוח"}
          </Button>
        )}
      </div>

      {active && poa.signatureDataUrl && (
        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-line bg-obsidian/50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poa.signatureDataUrl} alt="החתימה שלך" className="h-12 w-32 object-contain" />
          <p className="text-xs text-ink-faint">החתימה נשמרת מוצפנת, ורק אצלך.</p>
        </div>
      )}

      <PoaWizard open={open} onClose={() => setOpen(false)} />
    </GlassCard>
  );
}
