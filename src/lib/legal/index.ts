import type { ClaimTopic, Jurisdiction, LegalGround, LetterLanguage } from "@/types/claims";
import { GLOBAL_GROUNDS } from "./global";
import { IL_GROUNDS } from "./il";

export { TOPIC_LABEL } from "./il";

export const ALL_GROUNDS: LegalGround[] = [...IL_GROUNDS, ...GLOBAL_GROUNDS];

export const groundsById: Record<string, LegalGround> = Object.fromEntries(ALL_GROUNDS.map((g) => [g.id, g]));

export const JURISDICTIONS: { id: Jurisdiction; label: string; language: LetterLanguage; defaultCurrency: string }[] = [
  { id: "IL", label: "ישראל", language: "he", defaultCurrency: "ILS" },
  { id: "US", label: "ארצות הברית", language: "en", defaultCurrency: "USD" },
  { id: "EU", label: "האיחוד האירופי", language: "en", defaultCurrency: "EUR" },
  { id: "UK", label: "בריטניה", language: "en", defaultCurrency: "GBP" },
];

export const letterLanguageFor = (j: Jurisdiction): LetterLanguage => (j === "IL" ? "he" : "en");

/** Grounds the engine may cite for a jurisdiction and topic. The model is only ever shown these. */
export function groundsFor(jurisdiction: Jurisdiction, topic: ClaimTopic): LegalGround[] {
  return ALL_GROUNDS.filter((g) => g.jurisdiction === jurisdiction && g.topics.includes(topic));
}
