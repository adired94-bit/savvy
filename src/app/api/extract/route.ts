import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { AiError, callStructured } from "@/lib/ai/claude";
import { aiConfigured } from "@/lib/ai/config";
import { clientKey, rateLimit } from "@/lib/ai/rate-limit";
import { EXTRACTION_SYSTEM, extractionUserText } from "@/lib/ai/prompts";
import { extractionJsonSchema, extractionParser } from "@/lib/ai/schemas";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 10 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
type ImageType = (typeof IMAGE_TYPES)[number];

const fail = (code: string, message: string, status: number) => NextResponse.json({ code, message }, { status });

/** Reads one scanned bill (PDF or image) and returns structured data. */
export async function POST(req: Request) {
  if (!aiConfigured()) return fail("ai_not_configured", "ANTHROPIC_API_KEY is not set", 503);
  if (!rateLimit(`extract:${clientKey(req)}`, 12)) return fail("rate_limited", "Too many requests, try again in a minute", 429);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("bad_request", "Expected multipart form data", 400);
  }
  const file = form.get("file");
  if (!(file instanceof File)) return fail("bad_request", "Missing file", 400);
  if (file.size === 0 || file.size > MAX_BYTES) return fail("file_too_large", "File must be between 1 byte and 10 MB", 413);

  const isPdf = file.type === "application/pdf";
  const isImage = (IMAGE_TYPES as readonly string[]).includes(file.type);
  if (!isPdf && !isImage) return fail("unsupported_type", "Upload a PDF, PNG, JPEG, WebP or GIF file", 415);

  const lang = String(form.get("lang") ?? "he").slice(0, 12).replace(/[^a-zA-Z-]/g, "") || "he";
  const data = Buffer.from(await file.arrayBuffer()).toString("base64");

  const media: Anthropic.Beta.BetaContentBlockParam = isPdf
    ? { type: "document", source: { type: "base64", media_type: "application/pdf", data } }
    : { type: "image", source: { type: "base64", media_type: file.type as ImageType, data } };

  try {
    const result = await callStructured({
      system: EXTRACTION_SYSTEM,
      content: [media, { type: "text", text: extractionUserText(lang) }],
      jsonSchema: extractionJsonSchema as unknown as Record<string, unknown>,
      parser: extractionParser,
      maxTokens: 8000,
      effort: "medium",
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AiError) return fail(err.code, err.message, err.status);
    return fail("ai_error", "Unexpected error", 500);
  }
}
