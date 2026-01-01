"use client";

import { useProgress } from "@/hooks";
import { ProgressBar } from "@/components/ui";
import { AchievementGrid } from "@/components/features/achievements";

export default function AchievementsPage() {
  const { achievements } = useProgress();

  const unlockedCount = achievements?.unlocked_count || 0;
  const totalCount = achievements?.total_count || 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-border px-4 py-6">
        <h1 className="text-2xl font-bold text-text-primary">Achievements</h1>
        <p className="text-sm text-text-secondary">
          Earn badges on your quest
        </p>
        {totalCount > 0 && (
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-text-secondary">Unlocked</span>
              <span className="text-gold">
                {unlockedCount} / {totalCount}
              </span>
            </div>
            <ProgressBar
              value={unlockedCount}
              max={totalCount}
              variant="gold"
              size="md"
            />
          </div>
        )}
      </header>

      <main className="mx-auto max-w-lg p-4">
        <AchievementGrid />
      </main>
    </div>
  );
}
