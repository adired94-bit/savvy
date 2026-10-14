import type { SwitchOffer } from "@/types/switch";

/**
 * Public side of the offer catalog (mirrors the `offers_public` view in Supabase).
 * Sample companies for the demo; they are not real partners.
 * Later: read from Supabase instead.
 */
export const OFFERS: SwitchOffer[] = [
  {
    id: "off_nimbus_5g",
    provider: "Nimbus Mobile",
    topic: "telecom",
    jurisdiction: "IL",
    title: "חבילת סלולר ללא הגבלה",
    planName: "Unlimited 5G",
    monthlyPrice: 69,
    currency: "ILS",
    mode: "both",
    highlights: ["ללא הגבלת גלישה", "בלי התחייבות", "שימור המספר שלך"],
  },
  {
    id: "off_fiberline",
    provider: "Fiberline",
    topic: "telecom",
    jurisdiction: "IL",
    title: "אינטרנט סיבים ביתי",
    planName: "סיבים 1000",
    monthlyPrice: 99,
    currency: "ILS",
    minTermMonths: 12,
    mode: "digital",
    highlights: ["מהירות עד 1,000 מגה", "התקנה ללא עלות"],
  },
  {
    id: "off_shield",
    provider: "Shield Direct",
    topic: "insurance",
    jurisdiction: "IL",
    title: "ביטוח רכב מקיף",
    monthlyPrice: 290,
    currency: "ILS",
    mode: "agent",
    highlights: ["כיסוי זהה לפוליסה הנוכחית", "הצעה מותאמת על ידי סוכן"],
  },
  {
    id: "off_orbit_us",
    provider: "Orbit Wireless",
    topic: "telecom",
    jurisdiction: "US",
    title: "Unlimited phone plan",
    planName: "Unlimited Plus",
    monthlyPrice: 35,
    currency: "USD",
    mode: "digital",
    highlights: ["No contract", "Keep your number"],
  },
];

export const offerById = (id: string) => OFFERS.find((o) => o.id === id);
