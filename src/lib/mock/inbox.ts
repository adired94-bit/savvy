import type { InboxData, InboxDocument } from "@/types/inbox";

const daysAgo = (d: number, h = 0) => new Date(Date.now() - (d * 24 + h) * 3_600_000).toISOString();

export const mockInbox: InboxData = {
  connections: [
    { id: "gmail", label: "Gmail", connected: true, account: "adir@gmail.com", lastSync: daysAgo(0, 1) },
    { id: "outlook", label: "Outlook", connected: false },
  ],
  documents: [
    {
      id: "doc_partner_10",
      provider: "פרטנר",
      category: "telecom",
      label: "חשבון סלולר, אוקטובר",
      source: "gmail",
      receivedAt: daysAgo(0, 3),
      status: "needs_review",
      total: 124.7,
      finding: "שירות מוזיקה שלא הזמנת",
      potentialSaving: 14.9,
      lineItems: [
        { id: "l1", name: "חבילת 5G ללא הגבלה", date: daysAgo(1), amount: 79.9, recurrence: "recurring" },
        { id: "l2", name: "Partner Music", date: daysAgo(1), amount: 14.9, recurrence: "recurring", flag: "לא מצאנו שהזמנת את השירות הזה" },
        { id: "l3", name: "ביטוח מכשיר", date: daysAgo(1), amount: 29.9, recurrence: "recurring" },
      ],
    },
    {
      id: "doc_harel",
      provider: "הראל ביטוח",
      category: "warranties",
      label: "חידוש ביטוח רכב",
      source: "gmail",
      receivedAt: daysAgo(1, 5),
      status: "needs_review",
      total: 4036,
      finding: "המחיר עלה ב-18% מהשנה שעברה",
      potentialSaving: 540,
      lineItems: [
        { id: "l1", name: "ביטוח מקיף", date: daysAgo(1), amount: 3180, recurrence: "recurring", flag: "שנה שעברה: ₪2,690" },
        { id: "l2", name: "ביטוח חובה", date: daysAgo(1), amount: 726, recurrence: "recurring" },
        { id: "l3", name: "כתב שירות גרירה", date: daysAgo(1), amount: 130, recurrence: "recurring" },
      ],
    },
    {
      id: "doc_isracard",
      provider: "ישראכרט",
      category: "banking",
      label: "פירוט חיובים, ספטמבר",
      source: "outlook",
      receivedAt: daysAgo(3),
      status: "ready",
      total: 6412.35,
      lineItems: [
        { id: "l1", name: "Netflix", date: daysAgo(12), amount: 54.9, recurrence: "recurring" },
        { id: "l2", name: "Spotify", date: daysAgo(14), amount: 23.9, recurrence: "recurring" },
        { id: "l3", name: "Spotify", date: daysAgo(14), amount: 23.9, recurrence: "recurring", flag: "חויבת פעמיים באותו יום" },
        { id: "l4", name: "עמלת המרת מט״ח", date: daysAgo(18), amount: 41.2, recurrence: "one_time" },
        { id: "l5", name: "דמי כרטיס", date: daysAgo(20), amount: 19.9, recurrence: "recurring" },
      ],
      finding: "חיוב כפול ב-Spotify",
      potentialSaving: 23.9,
    },
    {
      id: "doc_electric",
      provider: "חברת החשמל",
      category: "utilities",
      label: "חשבון חשמל, אוגוסט–ספטמבר",
      source: "gmail",
      receivedAt: daysAgo(5),
      status: "ready",
      total: 612.4,
      lineItems: [
        { id: "l1", name: "צריכה (1,038 קוט״ש)", date: daysAgo(6), amount: 588.2, recurrence: "recurring" },
        { id: "l2", name: "תשלום קבוע", date: daysAgo(6), amount: 24.2, recurrence: "recurring" },
      ],
    },
    {
      id: "doc_shufersal",
      provider: "שופרסל",
      category: "shopping",
      label: "קבלה מהסופר",
      source: "camera",
      receivedAt: daysAgo(6, 2),
      status: "ready",
      total: 386.5,
      lineItems: [
        { id: "l1", name: "סל קניות (23 פריטים)", date: daysAgo(6), amount: 372.6, recurrence: "one_time" },
        { id: "l2", name: "שקיות", date: daysAgo(6), amount: 0.5, recurrence: "one_time" },
        { id: "l3", name: "משלוח", date: daysAgo(6), amount: 13.4, recurrence: "one_time" },
      ],
    },
    {
      id: "doc_hot",
      provider: "HOT",
      category: "subscriptions",
      label: "חשבון טלוויזיה ואינטרנט",
      source: "upload",
      receivedAt: daysAgo(9),
      status: "ready",
      total: 239,
      lineItems: [
        { id: "l1", name: "חבילת טלוויזיה", date: daysAgo(10), amount: 139, recurrence: "recurring" },
        { id: "l2", name: "אינטרנט 1Gb", date: daysAgo(10), amount: 100, recurrence: "recurring" },
      ],
    },
  ],
};

/** What a freshly scanned or uploaded document "becomes" after reading it (Module 2 mock). */
export function mockExtraction(id: string, source: "upload" | "camera", fileName?: string): InboxDocument {
  const now = new Date().toISOString();
  return {
    id,
    provider: "בזק",
    category: "telecom",
    label: fileName ? `חשבון טלפון (${fileName})` : "חשבון טלפון קווי",
    source,
    receivedAt: now,
    status: "needs_review",
    total: 89.8,
    finding: "המבצע הסתיים והמחיר קפץ",
    potentialSaving: 30,
    lineItems: [
      { id: "l1", name: "קו טלפון ביתי", date: now, amount: 59.9, recurrence: "recurring", flag: "עד החודש שעבר: ₪29.90" },
      { id: "l2", name: "שיחות לנייד", date: now, amount: 18, recurrence: "one_time" },
      { id: "l3", name: "שיחה מזוהה", date: now, amount: 11.9, recurrence: "recurring" },
    ],
  };
}
