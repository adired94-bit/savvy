"use client";

import { Eraser } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/** Draw-your-signature canvas. Reports a PNG data URL, or null when empty. */
export function SignaturePad({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);

  const setup = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = c.getBoundingClientRect();
    c.width = width * ratio;
    c.height = height * ratio;
    const ctx = c.getContext("2d")!;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#f8fafc";
  }, []);

  useEffect(setup, [setup]);

  const pos = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  function start(e: React.PointerEvent) {
    canvas.current!.setPointerCapture(e.pointerId);
    drawing.current = true;
    const ctx = canvas.current!.getContext("2d")!;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + 0.01, p.y + 0.01);
    ctx.stroke();
  }
  function move(e: React.PointerEvent) {
    if (!drawing.current) return;
    const ctx = canvas.current!.getContext("2d")!;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (empty) setEmpty(false);
  }
  function end() {
    if (!drawing.current) return;
    drawing.current = false;
    onChange(canvas.current!.toDataURL("image/png"));
  }
  function clear() {
    const c = canvas.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setEmpty(true);
    onChange(null);
  }

  return (
    <div>
      <div className="relative rounded-2xl border border-line-strong bg-obsidian">
        <canvas
          ref={canvas}
          aria-label="אזור חתימה"
          className="h-44 w-full touch-none rounded-2xl"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
        {empty && <p className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-ink-faint">חתמו כאן עם האצבע או העכבר</p>}
        <div className="pointer-events-none absolute inset-x-6 bottom-9 border-b border-dashed border-line-strong" />
      </div>
      <Button variant="ghost" size="sm" className="mt-2" onClick={clear} disabled={empty}>
        <Eraser className="size-4" />
        ניקוי
      </Button>
    </div>
  );
}
