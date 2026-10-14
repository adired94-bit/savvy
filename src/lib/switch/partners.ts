import "server-only";

/**
 * Server-only side of the catalog (mirrors the private `offers` table in Supabase).
 * Affiliate links, our partner ids and the expected commission never reach the browser.
 * `{click_id}` in a link is replaced with the click's own id so the partner can report the conversion back.
 */
export interface PartnerLink {
  affiliateUrl: string;
  partnerId: string;
  network: string;
  /** Predicted commission per confirmed switch. */
  cpaReward: number;
  cpaCurrency: string;
}

export const PARTNER_LINKS: Record<string, PartnerLink> = {
  off_nimbus_5g: { affiliateUrl: "https://partners.example.com/nimbus/switch?pid={partner_id}&sub={click_id}", partnerId: "sv-nimbus-001", network: "direct", cpaReward: 120, cpaCurrency: "ILS" },
  off_fiberline: { affiliateUrl: "https://partners.example.com/fiberline/order?aff={partner_id}&click={click_id}", partnerId: "sv-fiber-002", network: "direct", cpaReward: 150, cpaCurrency: "ILS" },
  off_shield: { affiliateUrl: "https://partners.example.com/shield/lead?partner={partner_id}&ref={click_id}", partnerId: "sv-shield-003", network: "direct", cpaReward: 200, cpaCurrency: "ILS" },
  off_orbit_us: { affiliateUrl: "https://partners.example.com/orbit/join?pid={partner_id}&subid={click_id}", partnerId: "sv-orbit-004", network: "example-network", cpaReward: 40, cpaCurrency: "USD" },
};
