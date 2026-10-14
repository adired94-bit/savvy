export type CategoryId = "subscriptions" | "telecom" | "banking" | "warranties" | "refunds";

export interface CategorySavings {
  id: CategoryId;
  amount: number;
  /** Number of resolved cases in this category. */
  cases: number;
}

export interface MonthlySavings {
  /** ISO month, e.g. "2026-10" */
  month: string;
  amount: number;
}

export type NegotiationStage = "detected" | "letter_sent" | "negotiating" | "resolved";

export interface Negotiation {
  id: string;
  provider: string;
  category: CategoryId;
  title: string;
  stage: NegotiationStage;
  /** Expected saving in market currency. */
  expectedSaving: number;
  recurrence: "monthly" | "one_time";
  lastUpdate: string;
  updatedAt: string;
}

export interface Anomaly {
  id: string;
  provider: string;
  category: CategoryId;
  title: string;
  description: string;
  amount: number;
  legalBasis: string;
  /** 0..1 model confidence */
  confidence: number;
  detectedAt: string;
}

export interface ActivityItem {
  id: string;
  kind: "refund" | "price_drop" | "letter" | "detected";
  title: string;
  provider: string;
  amount?: number;
  at: string;
}

export interface DashboardData {
  user: { firstName: string };
  savings: {
    month: number;
    lifetime: number;
    /** Change vs previous month, 0.24 = +24% */
    monthDelta: number;
    annualizedRecurring: number;
  };
  categories: CategorySavings[];
  trend: MonthlySavings[];
  negotiations: Negotiation[];
  anomalies: Anomaly[];
  activity: ActivityItem[];
}
