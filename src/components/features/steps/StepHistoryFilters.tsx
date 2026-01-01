"use client";

import { Input, Button } from "@/components/ui";
import { getDateString } from "@/lib/utils";

interface StepHistoryFiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
}

export function StepHistoryFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: StepHistoryFiltersProps) {
  const today = getDateString();

  const presets = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
  ];

  const applyPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onStartDateChange(getDateString(start));
    onEndDateChange(getDateString(end));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.days}
            onClick={() => applyPreset(preset.days)}
            className="rounded-lg bg-card border border-border px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-border hover:text-text-primary active:bg-primary active:text-white transition-colors min-h-[44px]"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="From"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          max={endDate || today}
        />
        <Input
          label="To"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          min={startDate}
          max={today}
        />
      </div>

      <Button variant="ghost" size="sm" onClick={onReset}>
        Clear filters
      </Button>
    </div>
  );
}
