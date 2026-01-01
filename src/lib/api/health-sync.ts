import { api } from "./client";
import type { AppleHealthSyncStatus, GenerateApiKeyResponse } from "@/types";

/**
 * Get the current Apple Health sync status for the user
 */
export async function getAppleHealthStatus(): Promise<AppleHealthSyncStatus> {
  return api.get<AppleHealthSyncStatus>("/api/users/apple-health/status");
}

/**
 * Generate a new API key for Apple Health webhook
 * The key is only returned once - user must copy it immediately
 */
export async function generateAppleHealthApiKey(): Promise<GenerateApiKeyResponse> {
  return api.post<GenerateApiKeyResponse>("/api/users/apple-health/generate-key", {});
}

/**
 * Revoke the current API key (invalidates it immediately)
 */
export async function revokeAppleHealthApiKey(): Promise<void> {
  return api.delete<void>("/api/users/apple-health/revoke-key");
}

/**
 * Enable Apple Health sync for the user
 */
export async function enableAppleHealthSync(): Promise<AppleHealthSyncStatus> {
  return api.post<AppleHealthSyncStatus>("/api/users/apple-health/enable", {});
}

/**
 * Disable Apple Health sync for the user
 */
export async function disableAppleHealthSync(): Promise<AppleHealthSyncStatus> {
  return api.post<AppleHealthSyncStatus>("/api/users/apple-health/disable", {});
}
