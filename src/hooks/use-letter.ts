"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLetter } from "@/lib/api/letters";
import type { ClaimCase } from "@/types/claims";

/** One letter per case. Cached so reopening a case never re-bills the model. */
export function useLetter(claim: ClaimCase) {
  return useQuery({
    queryKey: ["letter", claim.id],
    queryFn: () => fetchLetter(claim),
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    retry: false,
  });
}
