"use client";

import { useProgress } from "@/hooks";
import { ProgressBar, Spinner } from "@/components/ui";
import { JourneyMap } from "@/components/features/milestones";

export default function MilestonesPage() {
  const { progress, milestones, isLoading } = useProgress();

  if (isLoading || !milestones || !progress) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const reachedCount = progress.journey.milestones_reached_count;
  const totalCount = milestones.milestones.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Journey Map</h1>
            <p className="text-xs text-text-secondary">
              The Road to Mordor
            </p>
          </div>
          {totalCount > 0 && (
            <div className="text-right">
              <span className="text-gold font-semibold text-sm">
                {reachedCount}/{totalCount}
              </span>
              <p className="text-xs text-text-secondary">milestones</p>
            </div>
          )}
        </div>
        {totalCount > 0 && (
          <div className="mt-3">
            <ProgressBar
              value={reachedCount}
              max={totalCount}
              variant="gold"
              size="sm"
            />
          </div>
        )}
      </header>

      <main className="w-full">
        <JourneyMap />
      </main>
    </div>
  );
}
