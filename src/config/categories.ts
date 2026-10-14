import { Landmark, Plane, Repeat, ShieldCheck, Smartphone, type LucideIcon } from "lucide-react";
import type { CategoryId } from "@/types/finance";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  /** CSS variable from the design system so SVG charts and Tailwind share one palette. */
  color: string;
  /** Tailwind classes for tinted badges / icon chips. */
  tint: string;
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  subscriptions: { id: "subscriptions", label: "מנויים", icon: Repeat, color: "var(--color-cat-subscriptions)", tint: "bg-cat-subscriptions/12 text-cat-subscriptions" },
  telecom: { id: "telecom", label: "תקשורת", icon: Smartphone, color: "var(--color-cat-telecom)", tint: "bg-cat-telecom/12 text-cat-telecom" },
  banking: { id: "banking", label: "עמלות בנק", icon: Landmark, color: "var(--color-cat-banking)", tint: "bg-cat-banking/12 text-cat-banking" },
  warranties: { id: "warranties", label: "אחריות", icon: ShieldCheck, color: "var(--color-cat-warranties)", tint: "bg-cat-warranties/12 text-cat-warranties" },
  refunds: { id: "refunds", label: "עיכובים והחזרים", icon: Plane, color: "var(--color-cat-refunds)", tint: "bg-cat-refunds/12 text-cat-refunds" },
};

export const CATEGORY_ORDER: CategoryId[] = ["subscriptions", "telecom", "banking", "warranties", "refunds"];
