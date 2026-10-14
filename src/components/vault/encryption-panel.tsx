"use client";

import { Eye, EyeOff, KeyRound, Laptop } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";

const SEES = ["שם החברה וסכום החיוב", "שורות החיוב שקראנו מהחשבונית", "הפניות ששלחנו בשמך והתשובות עליהן"];
const NEVER_SEES = ["הסיסמאות שלך לבנק ולכרטיס האשראי", "המפתח שפותח את המסמכים המקוריים שלך", "קבצי החשבוניות עצמם, בלי המפתח שלך"];

/** Zero-knowledge explainer. UI only for Module 4: real client-side encryption lands with Supabase. */
export function EncryptionPanel() {
  const [showKey, setShowKey] = useState(false);

  return (
    <GlassCard>
      <SectionHeader title="הצפנה ופרטיות" subtitle="המפתח נשאר אצלך, לא אצלנו." />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-inset ring-line">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Eye className="size-4 text-info" /> מה אנחנו רואים
          </p>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            {SEES.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-inset ring-line">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <EyeOff className="size-4 text-money" /> מה אנחנו לא רואים
          </p>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            {NEVER_SEES.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-obsidian/50 p-4">
        <div className="grid size-11 place-items-center rounded-xl bg-money/12 text-money">
          <KeyRound className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">מפתח ההצפנה שלך</p>
          <p className="num mt-0.5 font-mono text-sm tracking-wider text-ink-muted">{showKey ? "A4F2 91C0 7D3B E58A" : "•••• •••• •••• ••••"}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-faint">
            <Laptop className="size-3" /> נוצר ונשמר על המכשיר הזה
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setShowKey((v) => !v)}>
          {showKey ? "הסתרה" : "הצגה"}
        </Button>
      </div>
    </GlassCard>
  );
}
