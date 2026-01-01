import { Card, CardContent, ProgressBar } from "@/components/ui";
import { formatMiles } from "@/lib/utils";

interface JourneyProgressProps {
  totalDistance: number;
  userMiles: number;
  remainingMiles: number;
}

export function JourneyProgress({
  totalDistance,
  userMiles,
  remainingMiles,
}: JourneyProgressProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-text-secondary">The Shire</span>
          <span className="text-text-secondary">Mount Doom</span>
        </div>
        <ProgressBar
          value={userMiles}
          max={totalDistance}
          size="lg"
          variant="gold"
        />
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-primary font-medium">
            {formatMiles(userMiles)} mi walked
          </span>
          <span className="text-text-muted">
            {formatMiles(remainingMiles)} mi remaining
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
