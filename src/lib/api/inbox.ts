import { mockExtraction, mockInbox } from "@/lib/mock/inbox";
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

export async function extractDocument(file: Blob, source: "upload" | "camera", fileName?: string): Promise<InboxDocument> {
  await new Promise((r) => setTimeout(r, 2200));
  const doc = mockExtraction(`doc_${Date.now()}`, source, fileName);
  if (file.type.startsWith("image/")) doc.previewUrl = URL.createObjectURL(file);
  return doc;
}
