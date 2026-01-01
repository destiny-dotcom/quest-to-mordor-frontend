import type { Milestone } from "./milestones";
import type { User } from "./auth";

export interface ProgressResponse {
  user: User;
  journey: {
    current_milestone: Milestone | null;
    next_milestone: Milestone | null;
    milestones_reached: Array<{
      milestone: Milestone;
      reached_at: string;
    }>;
    milestones_reached_count: number;
    progress_to_next_milestone: number;
    miles_to_next_milestone: number;
    journey_progress_percent: number;
    total_journey_miles: number;
    miles_remaining: number;
  };
}
