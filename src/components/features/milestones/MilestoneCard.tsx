import { Card, CardContent, Badge } from "@/components/ui";
import { formatMiles, formatDate } from "@/lib/utils";
import type { Milestone, MilestoneReached } from "@/types";

interface MilestoneCardProps {
  milestone: Milestone;
  reached?: MilestoneReached;
  isCurrent?: boolean;
}

export function MilestoneCard({
  milestone,
  reached,
  isCurrent,
}: MilestoneCardProps) {
  const isReached = !!reached;

  return (
    <Card
      className={
        isCurrent
          ? "border-gold bg-gold/10"
          : isReached
          ? "border-primary bg-primary/10"
          : "opacity-60"
      }
    >
      <CardContent className="py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-text-primary">
                {milestone.name}
              </h3>
              {isCurrent && <Badge variant="gold">Current</Badge>}
              {isReached && !isCurrent && (
                <Badge variant="success">Reached</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              {milestone.description}
            </p>
            <p className="mt-2 text-xs text-text-muted">
              {formatMiles(milestone.distance_from_start)} miles from the Shire
            </p>
            {reached && (
              <p className="mt-1 text-xs text-primary">
                Reached on {formatDate(reached.reached_at)}
              </p>
            )}
          </div>
          <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border">
            {isReached ? (
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
