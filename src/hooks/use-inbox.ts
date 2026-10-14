"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { extractDocument, fetchInbox } from "@/lib/api/inbox";
import type { InboxData, InboxDocument } from "@/types/inbox";

export const inboxKeys = { all: ["inbox"] as const };

export function useInbox() {
  return useQuery({ queryKey: inboxKeys.all, queryFn: fetchInbox });
}

interface AddInput {
  file: Blob;
  source: "upload" | "camera";
  fileName?: string;
}

/** Adds a placeholder row immediately ("reading…"), then swaps in the extracted document. */
export function useAddDocument(onDone?: (doc: InboxDocument) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, source, fileName }: AddInput) => extractDocument(file, source, fileName),
    onMutate: ({ source, fileName, file }) => {
      const tempId = `tmp_${Date.now()}`;
      const placeholder: InboxDocument = {
        id: tempId,
        provider: fileName ?? (source === "camera" ? "קבלה מהמצלמה" : "קובץ חדש"),
        category: "shopping",
        label: "קוראים את המסמך…",
        source,
        receivedAt: new Date().toISOString(),
        status: "processing",
        total: 0,
        lineItems: [],
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      };
      qc.setQueryData<InboxData>(inboxKeys.all, (d) => d && { ...d, documents: [placeholder, ...d.documents] });
      return { tempId };
    },
    onSuccess: (doc, _vars, ctx) => {
      qc.setQueryData<InboxData>(inboxKeys.all, (d) =>
        d && { ...d, documents: d.documents.map((x) => (x.id === ctx?.tempId ? doc : x)) },
      );
      onDone?.(doc);
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueryData<InboxData>(inboxKeys.all, (d) =>
        d && { ...d, documents: d.documents.filter((x) => x.id !== ctx?.tempId) },
      );
    },
  });
}
