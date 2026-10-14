"use client";

import { Camera, FileUp } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const ACCEPT = "application/pdf,image/png,image/jpeg,image/heic,image/webp";

export function UploadZone({ onFiles, onScan }: { onFiles: (files: File[]) => void; onScan: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <GlassCard
      className={cn("border-dashed p-0 transition-colors", over && "border-money/60 bg-money/[0.06]")}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(files);
      }}
    >
      <div className="flex flex-col items-center gap-5 px-6 py-8 text-center sm:flex-row sm:text-start">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/[0.05] text-ink">
          <FileUp className="size-6" />
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold">יש לך חשבונית?</p>
          <p className="mt-1 text-sm text-ink-muted">גררו לכאן קובץ, או צלמו קבלה. אנחנו נקרא אותה ונגיד לכם אם משהו לא בסדר.</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button size="lg" className="flex-1 sm:flex-none" onClick={onScan}>
            <Camera className="size-5" />
            צילום קבלה
          </Button>
          <Button size="lg" variant="secondary" className="flex-1 sm:flex-none" onClick={() => input.current?.click()}>
            בחירת קובץ
          </Button>
        </div>
        <input
          ref={input}
          type="file"
          accept={ACCEPT}
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onFiles(files);
            e.target.value = "";
          }}
        />
      </div>
    </GlassCard>
  );
}
