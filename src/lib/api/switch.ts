import { mockSwitchOpportunities } from "@/lib/mock/switch";
import type { ClientSwitchEvent, SwitchOpportunity } from "@/types/switch";

/** Smart Switch data boundary. Later: opportunities come from the engine and the Supabase catalog. */
export async function fetchSwitchOpportunities(): Promise<SwitchOpportunity[]> {
  await new Promise((r) => setTimeout(r, 300));
  return structuredClone(mockSwitchOpportunities);
}

/** URL that records the click on the server and then redirects to the partner. */
export const switchGoUrl = (o: SwitchOpportunity) =>
  `/api/switch/go?offer=${encodeURIComponent(o.offer.id)}&cur=${o.current.monthlyPrice}`;

/** Reports an impression, a dismissal or an agent request. Never throws: logging must not block the user. */
export async function logSwitchEvent(o: SwitchOpportunity, type: ClientSwitchEvent, consent?: { shared: string[] }): Promise<boolean> {
  try {
    const res = await fetch("/api/switch/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ offerId: o.offer.id, type, currentPrice: o.current.monthlyPrice, yearlySaving: o.yearlySaving, consent }),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}
