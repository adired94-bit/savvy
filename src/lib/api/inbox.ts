import { mockExtraction, mockInbox } from "@/lib/mock/inbox";
import type { CategoryId } from "@/types/finance";
import type { InboxData, InboxDocument } from "@/types/inbox";

/**
 * Inbox data boundary.
 * Later: documents come from Supabase; Gmail/Outlook sync runs server-side;
 * extraction posts the file to /api/extract, which calls Claude (vision) and returns line items.
 */
export async function fetchInbox(): Promise<InboxData> {
  await new Promise((r) => setTimeout(r, 300));
  return structuredClone(mockInbox);
}

interface ExtractResponse {
  data: {
    provider: string;
    documentLabel: string;
    currency: string;
    total: number;
    issuedDate: string;
    jurisdiction: InboxDocument["jurisdiction"];
    topic: NonNullable<InboxDocument["topic"]>;
    lineItems: { name: string; date: string; amount: number; recurrence: "recurring" | "one_time"; flag: string }[];
    finding: string;
    potentialSaving: number;
  };
}

const CATEGORY_BY_TOPIC: Record<NonNullable<InboxDocument["topic"]>, InboxDocument["category"]> = {
  telecom: "telecom",
  insurance: "warranties",
  banking: "banking",
  flight: "refunds",
  product: "shopping",
  subscription: "subscriptions",
  other: "shopping",
};

export class ExtractError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
  }
}

/** Plain Hebrew for each failure the route can return. */
export const extractErrorText = (code: string) =>
  ({
    file_too_large: "הקובץ גדול מדי. אפשר להעלות עד 10MB.",
    unsupported_type: "אפשר להעלות PDF או תמונה (PNG, JPG, WebP).",
    rate_limited: "ניסינו יותר מדי פעמים ברצף. נסו שוב בעוד דקה.",
    ai_refused: "לא הצלחנו לקרוא את המסמך הזה. נסו קובץ אחר.",
  })[code] ?? "משהו השתבש בקריאת המסמך. נסו שוב.";

/**
 * Sends the file to /api/extract (Claude reads any bill, any language, any currency).
 * Without an API key on the server the app stays usable with a clearly marked sample result.
 */
export async function extractDocument(file: Blob, source: "upload" | "camera", fileName?: string): Promise<InboxDocument> {
  const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
  const form = new FormData();
  form.append("file", file, fileName ?? "scan");
  form.append("lang", "he");

  const res = await fetch("/api/extract", { method: "POST", body: form }).catch(() => null);
  if (res?.status === 503) {
    await new Promise((r) => setTimeout(r, 1200));
    return { ...mockExtraction(`doc_${Date.now()}`, source, fileName), previewUrl, isDemo: true };
  }
  if (!res || !res.ok) {
    const code = res ? ((await res.json().catch(() => ({}))) as { code?: string }).code ?? "ai_error" : "network";
    throw new ExtractError(code, extractErrorText(code));
  }

  const { data: d } = (await res.json()) as ExtractResponse;
  const now = new Date().toISOString();
  const id = `doc_${Date.now()}`;
  return {
    id,
    provider: d.provider || fileName || "מסמך",
    category: CATEGORY_BY_TOPIC[d.topic] as CategoryId | "utilities" | "shopping",
    label: d.documentLabel,
    source,
    receivedAt: d.issuedDate ? new Date(d.issuedDate).toISOString() : now,
    status: d.potentialSaving > 0 ? "needs_review" : "ready",
    total: d.total,
    currency: d.currency || undefined,
    jurisdiction: d.jurisdiction,
    topic: d.topic,
    finding: d.finding || undefined,
    potentialSaving: d.potentialSaving > 0 ? d.potentialSaving : undefined,
    previewUrl,
    lineItems: d.lineItems.map((l, i) => ({
      id: `${id}_${i}`,
      name: l.name,
      date: l.date ? new Date(l.date).toISOString() : now,
      amount: l.amount,
      recurrence: l.recurrence,
      flag: l.flag || undefined,
    })),
  };
}
