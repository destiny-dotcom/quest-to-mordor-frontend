import { Badge } from "@/components/ui";
import { formatNumber, formatMiles, formatDateShort } from "@/lib/utils";
import type { Step } from "@/types";

interface StepHistoryItemProps {
  step: Step;
}

// Source display configuration
const sourceConfig: Record<string, { label: string; variant: "default" | "success" | "gold" | "muted" }> = {
  apple_health: { label: "Apple Health", variant: "success" },
  manual: { label: "Manual", variant: "muted" },
};

function getSourceConfig(source: string) {
  return sourceConfig[source] || { label: source, variant: "muted" as const };
}

export function StepHistoryItem({ step }: StepHistoryItemProps) {
  const { label, variant } = getSourceConfig(step.source);

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
        <Badge variant={variant} size="sm" className="gap-1">
          {step.source === "apple_health" && <AppleHealthIcon />}
          {label}
        </Badge>
      </div>
    </div>
  );
}

function AppleHealthIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 2.5c-1.1 0-2.1.3-3 .9-.9-.6-1.9-.9-3-.9C7.6 2.5 5 5.1 5 8.5c0 5 6.2 10.6 7 11.2.3.2.6.3 1 .3s.7-.1 1-.3c.8-.6 7-6.2 7-11.2 0-3.4-2.6-6-5.5-6z"/>
    </svg>
  );
}
