export type ClaimTopic = "telecom" | "insurance" | "banking" | "flight" | "product" | "subscription";

export type ClaimStatus = "awaiting_approval" | "sent" | "in_progress" | "resolved" | "rejected";

export type ClaimOutcome = "refund" | "price_reduction" | "none";

export interface TimelineEvent {
  id: string;
  status: Exclude<ClaimStatus, "awaiting_approval">;
  /** Plain-language line shown to the user. */
  title: string;
  detail?: string;
  at: string;
}

export interface ClaimCase {
  id: string;
  provider: string;
  topic: ClaimTopic;
  /** Short headline, e.g. "חיוב על שירות שלא הזמנת" */
  title: string;
  /** What we noticed, in one or two plain sentences. */
  finding: string;
  status: ClaimStatus;
  /** Amount at stake. For price reductions this is the yearly saving. */
  estimatedSaving: number;
  /** Filled once the provider credits / lowers the price. */
  actualSaving?: number;
  outcome?: ClaimOutcome;
  /** Ids into the legal grounds library. */
  groundIds: string[];
  /** Facts the letter is built from. */
  facts: ClaimFacts;
  createdAt: string;
  timeline: TimelineEvent[];
}

export interface ClaimFacts {
  customerName: string;
  accountRef?: string;
  /** Free-form sentences describing what happened, already in Hebrew. */
  summary: string;
  amount: number;
  period?: string;
}

export interface LegalGround {
  id: string;
  topic: ClaimTopic;
  /** Plain-language reason shown on the approval card. */
  plain: string;
  /** Statute name as cited in the letter. */
  law: string;
  /** Section, only when verified. */
  section?: string;
  /** Sentence used in the letter. */
  letterClause: string;
}

export interface DraftedLetter {
  subject: string;
  body: string;
}
