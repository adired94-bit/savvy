"use client";

import { Bell, Search } from "lucide-react";
import { Logo } from "./logo";

function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "בוקר טוב";
  if (h < 17) return "צהריים טובים";
  if (h < 21) return "ערב טוב";
  return "לילה טוב";
}

export function TopBar({ firstName, title }: { firstName?: string; title: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="lg:hidden">
        <Logo />
      </div>
      <div className="hidden lg:block">
        <p className="text-sm text-ink-muted" suppressHydrationWarning>
          {greeting()}
          {firstName ? `, ${firstName}` : ""}
        </p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <label className="hidden h-10 items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-3 text-sm text-ink-muted md:flex">
          <Search className="size-4" />
          <input
            placeholder="חיפוש ספק, חשבונית או תביעה"
            className="w-56 bg-transparent text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </label>
        <button
          className="relative grid size-10 place-items-center rounded-xl border border-line bg-white/[0.03] text-ink-muted transition-colors hover:text-ink"
          aria-label="התראות"
        >
          <Bell className="size-[18px]" />
          <span className="absolute end-2.5 top-2.5 size-2 rounded-full bg-money ring-2 ring-obsidian" />
        </button>
        <div className="grid size-10 place-items-center rounded-xl bg-card ring-1 ring-inset ring-line-strong text-sm font-semibold">
          {firstName?.[0] ?? "?"}
        </div>
      </div>
    </header>
  );
}
