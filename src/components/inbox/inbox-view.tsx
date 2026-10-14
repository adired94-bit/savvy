"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddDocument, useInbox } from "@/hooks/use-inbox";
import { CameraScanner } from "./camera-scanner";
import { DocumentDetail } from "./document-detail";
import { DocumentList } from "./document-list";
import { MailConnections } from "./mail-connections";
import { UploadZone } from "./upload-zone";

export function InboxView() {
  const { data, isPending } = useInbox();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const add = useAddDocument((doc) => setSelectedId(doc.id));

  const selected = data?.documents.find((d) => d.id === selectedId) ?? null;
  const toReview = data?.documents.filter((d) => d.status === "needs_review").length ?? 0;

  function addFiles(files: File[]) {
    files.forEach((file) => add.mutate({ file, source: "upload", fileName: file.name.replace(/\.[^.]+$/, "") }));
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <TopBar title="החשבוניות שלך" />

      <UploadZone onFiles={addFiles} onScan={() => setScanning(true)} />

      <CameraScanner
        open={scanning}
        onClose={() => setScanning(false)}
        onCapture={(file) => {
          setScanning(false);
          add.mutate({ file, source: "camera" });
        }}
      />

      {isPending || !data ? (
        <Skeleton className="h-96" />
      ) : (
        <>
          <MailConnections connections={data.connections} />

          <div className="grid items-start gap-5 xl:grid-cols-12">
            <section className={selected ? "hidden xl:col-span-5 xl:block" : "xl:col-span-5"}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-base font-semibold">כל המסמכים</h2>
                {toReview > 0 && <p className="text-sm text-alert">{toReview} שווים בדיקה</p>}
              </div>
              <DocumentList documents={data.documents} selectedId={selectedId} onSelect={setSelectedId} />
            </section>

            <section className={selected ? "xl:col-span-7" : "hidden xl:col-span-7 xl:block"}>
              {selected ? (
                <div className="xl:sticky xl:top-8">
                  <DocumentDetail doc={selected} onBack={() => setSelectedId(null)} />
                </div>
              ) : (
                <div className="grid h-72 place-items-center rounded-card border border-dashed border-line text-center text-sm text-ink-muted">
                  בחרו מסמך כדי לראות מה קראנו ממנו
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
