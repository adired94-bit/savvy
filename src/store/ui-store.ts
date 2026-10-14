import { create } from "zustand";
import type { CategoryId } from "@/types/finance";

type AnomalyState = "pending" | "approving" | "handed_off";

interface UiState {
  /** Category highlighted in the savings breakdown chart. */
  activeCategory: CategoryId | null;
  setActiveCategory: (id: CategoryId | null) => void;

  /** Local approval state for the one-tap "let AI handle it" flow (persisted server-side in Module 3). */
  anomalyStatus: Record<string, AnomalyState>;
  approveAnomaly: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeCategory: null,
  setActiveCategory: (id) => set({ activeCategory: id }),

  anomalyStatus: {},
  approveAnomaly: (id) => {
    set((s) => ({ anomalyStatus: { ...s.anomalyStatus, [id]: "approving" } }));
    setTimeout(() => {
      set((s) => ({ anomalyStatus: { ...s.anomalyStatus, [id]: "handed_off" } }));
    }, 1400);
  },
}));
