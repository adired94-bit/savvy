import type { ClaimTopic, LegalGround } from "@/types/claims";

/**
 * Israeli consumer-law grounds the claims engine can cite.
 *
 * IMPORTANT: this is a product-side library, not legal advice. Section numbers are only filled in
 * where they are well established; everything else cites the statute by name. The whole library
 * (and every letter template) must be reviewed by an Israeli consumer-law attorney before any
 * letter is sent for real. The claims engine in production should only ever cite grounds from here.
 */
export const IL_GROUNDS: LegalGround[] = [
  {
    id: "cpl-misleading",
    jurisdiction: "IL",
    language: "he",
    topics: ["subscription", "telecom", "insurance", "product"],
    plain: "אסור לחייב אותך על משהו שלא הוסבר לך או שהטעו אותך לגביו.",
    law: "חוק הגנת הצרכן, התשמ״א-1981",
    section: "סעיף 2",
    letterClause: "העוסק אינו רשאי לעשות או להשמיט דבר, בכתב או בעל פה, שעלול להטעות צרכן בעניין מהותי בעסקה (סעיף 2 לחוק הגנת הצרכן, התשמ״א-1981).",
  },
  {
    id: "cpl-disclosure",
    jurisdiction: "IL",
    language: "he",
    topics: ["insurance", "telecom", "subscription"],
    plain: "חייבים לגלות לך לפני שינוי מחיר או תנאים, ולא רק אחרי החיוב.",
    law: "חוק הגנת הצרכן, התשמ״א-1981",
    section: "סעיף 4",
    letterClause: "על העוסק חלה חובת גילוי של כל פרט מהותי בעסקה, לרבות מחיר ותנאי התשלום (סעיף 4 לחוק הגנת הצרכן, התשמ״א-1981).",
  },
  {
    id: "cpl-telecom-terms",
    jurisdiction: "IL",
    language: "he",
    topics: ["telecom"],
    plain: "חברה לא יכולה להעלות לך מחיר או להוסיף שירות בלי הסכמה ברורה שלך.",
    law: "חוק הגנת הצרכן, התשמ״א-1981",
    section: "סעיף 2",
    letterClause: "הוספת שירות או העלאת מחיר ללא הסכמה מפורשת של הצרכן מהווה הטעיה ופוגעת בחובת הגילוי לפי חוק הגנת הצרכן, התשמ״א-1981.",
  },
  {
    id: "banking-service",
    jurisdiction: "IL",
    language: "he",
    topics: ["banking"],
    plain: "בנקים חייבים לפרט ולהסביר עמלות, ולגבות רק את מה שסוכם איתך.",
    law: "חוק הבנקאות (שירות ללקוח), התשמ״א-1981",
    letterClause: "בהתאם לחוק הבנקאות (שירות ללקוח), התשמ״א-1981, ולכללי הבנקאות (שירות ללקוח) שהותקנו מכוחו, על התאגיד הבנקאי לגבות עמלות רק בהתאם לתעריף שנמסר ללקוח ובכפוף לחובת הגילוי וההוגנות.",
  },
  {
    id: "aviation-compensation",
    jurisdiction: "IL",
    language: "he",
    topics: ["flight"],
    plain: "ביטול טיסה או עיכוב ארוך מזכים אותך בפיצוי כספי קבוע בחוק, בלי להוכיח נזק.",
    law: "חוק שירותי תעופה (פיצוי והוראת סיוע), התשע״ב-2012",
    letterClause: "בהתאם לחוק שירותי תעופה (פיצוי והוראת סיוע), התשע״ב-2012, הנוסע זכאי לפיצוי כספי בשל ביטול טיסה או עיכוב מעל השיעור הקבוע בחוק, ללא צורך בהוכחת נזק.",
  },
  {
    id: "cpl-remote-cancel",
    jurisdiction: "IL",
    language: "he",
    topics: ["product"],
    plain: "קנית באינטרנט או בטלפון? יש לך זכות לבטל את העסקה ולקבל החזר בתוך התקופה שבחוק.",
    law: "חוק הגנת הצרכן, התשמ״א-1981",
    section: "סעיף 14ג",
    letterClause: "צרכן רשאי לבטל עסקת מכר מרחוק בהתאם להוראות סעיף 14ג לחוק הגנת הצרכן, התשמ״א-1981, ולקבל החזר כספי.",
  },
  {
    id: "cpl-defect",
    jurisdiction: "IL",
    language: "he",
    topics: ["product"],
    plain: "מוצר שהתקלקל תוך תקופת האחריות מחייב תיקון, החלפה או החזר.",
    law: "חוק הגנת הצרכן, התשמ״א-1981 וחוק המכר, התשכ״ח-1968",
    letterClause: "המוצר לקוי ואינו תואם את שהובטח לצרכן. בהתאם לדיני הגנת הצרכן ולחוק המכר, התשכ״ח-1968, הצרכן זכאי לתיקון, להחלפה או להחזר כספי.",
  },
];

export const TOPIC_LABEL: Record<ClaimTopic, string> = {
  telecom: "תקשורת",
  insurance: "ביטוח",
  banking: "עמלות בנק",
  flight: "טיסות",
  product: "מוצרים",
  subscription: "מנויים",
};
