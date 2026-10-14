import { mockDashboard } from "@/lib/mock/dashboard";
import type { DashboardData } from "@/types/finance";

/**
 * Data access boundary. Module 1 resolves mock data; later this calls Supabase
 * (RLS-scoped to the signed-in user) without any change to the UI.
 */
export async function fetchDashboard(): Promise<DashboardData> {
  await new Promise((r) => setTimeout(r, 350));
  return mockDashboard;
}
