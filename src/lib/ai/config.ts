import "server-only";

/**
 * Server-side AI configuration.
 *
 * Default model is the current Claude Sonnet (the original brief named Claude 3.5 Sonnet, which is
 * retired). Override with ANTHROPIC_MODEL, for example `claude-opus-5-5` for the hardest documents.
 */
export const AI_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

export const aiConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY);

/** Server-side refusal fallback is on by default; turn it off on platforms that don't support it. */
export const useServerFallback = () => process.env.ANTHROPIC_SERVER_FALLBACK !== "off";
