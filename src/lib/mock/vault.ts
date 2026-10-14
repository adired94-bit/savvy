import type { AuditEntry, ConnectedAccount, NotificationPrefs, Profile } from "@/types/vault";

const ago = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const mockProfile: Profile = {
  firstName: "אדיר",
  lastName: "כהן",
  email: "adir@gmail.com",
  phone: "050-123-4567",
  idLast4: "4821",
  city: "תל אביב",
};

export const mockAccounts: ConnectedAccount[] = [
  { id: "gmail", kind: "email", name: "Gmail", detail: "adir@gmail.com", connected: true },
  { id: "outlook", kind: "email", name: "Outlook", connected: false },
  { id: "leumi", kind: "bank", name: "בנק לאומי", detail: "חשבון ···456", connected: true },
  { id: "hapoalim", kind: "bank", name: "בנק הפועלים", connected: false },
  { id: "isracard", kind: "card", name: "ישראכרט", detail: "כרטיס ···8830", connected: true },
  { id: "cal", kind: "card", name: "כאל", connected: false },
];

export const mockNotifications: NotificationPrefs = {
  anomaly: { push: true, email: false, whatsapp: false },
  reply: { push: true, email: true, whatsapp: false },
  credit: { push: true, email: true, whatsapp: true },
  weekly: { push: false, email: true, whatsapp: false },
};

export const mockAudit: AuditEntry[] = [
  { id: "a1", kind: "reply", text: "אל על אישרו קבלת הפנייה על הטיסה", at: ago(31) },
  { id: "a2", kind: "sent", text: "שלחנו מכתב דרישה לבנק לאומי בשמך", at: ago(20) },
  { id: "a3", kind: "read", text: "קראנו את חשבון הסלולר של פרטנר שהגיע במייל", at: ago(3) },
  { id: "a4", kind: "key", text: "מפתח ההצפנה נוצר על המכשיר שלך", at: ago(24 * 9) },
];
