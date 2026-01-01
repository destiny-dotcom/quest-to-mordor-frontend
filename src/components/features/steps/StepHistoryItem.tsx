import { Badge } from "@/components/ui";
import { formatNumber, formatMiles, formatDateShort } from "@/lib/utils";
import type { Step } from "@/types";

interface StepHistoryItemProps {
  step: Step;
}

export function StepHistoryItem({ step }: StepHistoryItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <div>
        <p className="font-medium text-text-primary">
          {formatNumber(step.step_count)} steps
        </p>
        <p className="text-sm text-text-secondary">
          {formatDateShort(step.recorded_date)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-text-secondary">
          {formatMiles(step.miles)} mi
        </p>
        <Badge variant="muted" size="sm">
          {step.source}
        </Badge>
      </div>
    </div>
  );
}
