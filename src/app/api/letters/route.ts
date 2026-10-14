import { NextResponse } from "next/server";
import { AiError, callStructured } from "@/lib/ai/claude";
import { aiConfigured } from "@/lib/ai/config";
import { clientKey, rateLimit } from "@/lib/ai/rate-limit";
import { letterSystem, letterUserText } from "@/lib/ai/prompts";
import { letterJsonSchema, letterParser, letterRequestParser } from "@/lib/ai/schemas";
import { groundsFor, letterLanguageFor } from "@/lib/legal";

export const runtime = "nodejs";
export const maxDuration = 60;

const fail = (code: string, message: string, status: number) => NextResponse.json({ code, message }, { status });

/** Drafts a cancellation or refund letter that may cite only the legal library for the case's jurisdiction. */
export async function POST(req: Request) {
  if (!aiConfigured()) return fail("ai_not_configured", "ANTHROPIC_API_KEY is not set", 503);
  if (!rateLimit(`letters:${clientKey(req)}`, 20)) return fail("rate_limited", "Too many requests, try again in a minute", 429);

  const body = await req.json().catch(() => null);
  const parsed = letterRequestParser.safeParse(body);
  if (!parsed.success) return fail("bad_request", "Invalid letter request", 400);
  const r = parsed.data;

  const language = r.language ?? letterLanguageFor(r.jurisdiction);
  const grounds = groundsFor(r.jurisdiction, r.topic);
  if (grounds.length === 0) return fail("no_legal_grounds", "No legal grounds available for this case", 422);
  const allowed = new Set(grounds.map((g) => g.id));

  try {
    const result = await callStructured({
      system: letterSystem(language, grounds),
      content: [{ type: "text", text: letterUserText(r) }],
      jsonSchema: letterJsonSchema as unknown as Record<string, unknown>,
      parser: letterParser,
      maxTokens: 4000,
      effort: "medium",
    });
    const cited = result.data.citedGroundIds;
    if (cited.length === 0 || !cited.every((id) => allowed.has(id))) {
      return fail("ai_bad_output", "The letter cited a legal basis outside the allowed library", 502);
    }
    return NextResponse.json({ ...result, language, jurisdiction: r.jurisdiction });
  } catch (err) {
    if (err instanceof AiError) return fail(err.code, err.message, err.status);
    return fail("ai_error", "Unexpected error", 500);
  }
}
