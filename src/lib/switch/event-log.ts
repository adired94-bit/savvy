import "server-only";
import type { SwitchEventType } from "@/types/switch";

export interface SwitchEventRecord {
  type: SwitchEventType;
  offerId: string;
  clickId?: string;
  channel?: "digital" | "agent";
  currentPrice?: number;
  offerPrice?: number;
  currency?: string;
  yearlySaving?: number;
  expectedReward?: number;
  rewardCurrency?: string;
  consent?: { shared: string[]; at: string };
  at: string;
}

const MAX = 1000;
const buffer: SwitchEventRecord[] = [];

/**
 * Appends one event. Until Supabase auth exists there is no user to attach it to, so events go to a
 * bounded in-memory buffer and to the server log as one JSON line each (`switch_event {...}`).
 * Later: insert into `switch_events` (supabase/migrations/0002_smart_switch.sql) with the user's id.
 */
export function logSwitchEvent(e: Omit<SwitchEventRecord, "at">): SwitchEventRecord {
  const rec = { ...e, at: new Date().toISOString() };
  buffer.push(rec);
  if (buffer.length > MAX) buffer.shift();
  console.info("switch_event", JSON.stringify(rec));
  return rec;
}

export const recentSwitchEvents = () => buffer.slice();
