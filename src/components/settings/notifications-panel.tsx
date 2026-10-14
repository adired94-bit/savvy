"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Switch } from "@/components/ui/switch";
import { useVaultStore } from "@/store/vault-store";
import type { NotificationChannel, NotificationEvent } from "@/types/vault";

const EVENTS: { id: NotificationEvent; label: string }[] = [
  { id: "anomaly", label: "מצאנו חיוב חריג" },
  { id: "reply", label: "חברה ענתה לפנייה" },
  { id: "credit", label: "קיבלת זיכוי או הנחה" },
  { id: "weekly", label: "סיכום שבועי" },
];
const CHANNELS: { id: NotificationChannel; label: string }[] = [
  { id: "push", label: "התראה" },
  { id: "email", label: "מייל" },
  { id: "whatsapp", label: "וואטסאפ" },
];

export function NotificationsPanel() {
  const prefs = useVaultStore((s) => s.notifications);
  const set = useVaultStore((s) => s.setNotification);

  return (
    <GlassCard>
      <SectionHeader title="התראות" subtitle="נעדכן אותך רק כשזה חשוב." />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-sm">
          <thead>
            <tr className="text-ink-muted">
              <th className="pb-3 text-start font-normal">מתי</th>
              {CHANNELS.map((c) => (
                <th key={c.id} className="w-20 pb-3 text-center font-normal">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {EVENTS.map((e) => (
              <tr key={e.id}>
                <td className="py-3 pe-3">{e.label}</td>
                {CHANNELS.map((c) => (
                  <td key={c.id} className="py-3">
                    <div className="flex justify-center">
                      <Switch checked={prefs[e.id][c.id]} onChange={(v) => set(e.id, c.id, v)} label={`${e.label}, ${c.label}`} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
