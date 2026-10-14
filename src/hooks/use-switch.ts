"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSwitchOpportunities } from "@/lib/api/switch";

export function useSwitchOpportunities() {
  return useQuery({ queryKey: ["switch-opportunities"], queryFn: fetchSwitchOpportunities });
}
