import type { ClaimTopic, Jurisdiction } from "./claims";

/** What the app may show about a recommended company. Affiliate data never appears here. */
export interface SwitchOffer {
  id: string;
  provider: string;
  topic: ClaimTopic;
  jurisdiction: Jurisdiction;
  title: string;
  planName?: string;
  monthlyPrice: number;
  currency: string;
  /** Minimum commitment in months, when there is one. */
  minTermMonths?: number;
  /** "digital": switch online. "agent": a representative calls. "both": the user picks. */
  mode: "digital" | "agent" | "both";
  highlights: string[];
}

export interface CurrentCharge {
  provider: string;
  label: string;
  monthlyPrice: number;
  currency: string;
}

export interface SwitchOpportunity {
  id: string;
  current: CurrentCharge;
  offer: SwitchOffer;
  /** (current - offer) * 12, in the offer's currency. */
  yearlySaving: number;
}

export type SwitchEventType = "impression" | "dismissed" | "click" | "agent_requested" | "converted" | "reward_confirmed" | "failed";

/** What the browser may report. Conversions and rewards only ever come from the partner side. */
export type ClientSwitchEvent = "impression" | "dismissed" | "agent_requested";
