import { draftLetter } from "@/lib/claims/letter";
import { groundsById, letterLanguageFor } from "@/lib/legal";
import type { ClaimCase, DraftedLetter } from "@/types/claims";

interface LetterResponse {
  data: { subject: string; body: string; citedGroundIds: string[] };
  language: DraftedLetter["language"];
}

/**
 * Asks /api/letters (Claude, with the legal library for the case's jurisdiction) for the letter.
 * If the route is not configured or fails, the offline template is shown instead and marked as such.
 */
export async function fetchLetter(c: ClaimCase): Promise<DraftedLetter> {
  const jurisdiction = c.jurisdiction ?? "IL";
  const res = await fetch("/api/letters", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jurisdiction,
      topic: c.topic,
      language: letterLanguageFor(jurisdiction),
      provider: c.provider,
      title: c.title,
      currency: c.currency ?? "ILS",
      amount: c.facts.amount,
      customerName: c.facts.customerName,
      accountRef: c.facts.accountRef,
      period: c.facts.period,
      summary: c.facts.summary,
    }),
  }).catch(() => null);

  if (!res?.ok) return draftLetter(c);
  const json = (await res.json()) as LetterResponse;
  const cited = json.data.citedGroundIds.filter((id) => id in groundsById);
  return { subject: json.data.subject, body: json.data.body, language: json.language, citedGroundIds: cited, isTemplate: false };
}
