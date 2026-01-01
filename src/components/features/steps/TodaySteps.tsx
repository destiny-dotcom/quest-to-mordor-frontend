"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, Spinner } from "@/components/ui";
import { getTodaySteps } from "@/lib/api";
import { formatNumber, formatMiles } from "@/lib/utils";

export function TodaySteps() {
  const [todayData, setTodayData] = useState<{
    steps: number;
    miles: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchToday() {
      try {
        const data = await getTodaySteps();
        setTodayData(data.today);
      } catch (error) {
        console.error("Failed to fetch today's steps:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchToday();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner size="sm" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/20 to-forest/20 border-primary/30">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">Today&apos;s Steps</p>
            <p className="text-3xl font-bold text-primary">
              {formatNumber(todayData?.steps || 0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">Miles</p>
            <p className="text-xl font-semibold text-text-primary">
              {formatMiles(todayData?.miles || "0")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
