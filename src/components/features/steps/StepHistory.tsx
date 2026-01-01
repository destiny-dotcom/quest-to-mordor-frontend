"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Spinner } from "@/components/ui";
import { StepHistoryItem } from "./StepHistoryItem";
import { getStepsHistory } from "@/lib/api";
import type { Step } from "@/types";

interface StepHistoryProps {
  startDate?: string;
  endDate?: string;
}

export function StepHistory({ startDate, endDate }: StepHistoryProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const fetchSteps = useCallback(async (reset = false) => {
    setIsLoading(true);
    try {
      const currentOffset = reset ? 0 : offset;
      const data = await getStepsHistory({
        start_date: startDate,
        end_date: endDate,
        limit,
        offset: currentOffset,
      });

      if (reset) {
        setSteps(data.steps);
        setOffset(limit);
      } else {
        setSteps((prev) => [...prev, ...data.steps]);
        setOffset((prev) => prev + limit);
      }
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      console.error("Failed to fetch step history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, offset]);

  useEffect(() => {
    fetchSteps(true);
  }, [startDate, endDate]);

  const loadMore = () => {
    fetchSteps(false);
  };

  if (isLoading && steps.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner size="md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step History</CardTitle>
      </CardHeader>
      <CardContent>
        {steps.length === 0 ? (
          <p className="text-center text-text-secondary py-4">
            No steps recorded yet. Start your journey!
          </p>
        ) : (
          <>
            <div className="divide-y divide-border">
              {steps.map((step) => (
                <StepHistoryItem key={step.id} step={step} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-4">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={loadMore}
                  isLoading={isLoading}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
