import { ACTIVE_MARKET } from "@/config/market";

const currencyFmt = new Intl.NumberFormat(ACTIVE_MARKET.locale, {
  style: "currency",
  currency: ACTIVE_MARKET.currency,
  maximumFractionDigits: 0,
});

const percentFmt = new Intl.NumberFormat(ACTIVE_MARKET.locale, {
  style: "percent",
  maximumFractionDigits: 0,
});

const relativeFmt = new Intl.RelativeTimeFormat(ACTIVE_MARKET.locale, { numeric: "auto" });

export const formatCurrency = (value: number) => currencyFmt.format(Math.round(value));
const signedCurrencyFmt = new Intl.NumberFormat(ACTIVE_MARKET.locale, {
  style: "currency",
  currency: ACTIVE_MARKET.currency,
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});

export const formatSignedCurrency = (value: number) => signedCurrencyFmt.format(Math.round(value));
export const formatPercent = (value: number) => percentFmt.format(value);

export function formatRelative(iso: string, now: Date = new Date()) {
  const diffMin = Math.round((new Date(iso).getTime() - now.getTime()) / 60000);
  if (Math.abs(diffMin) < 60) return relativeFmt.format(diffMin, "minute");
  const diffHours = Math.round(diffMin / 60);
  if (Math.abs(diffHours) < 24) return relativeFmt.format(diffHours, "hour");
  return relativeFmt.format(Math.round(diffHours / 24), "day");
}

const moneyCache = new Map<string, Intl.NumberFormat>();

/** Formats an amount in any ISO 4217 currency, using the active market's locale for layout. */
export function formatMoney(value: number, currency: string = ACTIVE_MARKET.currency, opts: { precise?: boolean } = {}) {
  const key = `${currency}|${opts.precise ? 2 : 0}`;
  let fmt = moneyCache.get(key);
  if (!fmt) {
    try {
      fmt = new Intl.NumberFormat(ACTIVE_MARKET.locale, {
        style: "currency",
        currency,
        minimumFractionDigits: opts.precise ? 2 : 0,
        maximumFractionDigits: opts.precise ? 2 : 0,
      });
    } catch {
      // Unknown currency code from a document: fall back to a plain number with the code.
      fmt = new Intl.NumberFormat(ACTIVE_MARKET.locale, { minimumFractionDigits: opts.precise ? 2 : 0, maximumFractionDigits: opts.precise ? 2 : 0 });
      moneyCache.set(key, fmt);
      return `${fmt.format(value)} ${currency}`;
    }
    moneyCache.set(key, fmt);
  }
  return fmt.format(opts.precise ? value : Math.round(value));
}
