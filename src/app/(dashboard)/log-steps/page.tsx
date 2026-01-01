"use client";

import { useRouter } from "next/navigation";
import { StepLogForm, TodaySteps } from "@/components/features/steps";

export default function LogStepsPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-border px-4 py-6">
        <h1 className="text-2xl font-bold text-text-primary">Log Steps</h1>
        <p className="text-sm text-text-secondary">
          Add your daily walking progress
        </p>
      </header>

      <main className="mx-auto max-w-lg space-y-6 p-4">
        <TodaySteps />
        <StepLogForm onSuccess={handleSuccess} />
      </main>
    </div>
  );
}
