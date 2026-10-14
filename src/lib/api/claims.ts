import { mockClaims } from "@/lib/mock/claims";
import type { ClaimCase } from "@/types/claims";

/**
 * Claims data boundary. Later: Supabase for cases, a server route that drafts and sends letters
 * through the user's connected email under their limited power of attorney (module 4).
 */
export async function fetchClaims(): Promise<ClaimCase[]> {
  await new Promise((r) => setTimeout(r, 300));
  return structuredClone(mockClaims);
}
