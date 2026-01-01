export interface Milestone {
  id: string;
  name: string;
  description: string;
  distance_from_start: string;
  order_index: number;
  image_url: string | null;
  quote?: string;
}

export interface MilestoneReached {
  milestone: Milestone;
  reached_at: string;
}

export interface MilestonesResponse {
  milestones: Milestone[];
}
