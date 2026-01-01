import { api } from "./client";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return api.post<AuthResponse>("/api/auth/login", data);
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return api.post<AuthResponse>("/api/auth/register", data);
}

export async function getProfile(): Promise<{ user: User }> {
  return api.get<{ user: User }>("/api/auth/profile");
}
