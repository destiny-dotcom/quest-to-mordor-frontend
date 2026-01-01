export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  total_steps: string;
  total_miles: string;
  current_milestone_id: string | null;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  display_name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
