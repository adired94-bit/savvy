import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import type { z } from "zod";
import { AI_MODEL, serverFallbackEnabled } from "./config";

export class AiError extends Error {
  constructor(
    readonly code: "ai_not_configured" | "ai_rate_limited" | "ai_refused" | "ai_truncated" | "ai_bad_output" | "ai_error",
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

export interface CacheUsage {
  inputTokens: number;
  outputTokens: number;
  cacheWriteTokens: number;
  cacheReadTokens: number;
}

interface StructuredRequest<T> {
  /** Stable instructions. Cached: keep it identical across calls and put per-request data in `content`. */
  system: string;
  content: Anthropic.Beta.BetaContentBlockParam[];
  /** JSON Schema sent to the API (structured outputs). */
  jsonSchema: Record<string, unknown>;
  /** Zod schema that validates what came back. */
  parser: z.ZodType<T>;
  maxTokens: number;
  effort?: "low" | "medium" | "high";
}

/**
 * One structured Claude call.
 *
 * - Prompt caching: the system prompt carries an ephemeral cache breakpoint, so the stable prefix
 *   (instructions and legal library) is billed at the cache-read rate on repeat calls.
 * - Structured outputs: the reply is constrained to `jsonSchema`, then validated again with zod.
 * - Refusals: the server-side fallback is enabled by default (see config.ts).
 */
export async function callStructured<T>(req: StructuredRequest<T>): Promise<{ data: T; usage: CacheUsage; model: string }> {
  if (!process.env.ANTHROPIC_API_KEY) throw new AiError("ai_not_configured", "ANTHROPIC_API_KEY is not set", 503);

  let response: Anthropic.Beta.BetaMessage;
  try {
    response = await getClient().beta.messages.create({
      model: AI_MODEL,
      max_tokens: req.maxTokens,
      system: [{ type: "text", text: req.system, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: req.content }],
      output_config: { effort: req.effort ?? "medium", format: { type: "json_schema", schema: req.jsonSchema } },
      ...(serverFallbackEnabled() ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) throw new AiError("ai_rate_limited", "The AI service is busy, try again shortly", 429);
    if (err instanceof Anthropic.AuthenticationError) throw new AiError("ai_not_configured", "The Anthropic API key was rejected", 503);
    if (err instanceof Anthropic.APIError) throw new AiError("ai_error", `AI request failed (${err.status ?? "network"})`, 502);
    throw new AiError("ai_error", "AI request failed", 502);
  }

  if (response.stop_reason === "refusal") throw new AiError("ai_refused", "The AI declined to process this content", 422);
  if (response.stop_reason === "max_tokens") throw new AiError("ai_truncated", "The AI reply was cut off", 502);

  const text = response.content.find((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")?.text;
  if (!text) throw new AiError("ai_bad_output", "The AI returned no content", 502);

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new AiError("ai_bad_output", "The AI returned invalid JSON", 502);
  }
  const parsed = req.parser.safeParse(json);
  if (!parsed.success) throw new AiError("ai_bad_output", "The AI reply did not match the expected shape", 502);

  const u = response.usage;
  return {
    data: parsed.data,
    model: response.model,
    usage: {
      inputTokens: u.input_tokens,
      outputTokens: u.output_tokens,
      cacheWriteTokens: u.cache_creation_input_tokens ?? 0,
      cacheReadTokens: u.cache_read_input_tokens ?? 0,
    },
  };
}
