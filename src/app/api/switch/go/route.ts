import { NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/ai/rate-limit";
import { logSwitchEvent } from "@/lib/switch/event-log";
import { offerById } from "@/lib/switch/offers";
import { PARTNER_LINKS } from "@/lib/switch/partners";

export const runtime = "nodejs";

const num = (v: string | null) => {
  const n = v === null ? NaN : Number(v);
  return Number.isFinite(n) && n >= 0 && n < 1e9 ? n : undefined;
};

/**
 * GET /api/switch/go?offer=<id>&cur=<current monthly price>
 * Records the click, then redirects to the partner with our id and this click's id.
 * The destination comes only from the server catalog, never from the request, so it cannot be used as an open redirect.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const offer = offerById(url.searchParams.get("offer") ?? "");
  const link = offer && PARTNER_LINKS[offer.id];
  if (!offer || !link) return NextResponse.json({ code: "unknown_offer" }, { status: 404 });
  if (!rateLimit(`go:${clientKey(req)}`, 30)) return NextResponse.json({ code: "rate_limited" }, { status: 429 });

  const clickId = crypto.randomUUID();
  const cur = num(url.searchParams.get("cur"));
  logSwitchEvent({
    type: "click",
    offerId: offer.id,
    clickId,
    channel: "digital",
    currentPrice: cur,
    offerPrice: offer.monthlyPrice,
    currency: offer.currency,
    yearlySaving: cur === undefined ? undefined : Math.max(0, (cur - offer.monthlyPrice) * 12),
    expectedReward: link.cpaReward,
    rewardCurrency: link.cpaCurrency,
  });

  const dest = new URL(link.affiliateUrl.replace("{partner_id}", encodeURIComponent(link.partnerId)).replace("{click_id}", clickId));
  if (dest.protocol !== "https:") return NextResponse.json({ code: "bad_destination" }, { status: 500 });
  return NextResponse.redirect(dest, 302);
}
