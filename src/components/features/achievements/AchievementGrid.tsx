"use client";

import { useState } from "react";
import { useProgress } from "@/hooks";
import { Spinner } from "@/components/ui";
import { AchievementCard } from "./AchievementCard";

type FilterType = "all" | "unlocked" | "locked";

export function AchievementGrid() {
  const { achievements, isLoading } = useProgress();
  const [filter, setFilter] = useState<FilterType>("all");

  if (isLoading || !achievements || !achievements.achievements) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  const filteredAchievements = achievements.achievements.filter((achievement) => {
    if (filter === "unlocked") return achievement.unlocked;
    if (filter === "locked") return !achievement.unlocked;
    return true;
  });

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Unlocked", value: "unlocked" },
    { label: "Locked", value: "locked" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] active:scale-95 ${
              filter === f.value
                ? "bg-primary text-white"
                : "bg-card border border-border text-text-secondary hover:bg-border active:bg-primary/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <p className="text-center text-text-secondary py-8">
          {filter === "unlocked"
            ? "No achievements unlocked yet. Keep walking!"
            : filter === "locked"
            ? "You've unlocked all achievements!"
            : "No achievements found."}
        </p>
      )}
    </div>
  );
}
