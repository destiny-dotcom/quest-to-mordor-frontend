"use client";

import { useEffect, useCallback } from "react";
import { useProgressStore } from "@/stores";
import { getProgress, getMilestones, getAchievements } from "@/lib/api";

export function useProgress() {
  const {
    progress,
    milestones,
    achievements,
    isLoading,
    error,
    setProgress,
    setMilestones,
    setAchievements,
    setLoading,
    setError,
  } = useProgressStore();

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const [progressData, milestonesData, achievementsData] = await Promise.all([
        getProgress(),
        getMilestones(),
        getAchievements(),
      ]);
      setProgress(progressData);
      setMilestones(milestonesData);
      setAchievements(achievementsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch progress");
    } finally {
      setLoading(false);
    }
  }, [setProgress, setMilestones, setAchievements, setLoading, setError]);

  const refresh = useCallback(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    if (!progress) {
      fetchProgress();
    }
  }, [progress, fetchProgress]);

  return {
    progress,
    milestones,
    achievements,
    isLoading,
    error,
    refresh,
  };
}
