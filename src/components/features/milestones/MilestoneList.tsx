"use client";

import { useProgress } from "@/hooks";
import { Spinner } from "@/components/ui";
import { MilestoneCard } from "./MilestoneCard";

export function MilestoneList() {
  const { progress, milestones, isLoading } = useProgress();

  if (isLoading || !milestones || !progress) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  // Build a set of reached milestone IDs
  const reachedIds = new Set<string>();
  const reachedDates = new Map<string, string>();

  if (Array.isArray(progress.journey.milestones_reached)) {
    progress.journey.milestones_reached.forEach((r) => {
      const id = r.milestone?.id;
      const date = r.reached_at;
      if (id) {
        reachedIds.add(id);
        if (date) reachedDates.set(id, date);
      }
    });
  }

  const currentMilestone = progress.journey.current_milestone;

  return (
    <div className="space-y-4">
      {milestones.milestones.map((milestone) => {
        const isReached = reachedIds.has(milestone.id);
        const reachedAt = reachedDates.get(milestone.id);
        const isCurrent = currentMilestone?.id === milestone.id;

        return (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            reached={isReached ? { milestone, reached_at: reachedAt || '' } : undefined}
            isCurrent={isCurrent}
          />
        );
      })}
    </div>
  );
}
