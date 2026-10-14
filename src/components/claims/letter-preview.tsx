"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLetter } from "@/hooks/use-letter";
import { Skeleton } from "@/components/ui/skeleton";
import { groundsById } from "@/lib/legal";
import type { ClaimCase } from "@/types/claims";

export function LetterPreview({ claim }: { claim: ClaimCase }) {
  const { data: letter, isPending } = useLetter(claim);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      if (!letter) return;
      await navigator.clipboard.writeText(letter.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: ignore */
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-obsidian/60">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <p className="text-sm font-medium">המכתב שנשלח בשמך</p>
        <Button size="sm" variant="ghost" onClick={copy} disabled={!letter}>
          {copied ? <Check className="size-4 text-money" /> : <Copy className="size-4" />}
          {copied ? "הועתק" : "העתקה"}
        </Button>
      </div>
      {isPending || !letter ? (
        <div className="space-y-2 px-4 py-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : (
        <>
          <pre
            dir={letter.language === "en" ? "ltr" : "rtl"}
            className="whitespace-pre-wrap break-words px-4 py-4 font-sans text-sm leading-7 text-ink/90"
          >
            {letter.body}
          </pre>
          <div className="border-t border-line px-4 py-2.5 text-xs text-ink-faint">
            {letter.isTemplate ? "נוסח בסיסי. הניסוח המלא מתבצע כשמחברים מפתח Claude בשרת." : "נוסח אישי שנכתב לפי העובדות שלך."}
            {letter.citedGroundIds && letter.citedGroundIds.length > 0 && (
              <span className="mt-0.5 block" dir="auto">
                {letter.citedGroundIds.map((id) => groundsById[id]?.law).filter(Boolean).join(" · ")}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
