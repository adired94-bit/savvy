"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/** Full-screen receipt scanner. Uses the live camera; falls back to the device's native camera/file picker. */
export function CameraScanner({ open, onClose, onCapture }: { open: boolean; onClose: () => void; onCapture: (file: File) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const fallback = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    let stream: MediaStream | null = null;
    let cancelled = false;
    setError(false);
    setReady(false);
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1920 } }, audio: false })
      .then((s) => {
        if (cancelled) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        if (video.current) {
          video.current.srcObject = s;
          setReady(true);
        }
      })
      .catch(() => setError(true));
    if (!navigator.mediaDevices) setError(true);
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [open]);

  function snap() {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext("2d")?.drawImage(v, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(new File([blob], "receipt.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9,
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-black"
          role="dialog"
          aria-label="סריקת קבלה"
        >
          <div className="flex items-center justify-between p-4">
            <p className="font-semibold">סריקת קבלה</p>
            <button onClick={onClose} aria-label="סגירה" className="grid size-10 place-items-center rounded-full bg-white/10">
              <X className="size-5" />
            </button>
          </div>

          <div className="relative mx-auto flex w-full max-w-xl flex-1 items-center justify-center px-4">
            {error ? (
              <div className="text-center">
                <p className="text-lg font-semibold">אין גישה למצלמה</p>
                <p className="mt-2 text-sm text-ink-muted">אפשר לצלם דרך אפליקציית המצלמה של המכשיר, או לבחור תמונה קיימת.</p>
              </div>
            ) : (
              <>
                <video ref={video} autoPlay playsInline muted className="max-h-full w-full rounded-2xl object-cover" />
                {/* receipt frame */}
                <div className="pointer-events-none absolute inset-x-10 inset-y-8 rounded-2xl border-2 border-white/70" />
                <p className="absolute bottom-12 rounded-full bg-black/60 px-3 py-1 text-sm">
                  {ready ? "ישרו את הקבלה בתוך המסגרת" : "פותחים מצלמה…"}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <Button variant="secondary" size="lg" onClick={() => fallback.current?.click()}>
              <ImagePlus className="size-5" />
              מהגלריה
            </Button>
            {!error && (
              <button
                onClick={snap}
                disabled={!ready}
                aria-label="צילום"
                className="grid size-[72px] place-items-center rounded-full border-4 border-white disabled:opacity-40"
              >
                <span className="grid size-[54px] place-items-center rounded-full bg-white text-obsidian">
                  <Camera className="size-6" />
                </span>
              </button>
            )}
          </div>
          <input
            ref={fallback}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onCapture(f);
              e.target.value = "";
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
