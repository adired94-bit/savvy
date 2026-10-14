"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClaims } from "@/lib/api/claims";
import type { ClaimCase, TimelineEvent } from "@/types/claims";

export const claimsKeys = { all: ["claims"] as const };

export function useClaims() {
  return useQuery({ queryKey: claimsKeys.all, queryFn: fetchClaims });
}

function patch(list: ClaimCase[] | undefined, id: string, fn: (c: ClaimCase) => ClaimCase) {
  return list?.map((c) => (c.id === id ? fn(c) : c));
}

const event = (status: TimelineEvent["status"], title: string, detail?: string): TimelineEvent => ({
  id: `${status}_${Date.now()}`,
  status,
  title,
  detail,
  at: new Date().toISOString(),
});

/**
 * One-tap approval. Sends the letter (mock), then simulates the provider acknowledging it so the
 * timeline visibly moves. Real status changes will arrive via email parsing + Supabase realtime.
 */
export function useApproveClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 900));
      return id;
    },
    onSuccess: (id) => {
      qc.setQueryData<ClaimCase[]>(claimsKeys.all, (list) =>
        patch(list, id, (c) => ({
          ...c,
          status: "sent",
          timeline: [event("sent", "שלחנו את הפנייה", "הפנייה נשלחה למחלקת פניות הציבור")],
        })),
      );
      setTimeout(() => {
        qc.setQueryData<ClaimCase[]>(claimsKeys.all, (list) =>
          patch(list, id, (c) =>
            c.status === "sent"
              ? { ...c, status: "in_progress", timeline: [...c.timeline, event("in_progress", "החברה אישרה קבלה", "קיבלנו אישור וממתינים לתשובה")] }
              : c,
          ),
        );
      }, 5000);
    },
  });
}
