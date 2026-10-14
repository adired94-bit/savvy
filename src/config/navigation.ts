import { Inbox, LayoutDashboard, Lock, Scale, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Module not built yet: shown but disabled. */
  soon?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "לוח בקרה", icon: LayoutDashboard },
  { href: "/inbox", label: "חשבוניות", icon: Inbox },
  { href: "/claims", label: "תביעות", icon: Scale, soon: true },
  { href: "/vault", label: "כספת", icon: Lock, soon: true },
];
