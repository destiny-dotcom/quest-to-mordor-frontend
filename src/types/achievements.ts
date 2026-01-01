export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string | null;
  requirement_type: string;
  requirement_value: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface AchievementsResponse {
  achievements: Achievement[];
  unlocked_count: number;
  total_count: number;
  progress_percent: number;
}
