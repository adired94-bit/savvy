import { formatMoney } from "@/lib/format";
import { groundsById, letterLanguageFor } from "@/lib/legal";
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

const enDateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

const EN_REQUEST_BY_TOPIC: Record<ClaimCase["topic"], string> = {
  telecom: "cancel the charge, refund the amount paid in error, and restore the price I agreed to.",
  insurance: "review my premium, explain the change in writing, and provide an updated quote.",
  banking: "refund the fees charged in error and stop charging them.",
  flight: "pay the compensation I am entitled to for the flight above.",
  product: "refund the price I paid or, alternatively, repair or replace the product.",
  subscription: "cancel the subscription, refund the amounts charged, and stop all future charges.",
};

/**
 * Offline fallback letter for a claim, used when the AI route is not configured or fails.
 * The AI version (`/api/letters`) writes the letter with the Claude API and may cite ONLY the
 * grounds from `@/lib/legal` for the case's jurisdiction. Letters are always shown to the user first.
 */
export function draftLetter(c: ClaimCase, now: Date = new Date()): DraftedLetter {
  const grounds = c.groundIds.map((id) => groundsById[id]).filter(Boolean);
  const language = letterLanguageFor(c.jurisdiction ?? "IL");
  const amount = formatMoney(c.facts.amount, c.currency, { precise: language === "en" });
  const meta = { language, citedGroundIds: grounds.map((g) => g.id), isTemplate: true };

  if (language === "en") {
    const body = [
      `Date: ${enDateFmt.format(now)}`,
      `To: ${c.provider}, Customer Relations`,
      "",
      `Re: ${c.title}${c.facts.accountRef ? ` (reference: ${c.facts.accountRef})` : ""}`,
      "",
      "Dear Sir or Madam,",
      "",
      `${c.facts.summary}${c.facts.period ? ` (${c.facts.period})` : ""} The amount involved is ${amount}.`,
      "",
      "I believe this conduct does not comply with the law:",
      ...grounds.map((g) => `- ${g.letterClause}`),
      "",
      `I therefore ask you to ${EN_REQUEST_BY_TOPIC[c.topic]}`,
      "Please reply in writing within 14 days. If I do not receive a satisfactory answer, I may refer the matter to the competent authorities or to small-claims court.",
      "",
      "Sincerely,",
      c.facts.customerName,
      "This letter is sent on my behalf by Savvy under a limited power of attorney that I granted.",
    ].join("\n");
    return { subject: c.title, body, ...meta };
  }

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

  return { subject: c.title, body, ...meta };
}
