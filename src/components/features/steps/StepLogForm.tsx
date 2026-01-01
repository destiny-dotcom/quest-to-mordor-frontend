"use client";

import { useState } from "react";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { logStepsSchema, type LogStepsFormData } from "@/schemas";
import { logSteps } from "@/lib/api";
import { useUIStore, useProgressStore } from "@/stores";
import { getDateString } from "@/lib/utils";

interface StepLogFormProps {
  onSuccess?: () => void;
}

export function StepLogForm({ onSuccess }: StepLogFormProps) {
  const addToast = useUIStore((state) => state.addToast);
  const { setProgress } = useProgressStore();

  const [stepCount, setStepCount] = useState("");
  const [recordedDate, setRecordedDate] = useState(getDateString());
  const [errors, setErrors] = useState<Partial<Record<keyof LogStepsFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      step_count: parseInt(stepCount, 10) || 0,
      recorded_date: recordedDate,
    };

    const result = logStepsSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LogStepsFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LogStepsFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await logSteps(formData);
      addToast({
        type: "success",
        message: `Added ${formData.step_count.toLocaleString()} steps to your journey!`,
      });
      setStepCount("");
      setRecordedDate(getDateString());
      setProgress(null as never);
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to log steps";
      addToast({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  const quickAddButtons = [1000, 2500, 5000, 10000];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Log Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Number of Steps"
              type="number"
              inputMode="numeric"
              placeholder="Enter steps"
              value={stepCount}
              onChange={(e) => setStepCount(e.target.value)}
              error={errors.step_count}
              min={1}
              max={200000}
            />
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickAddButtons.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setStepCount(amount.toString())}
                  className="rounded-lg bg-card border border-border px-2 py-2.5 text-sm font-medium text-text-secondary hover:bg-border hover:text-text-primary active:bg-primary active:text-white active:border-primary transition-colors min-h-[44px]"
                >
                  +{(amount / 1000).toString()}k
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Date"
            type="date"
            value={recordedDate}
            onChange={(e) => setRecordedDate(e.target.value)}
            error={errors.recorded_date}
            max={getDateString()}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Add to Journey
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
