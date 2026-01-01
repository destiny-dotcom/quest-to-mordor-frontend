// Types for Apple Health sync integration

export interface AppleHealthSyncStatus {
  enabled: boolean;
  hasApiKey: boolean;
  lastSyncAt: string | null;
  apiKeyCreatedAt: string | null;
}

export interface GenerateApiKeyResponse {
  apiKey: string; // Only returned once - user must copy immediately
  createdAt: string;
}

export interface AppleHealthWebhookPayload {
  step: {
    step_count: number;
    recorded_date: string; // YYYY-MM-DD format
  };
}

export interface AppleHealthWebhookResponse {
  step: {
    id: string;
    step_count: number;
    recorded_date: string;
    source: string;
  };
  action: 'created' | 'updated';
}
