import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/ai/rate-limit";
import { logSwitchEvent } from "@/lib/switch/event-log";
import { offerById } from "@/lib/switch/offers";
import { PARTNER_LINKS } from "@/lib/switch/partners";

export const runtime = "nodejs";

/** Only what the browser can truthfully report. Clicks are recorded by /api/switch/go, conversions by the partner. */
const body = z.object({
  offerId: z.string().max(100),
  type: z.enum(["impression", "dismissed", "agent_requested"]),
  currentPrice: z.number().nonnegative().max(1e9).optional(),
  yearlySaving: z.number().nonnegative().max(1e9).optional(),
  /** Required for agent_requested: the fields the user agreed to share. */
  consent: z.object({ shared: z.array(z.string().max(60)).min(1).max(10) }).optional(),
});

export async function POST(req: Request) {
  if (!rateLimit(`switch-events:${clientKey(req)}`, 60)) return NextResponse.json({ code: "rate_limited" }, { status: 429 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ code: "bad_request" }, { status: 400 });
  const e = parsed.data;

  const offer = offerById(e.offerId);
  const link = offer && PARTNER_LINKS[offer.id];
  if (!offer || !link) return NextResponse.json({ code: "unknown_offer" }, { status: 404 });
  if (e.type === "agent_requested" && !e.consent) return NextResponse.json({ code: "consent_required" }, { status: 400 });

  const rec = logSwitchEvent({
    type: e.type,
    offerId: offer.id,
    channel: e.type === "agent_requested" ? "agent" : undefined,
    currentPrice: e.currentPrice,
    offerPrice: offer.monthlyPrice,
    currency: offer.currency,
    yearlySaving: e.yearlySaving,
    expectedReward: link.cpaReward,
    rewardCurrency: link.cpaCurrency,
    consent: e.consent ? { shared: e.consent.shared, at: new Date().toISOString() } : undefined,
  });
  return NextResponse.json({ ok: true, at: rec.at });
}
