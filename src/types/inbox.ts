import type { CategoryId } from "./finance";
import type { ClaimTopic, Jurisdiction } from "./claims";

export type DocumentSource = "gmail" | "outlook" | "upload" | "camera";
export type DocumentStatus = "processing" | "ready" | "needs_review";

export interface LineItem {
  id: string;
  name: string;
  /** ISO date of the charge */
  date: string;
  amount: number;
  recurrence: "recurring" | "one_time";
  /** Plain-language note when something looks off with this line. */
  flag?: string;
}

export interface InboxDocument {
  id: string;
  provider: string;
  category: CategoryId | "utilities" | "shopping";
  /** Short human label, e.g. "חשבון אוקטובר" */
  label: string;
  source: DocumentSource;
  receivedAt: string;
  status: DocumentStatus;
  total: number;
  /** ISO 4217 code of every amount on the document. Defaults to ILS. */
  currency?: string;
  /** Consumer-law regime read from the document, when known. */
  jurisdiction?: Jurisdiction | "OTHER";
  topic?: ClaimTopic | "other";
  /** True when the result is sample data because no AI key is configured. */
  isDemo?: boolean;
  lineItems: LineItem[];
  /** One-line summary of what we found, shown in the list. */
  finding?: string;
  /** What we could save if the user lets us handle it. */
  potentialSaving?: number;
  /** Local preview URL for uploads / camera captures. */
  previewUrl?: string;
}

export interface MailConnection {
  id: "gmail" | "outlook";
  label: string;
  connected: boolean;
  account?: string;
  lastSync?: string;
}

export interface InboxData {
  connections: MailConnection[];
  documents: InboxDocument[];
}
