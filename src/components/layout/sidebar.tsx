"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-e border-line bg-midnight/70 px-4 py-6 backdrop-blur-xl lg:flex">
      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-10 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, soon }) => {
          const active = pathname === href;
          const content = (
            <>
              <Icon className="size-[18px]" />
              <span className="flex-1">{label}</span>
              {soon && <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-ink-faint">בקרוב</span>}
            </>
          );
          const base = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors";
          return soon ? (
            <span key={href} className={cn(base, "cursor-not-allowed text-ink-faint")} aria-disabled>
              {content}
            </span>
          ) : (
            <Link
              key={href}
              href={href}
              className={cn(
                base,
                active
                  ? "bg-money/10 font-medium text-money-bright ring-1 ring-inset ring-money/20"
                  : "text-ink-muted hover:bg-white/[0.04] hover:text-ink",
              )}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-line bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-ink">
          <ShieldCheck className="size-4 text-money" />
          הצפנה מקצה לקצה
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
          המסמכים שלך מוצפנים, ואנחנו אף פעם לא רואים את סיסמאות הבנק שלך.
        </p>
      </div>
    </aside>
  );
}
