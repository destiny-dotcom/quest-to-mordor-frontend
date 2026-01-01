"use client";

import { cn } from "@/lib/utils";

type SyncStatus = "active" | "stale" | "inactive" | "disabled";

interface SyncStatusBadgeProps {
  lastSyncAt: string | null;
  enabled: boolean;
  className?: string;
}

export function SyncStatusBadge({ lastSyncAt, enabled, className }: SyncStatusBadgeProps) {
  const status = getSyncStatus(lastSyncAt, enabled);

  const statusConfig: Record<SyncStatus, { color: string; label: string }> = {
    active: { color: "bg-primary", label: "Synced" },
    stale: { color: "bg-warning", label: "Stale" },
    inactive: { color: "bg-error", label: "Inactive" },
    disabled: { color: "bg-text-muted", label: "Disabled" },
  };

  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-1.5 text-xs", className)}>
      <span className={cn("h-2 w-2 rounded-full", config.color)} />
      <span className="text-text-secondary">{config.label}</span>
    </div>
  );
}

function getSyncStatus(lastSyncAt: string | null, enabled: boolean): SyncStatus {
  if (!enabled) return "disabled";
  if (!lastSyncAt) return "inactive";

  const lastSync = new Date(lastSyncAt);
  const now = new Date();
  const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

  if (hoursSinceSync <= 24) return "active";
  if (hoursSinceSync <= 72) return "stale";
  return "inactive";
}
