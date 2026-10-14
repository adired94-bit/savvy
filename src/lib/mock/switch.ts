import { offerById } from "@/lib/switch/offers";
import type { CurrentCharge, SwitchOpportunity } from "@/types/switch";

function opportunity(id: string, offerId: string, current: CurrentCharge): SwitchOpportunity {
  const offer = offerById(offerId)!;
  return { id, current, offer, yearlySaving: Math.max(0, (current.monthlyPrice - offer.monthlyPrice) * 12) };
}

/** Expensive charges the engine noticed. Later: derived from the user's documents and the live catalog. */
export const mockSwitchOpportunities: SwitchOpportunity[] = [
  opportunity("sw_cellular", "off_nimbus_5g", { provider: "פרטנר", label: "חבילת סלולר", monthlyPrice: 119, currency: "ILS" }),
  opportunity("sw_internet", "off_fiberline", { provider: "בזק", label: "אינטרנט ביתי", monthlyPrice: 149, currency: "ILS" }),
  opportunity("sw_car", "off_shield", { provider: "הראל ביטוח", label: "ביטוח רכב", monthlyPrice: 336, currency: "ILS" }),
  opportunity("sw_us_phone", "off_orbit_us", { provider: "Metro Mobile", label: "Phone plan", monthlyPrice: 55, currency: "USD" }),
];
