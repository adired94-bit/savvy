import { groundsById } from "@/lib/legal/il";
import type { ClaimCase, DraftedLetter } from "@/types/claims";

const dateFmt = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric" });

const REQUEST_BY_TOPIC: Record<ClaimCase["topic"], string> = {
  telecom: "לבטל את החיוב או את שינוי המחיר שבנדון, לזכות אותי בסכום ששולם ביתר, ולהחזיר אותי למחיר שסוכם.",
  insurance: "לבחון מחדש את הפרמיה, להציג לי את נימוקי השינוי ואת הצעת המחיר העדכנית, ולהתאים אותה לשוק.",
  banking: "להחזיר לי את העמלות שנגבו ביתר ולהפסיק את גבייתן.",
  flight: "לשלם לי את הפיצוי הקבוע בחוק בגין הטיסה שבנדון.",
  product: "להחזיר לי את התמורה ששילמתי, או לחלופין לתקן או להחליף את המוצר.",
  subscription: "לבטל את החיוב, לזכות אותי בסכומים שנגבו, ולהפסיק את החיוב העתידי.",
};

/**
 * Drafts the dispute letter for a claim.
 *
 * Module 3 uses a deterministic template. The production version keeps this exact signature but
 * calls the Claude API with the case facts and ONLY the grounds from `@/lib/legal/il`, so the model
 * can phrase the letter but never invents a statute. Letters are always shown to the user first.
 */
export function draftLetter(c: ClaimCase, now: Date = new Date()): DraftedLetter {
  const grounds = c.groundIds.map((id) => groundsById[id]).filter(Boolean);
  const amount = new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(c.facts.amount);

  const body = [
    `תאריך: ${dateFmt.format(now)}`,
    `לכבוד: ${c.provider}, מחלקת פניות הציבור`,
    "",
    `הנדון: ${c.title}${c.facts.accountRef ? ` (מס׳ לקוח/הזמנה: ${c.facts.accountRef})` : ""}`,
    "",
    "שלום רב,",
    "",
    c.facts.summary + (c.facts.period ? ` (${c.facts.period})` : "") + ` הסכום הרלוונטי: ${amount}.`,
    "",
    "לעמדתי, התנהלות זו אינה עומדת בדרישות הדין:",
    ...grounds.map((g) => `• ${g.letterClause}`),
    "",
    `לפיכך אני פונה אליך בדרישה ${REQUEST_BY_TOPIC[c.topic]}`,
    "אבקש תשובה בכתב תוך 14 ימים. אם לא אקבל מענה מספק, אשקול פנייה לגורמי האכיפה והרגולציה הרלוונטיים ולהגשת תביעה בבית המשפט לתביעות קטנות, וזאת ללא הודעה נוספת.",
    "",
    "בברכה,",
    c.facts.customerName,
    "הפנייה נשלחה בשמי על ידי Savvy, מכוח ייפוי כוח מוגבל שנתתי.",
  ].join("\n");

  return { subject: c.title, body };
}
