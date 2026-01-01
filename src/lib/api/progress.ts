import { api } from "./client";
import type { ProgressResponse, MilestonesResponse, AchievementsResponse } from "@/types";

export async function getProgress(): Promise<ProgressResponse> {
  return api.get<ProgressResponse>("/api/steps/progress");
}

export async function getMilestones(): Promise<MilestonesResponse> {
  return api.get<MilestonesResponse>("/api/steps/milestones");
}

export async function getAchievements(): Promise<AchievementsResponse> {
  return api.get<AchievementsResponse>("/api/steps/achievements");
}
