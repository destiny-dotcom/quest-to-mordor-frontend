"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { StepHistory, StepHistoryFilters } from "@/components/features/steps";

export default function HistoryPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-border px-4 py-6">
        <h1 className="text-2xl font-bold text-text-primary">Step History</h1>
        <p className="text-sm text-text-secondary">
          View your walking journey over time
        </p>
      </header>

      <main className="mx-auto max-w-lg space-y-6 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Filter by Date</CardTitle>
          </CardHeader>
          <CardContent>
            <StepHistoryFilters
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onReset={handleReset}
            />
          </CardContent>
        </Card>

        <StepHistory
          startDate={startDate || undefined}
          endDate={endDate || undefined}
        />
      </main>
    </div>
  );
}
