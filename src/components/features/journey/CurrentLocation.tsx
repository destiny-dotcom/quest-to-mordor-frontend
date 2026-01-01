import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { formatMiles } from "@/lib/utils";
import type { Milestone } from "@/types";

interface CurrentLocationProps {
  milestone: Milestone | null;
  milesSinceLast: number;
  nextMilestone: Milestone | null;
  milesToNext: number;
}

export function CurrentLocation({
  milestone,
  milesSinceLast,
  nextMilestone,
  milesToNext,
}: CurrentLocationProps) {
  return (
    <Card variant="parchment">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Current Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {milestone ? (
          <div>
            <h3 className="text-xl font-bold text-gold">{milestone.name}</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {milestone.description}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="gold">
                +{formatMiles(milesSinceLast)} miles since arrival
              </Badge>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-gold">The Shire</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Your journey begins here, in the peaceful hills of Hobbiton.
            </p>
          </div>
        )}

        {nextMilestone && (
          <div className="mt-4 border-t border-parchment-dark/30 pt-4">
            <p className="text-sm text-text-muted">Next destination:</p>
            <p className="font-semibold text-text-primary">
              {nextMilestone.name}
            </p>
            <p className="text-sm text-gold">
              {formatMiles(milesToNext)} miles to go
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
