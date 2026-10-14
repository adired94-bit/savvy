"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleCheck, Lock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import { TOPIC_LABEL } from "@/lib/legal";
import { buildPoaText, CAPABILITIES, NEVER_DO, SCOPE_NOTE } from "@/lib/vault/poa";
import { cn } from "@/lib/utils";
import { useVaultStore } from "@/store/vault-store";
import type { ClaimTopic } from "@/types/claims";
import { SignaturePad } from "./signature-pad";

const STEPS = ["מה מאשרים", "אימות", "חתימה"];
const TOPICS = Object.keys(TOPIC_LABEL) as ClaimTopic[];

export function PoaWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { poa, profile, setTopics, toggleCapability, setRequireApproval, setValidity, signPoa } = useVaultStore();
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    // Start fresh the next time the wizard opens.
    return () => {
      setStep(0);
      setCode("");
      setSignature(null);
      setAgreed(false);
      setDone(false);
    };
  }, [open]);

  const canNext = step === 0 ? poa.topics.length > 0 && poa.capabilities.length > 0 : step === 1 ? code.length === 6 : !!signature && agreed;

  function finish() {
    if (!signature) return;
    signPoa(signature);
    setDone(true);
  }

  return (
    <Modal open={open} onClose={onClose} title={done ? "ייפוי הכוח פעיל" : "ייפוי כוח מוגבל"}>
      {done ? (
        <div className="px-6 py-10 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-money/15 text-money">
            <CircleCheck className="size-8" />
          </div>
          <h3 className="mt-5 text-2xl font-bold">מעולה, אנחנו מוכנים</h3>
          <p className="mx-auto mt-2 max-w-sm text-ink-muted">מעכשיו נוכל לפנות לחברות בשמך, בדיוק במה שאישרת. אפשר לבטל בכל רגע.</p>
          <Button size="lg" className="mt-7 w-full" onClick={onClose}>
            סיום
          </Button>
        </div>
      ) : (
        <div className="p-5 sm:p-6">
          {/* stepper */}
          <ol className="mb-6 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <li key={s} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                    i < step ? "bg-money text-obsidian" : i === step ? "bg-white text-obsidian" : "bg-white/[0.08] text-ink-faint",
                  )}
                >
                  {i < step ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                </span>
                <span className={cn("text-sm", i === step ? "font-medium" : "text-ink-faint")}>{s}</span>
                {i < STEPS.length - 1 && <span className="h-px flex-1 bg-line-strong" />}
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold">באילו נושאים נפנה בשמך?</h3>
                    <p className="mt-1 text-sm text-ink-muted">{SCOPE_NOTE}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
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

                  <div>
                    <h3 className="font-semibold">מה מותר לנו לעשות?</h3>
                    <ul className="mt-2 divide-y divide-line">
                      {CAPABILITIES.map((c) => (
                        <li key={c.id} className="flex items-center gap-4 py-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{c.label}</p>
                            <p className="text-xs text-ink-muted">{c.hint}</p>
                          </div>
                          <Switch checked={poa.capabilities.includes(c.id)} onChange={() => toggleCapability(c.id)} label={c.label} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-line bg-white/[0.03] p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <X className="size-4 text-danger" /> מה אנחנו אף פעם לא עושים
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-ink-muted">
                      {NEVER_DO.map((n) => (
                        <li key={n}>• {n}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium">אישור שלי לפני כל פנייה</p>
                      <p className="text-xs text-ink-muted">מומלץ. שום מכתב לא יוצא בלי הלחיצה שלך.</p>
                    </div>
                    <Switch checked={poa.requireApproval} onChange={setRequireApproval} label="אישור לפני כל פנייה" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">תוקף</p>
                    <div className="mt-2 flex gap-2">
                      {([3, 6, 12] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setValidity(m)}
                          className={cn("flex-1 rounded-xl py-2 text-sm ring-1 ring-inset transition-colors", poa.validityMonths === m ? "bg-white/[0.08] ring-line-strong" : "text-ink-muted ring-line")}
                        >
                          <span className="num">{m}</span> חודשים
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="font-semibold">נוודא שזה באמת אתה</h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    שלחנו קוד בן 6 ספרות ב-SMS למספר <span className="num">{profile.phone}</span>.
                  </p>
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="------"
                    aria-label="קוד אימות"
                    dir="ltr"
                    className="num mt-5 w-full rounded-2xl border border-line-strong bg-obsidian px-4 py-4 text-center font-display text-3xl tracking-[0.5em] placeholder:text-ink-faint focus:border-money focus:outline-none"
                  />
                  <p className="mt-3 text-xs text-ink-faint">בגרסת ההדגמה כל קוד בן 6 ספרות מתקבל.</p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-semibold">מה את/ה חותם/ת עליו</h3>
                    <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-line bg-obsidian/60 p-4 font-sans text-sm leading-7 text-ink/90">
                      {buildPoaText(poa, `${profile.firstName} ${profile.lastName}`)}
                    </pre>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">חתימה</h3>
                    <SignaturePad onChange={setSignature} />
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 size-4 accent-[#10b981]" />
                    <span className="text-ink-muted">קראתי והבנתי את ייפוי הכוח, ואני מאשר/ת אותו. אני יודע/ת שאפשר לבטל אותו בכל רגע.</span>
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="sticky -bottom-5 mt-7 flex items-center gap-3 bg-midnight pb-1 pt-3 sm:-bottom-6">
            {step > 0 && (
              <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)}>
                חזרה
              </Button>
            )}
            <Button size="lg" className="flex-1" disabled={!canNext} onClick={() => (step < 2 ? setStep(step + 1) : finish())}>
              {step < 2 ? (
                "המשך"
              ) : (
                <>
                  <Lock className="size-4" />
                  חתימה ואישור
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
