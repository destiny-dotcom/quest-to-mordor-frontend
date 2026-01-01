"use client";

import { useProgress } from "@/hooks";
import { Spinner } from "@/components/ui";
import {
  ProgressRing,
  JourneyStats,
  CurrentLocation,
  JourneyProgress,
} from "@/components/features/journey";

export default function DashboardPage() {
  const { progress, isLoading, error } = useProgress();

  if (isLoading || !progress) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="text-error">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-gold hover:text-gold-hover"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const { journey, user } = progress;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-border px-4 py-6">
        <h1 className="text-2xl font-bold text-gold">Quest to Mordor</h1>
        <p className="text-sm text-text-secondary">
          Welcome, {user.display_name}
        </p>
      </header>

      <main className="mx-auto max-w-lg space-y-6 p-4">
        {/* Progress Ring */}
        <div className="flex justify-center py-4">
          <ProgressRing percentage={journey.journey_progress_percent} />
        </div>

        {/* Journey Progress Bar */}
        <JourneyProgress
          totalDistance={journey.total_journey_miles}
          userMiles={Number(user.total_miles)}
          remainingMiles={journey.miles_remaining}
        />

        {/* Current Location */}
        <CurrentLocation
          milestone={journey.current_milestone}
          milesSinceLast={journey.progress_to_next_milestone}
          nextMilestone={journey.next_milestone}
          milesToNext={journey.miles_to_next_milestone}
        />

        {/* Journey Stats */}
        <JourneyStats
          totalSteps={Number(user.total_steps)}
          totalMiles={Number(user.total_miles)}
          daysActive={journey.milestones_reached_count}
          avgDailySteps={0}
        />
      </main>
    </div>
  );
}
