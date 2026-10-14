"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-midnight/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon, soon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={soon ? "#" : href}
                aria-disabled={soon}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px]",
                  active ? "text-money-bright" : "text-ink-faint",
                  soon && "pointer-events-none opacity-60",
                )}
              >
                <Icon className="size-5" />
                <span className="max-w-full truncate px-1">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
