import { z } from "zod";

export const TOPICS = ["telecom", "insurance", "banking", "flight", "product", "subscription"] as const;
export const JURISDICTION_IDS = ["IL", "US", "EU", "UK"] as const;

/* ------------------------------------------------------------------ extraction */

/**
 * Structured-output rules: every property required, no unions, additionalProperties false.
 * "Nothing to report" is therefore an empty string or 0 and mapped to undefined by the caller.
 */
export const extractionJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["provider", "documentLabel", "documentType", "currency", "total", "issuedDate", "documentLanguage", "jurisdiction", "topic", "lineItems", "finding", "potentialSaving"],
  properties: {
    provider: { type: "string", description: "Company that issued the document, as written on it" },
    documentLabel: { type: "string", description: "Short label, e.g. 'October mobile bill'" },
    documentType: { type: "string", enum: ["invoice", "receipt", "statement", "renewal_notice", "other"] },
    currency: { type: "string", description: "ISO 4217 code of the amounts on the document, e.g. ILS, USD, EUR, GBP, JPY. Empty string if unknown" },
    total: { type: "number", description: "Total amount charged, in the document's currency, no conversion" },
    issuedDate: { type: "string", description: "YYYY-MM-DD, or empty string if absent" },
    documentLanguage: { type: "string", description: "BCP 47 language tag of the document, e.g. he, en, de" },
    jurisdiction: { type: "string", enum: ["IL", "US", "EU", "UK", "OTHER"], description: "Consumer-law regime that most likely applies, from the seller, currency and address" },
    topic: { type: "string", enum: [...TOPICS, "other"] },
    lineItems: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "date", "amount", "recurrence", "flag"],
        properties: {
          name: { type: "string" },
          date: { type: "string", description: "YYYY-MM-DD, or empty string" },
          amount: { type: "number", description: "Charge for this line in the document's currency; credits are negative" },
          recurrence: { type: "string", enum: ["recurring", "one_time"] },
          flag: { type: "string", description: "Plain one-sentence note if this line looks wrong, otherwise empty string" },
        },
      },
    },
    finding: { type: "string", description: "One plain sentence naming the most important problem found, or empty string if the document looks fine" },
    potentialSaving: { type: "number", description: "Amount the user could plausibly recover, in the document's currency, or 0" },
  },
} as const;

export const extractionParser = z.object({
  provider: z.string(),
  documentLabel: z.string(),
  documentType: z.enum(["invoice", "receipt", "statement", "renewal_notice", "other"]),
  currency: z.string(),
  total: z.number(),
  issuedDate: z.string(),
  documentLanguage: z.string(),
  jurisdiction: z.enum(["IL", "US", "EU", "UK", "OTHER"]),
  topic: z.enum([...TOPICS, "other"]),
  lineItems: z.array(
    z.object({
      name: z.string(),
      date: z.string(),
      amount: z.number(),
      recurrence: z.enum(["recurring", "one_time"]),
      flag: z.string(),
    }),
  ),
  finding: z.string(),
  potentialSaving: z.number(),
});
export type Extraction = z.infer<typeof extractionParser>;

/* ------------------------------------------------------------------ letters */

export const letterRequestParser = z.object({
  jurisdiction: z.enum(JURISDICTION_IDS),
  topic: z.enum(TOPICS),
  /** Language of the letter. Defaults to Hebrew for IL and English elsewhere. */
  language: z.enum(["he", "en"]).optional(),
  provider: z.string().min(1).max(200),
  title: z.string().min(1).max(300),
  currency: z.string().length(3),
  amount: z.number().nonnegative().max(1e9),
  customerName: z.string().min(1).max(200),
  accountRef: z.string().max(200).optional(),
  period: z.string().max(200).optional(),
  /** What happened, as the user (or the document reader) described it. */
  summary: z.string().min(1).max(2000),
  /** Optional goal: what the customer wants. Falls back to a sensible default per topic. */
  desiredOutcome: z.string().max(500).optional(),
});
export type LetterRequest = z.infer<typeof letterRequestParser>;

export const letterJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["subject", "body", "citedGroundIds"],
  properties: {
    subject: { type: "string", description: "Subject line of the letter" },
    body: { type: "string", description: "Full plain-text letter, from greeting to signature" },
    citedGroundIds: { type: "array", items: { type: "string" }, description: "Ids of the allowed legal grounds the letter actually cites" },
  },
} as const;

export const letterParser = z.object({
  subject: z.string().min(1),
  body: z.string().min(40),
  citedGroundIds: z.array(z.string()),
});
