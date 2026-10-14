/**
 * Market configuration. Israel is the launch market; the rest of the app reads
 * locale, currency and direction from here so US/EU can be added without UI rewrites.
 */
export type MarketId = "il" | "us" | "eu";

export interface MarketConfig {
  id: MarketId;
  locale: string;
  currency: string;
  dir: "rtl" | "ltr";
  /** Consumer-protection framework the claims engine (Module 3) grounds letters in. */
  legalFramework: string;
}

export const MARKETS: Record<MarketId, MarketConfig> = {
  il: { id: "il", locale: "he-IL", currency: "ILS", dir: "rtl", legalFramework: "חוק הגנת הצרכן, התשמ״א-1981" },
  us: { id: "us", locale: "en-US", currency: "USD", dir: "ltr", legalFramework: "FTC Act / state UDAP statutes" },
  eu: { id: "eu", locale: "en-IE", currency: "EUR", dir: "ltr", legalFramework: "EU Consumer Rights Directive 2011/83/EU" },
};

export const ACTIVE_MARKET: MarketConfig = MARKETS.il;
