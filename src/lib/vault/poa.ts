import { TOPIC_LABEL } from "@/lib/legal/il";
import type { Capability, PoaGrant } from "@/types/vault";

export const CAPABILITIES: { id: Capability; label: string; hint: string }[] = [
  { id: "send_letters", label: "לשלוח פניות ומכתבים בשמי", hint: "מכתבי דרישה והשגה לחברות, עם שמך ופרטי החשבון." },
  { id: "negotiate", label: "לנהל משא ומתן על מחיר", hint: "לבקש הנחה, התאמת מחיר או ביטול חיוב." },
  { id: "receive_replies", label: "לקבל תשובות מהחברות", hint: "תשובות יגיעו אלינו ואנחנו נסכם לך אותן." },
  { id: "request_refunds", label: "לבקש החזרים וזיכויים", hint: "בקשות החזר כספי לאמצעי התשלום שלך." },
];

/** Things the agent can never do, whatever the user toggles. Shown as fixed rules. */
export const NEVER_DO = [
  "להעביר כסף או לגשת לחשבון הבנק שלך",
  "לראות סיסמאות או קודים של בנק או כרטיס אשראי",
  "לחתום בשמך על חוזה חדש או התחייבות חדשה",
  "לוותר על זכות שלך או לקבל פשרה בלי אישורך",
  "להגיש תביעה בבית משפט",
];

export const SCOPE_NOTE = "הרשאה מוגבלת לעניינים של הגנת הצרכן בלבד, לפי חוק הגנת הצרכן, התשמ״א-1981.";

export function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

const dateFmt = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric" });
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));

/**
 * Text of the limited power of attorney the user signs.
 *
 * Product draft only: the wording, the validity of a drawn digital signature and any identity
 * verification requirements must be reviewed by an Israeli attorney before launch.
 */
export function buildPoaText(grant: Pick<PoaGrant, "topics" | "capabilities" | "validityMonths" | "requireApproval">, fullName: string, now = new Date()): string {
  const caps = CAPABILITIES.filter((c) => grant.capabilities.includes(c.id)).map((c) => `• ${c.label}`);
  const topics = grant.topics.map((t) => TOPIC_LABEL[t]).join(", ");
  return [
    "ייפוי כוח מוגבל",
    "",
    `אני, ${fullName}, ממנה בזאת את Savvy כנציגתי, לפעול בשמי אך ורק בעניינים הבאים: ${topics}.`,
    "",
    "הסמכות כוללת:",
    ...caps,
    "",
    "הסמכות אינה כוללת:",
    ...NEVER_DO.map((n) => `• ${n}`),
    "",
    grant.requireApproval ? "כל פנייה תישלח רק לאחר אישור מפורש שלי." : "אני מאשר/ת שפניות במסגרת ההרשאה יישלחו ללא אישור נפרד לכל פנייה.",
    "",
    `תוקף ההרשאה: ${grant.validityMonths} חודשים מיום החתימה (${formatDate(now.toISOString())}). אפשר לבטל אותה בכל עת בלחיצת כפתור, והביטול נכנס לתוקף מיד.`,
    SCOPE_NOTE,
  ].join("\n");
}
