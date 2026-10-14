"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { useSwitchOpportunities } from "@/hooks/use-switch";
import { SwitchCard } from "./switch-card";

/** Cards for charges where a cheaper company exists. Renders nothing when there is nothing to suggest. */
export function SwitchSection({ limit = 2 }: { limit?: number }) {
  const { data } = useSwitchOpportunities();
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const items = (data ?? [])
    .filter((o) => !hidden.has(o.id))
    .sort((a, b) => b.yearlySaving - a.yearlySaving)
    .slice(0, limit);
  if (items.length === 0) return null;

  return (
    <section>
      <SectionHeader title="אפשר לשלם פחות" subtitle="מצאנו חברות זולות יותר על חיובים שיש לך היום" />
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((o) => (
          <SwitchCard key={o.id} item={o} onDismiss={() => setHidden((h) => new Set(h).add(o.id))} />
        ))}
      </div>
    </section>
  );
}
