import { create } from "zustand";
import type {
  ProgressResponse,
  MilestonesResponse,
  AchievementsResponse,
} from "@/types";

interface ProgressState {
  progress: ProgressResponse | null;
  milestones: MilestonesResponse | null;
  achievements: AchievementsResponse | null;
  isLoading: boolean;
  error: string | null;

  setProgress: (progress: ProgressResponse) => void;
  setMilestones: (milestones: MilestonesResponse) => void;
  setAchievements: (achievements: AchievementsResponse) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: null,
  milestones: null,
  achievements: null,
  isLoading: false,
  error: null,

  setProgress: (progress) => set({ progress, error: null }),
  setMilestones: (milestones) => set({ milestones, error: null }),
  setAchievements: (achievements) => set({ achievements, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () =>
    set({
      progress: null,
      milestones: null,
      achievements: null,
      isLoading: false,
      error: null,
    }),
}));
