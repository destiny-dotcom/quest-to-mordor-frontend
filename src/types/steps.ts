export interface Step {
  id: string;
  user_id: string;
  step_count: number;
  miles: string;
  recorded_date: string;
  source: string;
  created_at: string;
}

export interface LogStepsRequest {
  step_count: number;
  recorded_date: string;
}

export interface TodayStepsResponse {
  today: {
    steps: number;
    miles: string;
    date: string;
  };
}

export interface StepsHistoryResponse {
  steps: Step[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
