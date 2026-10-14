"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { useVaultStore } from "@/store/vault-store";
import type { Profile } from "@/types/vault";

function Field({ label, value, onChange, dir, type = "text", readOnly }: { label: string; value: string; onChange?: (v: string) => void; dir?: "ltr"; type?: string; readOnly?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-ink-muted">{label}</span>
      <input
        type={type}
        value={value}
        dir={dir}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-11 w-full rounded-xl border border-line bg-white/[0.03] px-3.5 text-ink placeholder:text-ink-faint read-only:text-ink-muted focus:border-money focus:outline-none"
      />
    </label>
  );
}

export function ProfileForm() {
  const profile = useVaultStore((s) => s.profile);
  const update = useVaultStore((s) => s.updateProfile);
  const [draft, setDraft] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);
  const set = (k: keyof Profile) => (v: string) => {
    setSaved(false);
    setDraft((d) => ({ ...d, [k]: v }));
  };

  return (
    <GlassCard>
      <SectionHeader title="הפרטים שלך" subtitle="משמשים רק במכתבים שאנחנו שולחים בשמך." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="שם פרטי" value={draft.firstName} onChange={set("firstName")} />
        <Field label="שם משפחה" value={draft.lastName} onChange={set("lastName")} />
        <Field label="אימייל" value={draft.email} onChange={set("email")} dir="ltr" type="email" />
        <Field label="טלפון" value={draft.phone} onChange={set("phone")} dir="ltr" type="tel" />
        <Field label="עיר" value={draft.city} onChange={set("city")} />
        <Field label="תעודת זהות" value={`•••••${draft.idLast4}`} dir="ltr" readOnly />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <Button
          disabled={!dirty}
          onClick={() => {
            update(draft);
            setSaved(true);
          }}
        >
          שמירה
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-money-bright">
            <Check className="size-4" /> נשמר
          </span>
        )}
      </div>
    </GlassCard>
  );
}
