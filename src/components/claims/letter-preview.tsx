"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { draftLetter } from "@/lib/claims/letter";
import type { ClaimCase } from "@/types/claims";

export function LetterPreview({ claim }: { claim: ClaimCase }) {
  const letter = draftLetter(claim);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
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
        <Button size="sm" variant="ghost" onClick={copy}>
          {copied ? <Check className="size-4 text-money" /> : <Copy className="size-4" />}
          {copied ? "הועתק" : "העתקה"}
        </Button>
      </div>
      <pre className="whitespace-pre-wrap break-words px-4 py-4 font-sans text-sm leading-7 text-ink/90">{letter.body}</pre>
    </div>
  );
}
