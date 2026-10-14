import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let browserClient: SupabaseClient | null = null;

/**
 * Browser client (anon key, row level security does the protecting).
 * Returns null when the env vars are missing, so the app keeps running on mock data.
 * The service-role key is never imported here; it belongs only in server code.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return (browserClient ??= createClient(url, anonKey));
}
