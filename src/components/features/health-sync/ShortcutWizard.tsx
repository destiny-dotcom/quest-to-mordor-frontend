"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

interface ShortcutWizardProps {
  apiKey: string;
  webhookUrl: string;
  onComplete: () => void;
}

interface WizardStep {
  title: string;
  action: string;
  instructions: string[];
  tip?: string;
  config?: { label: string; value: string }[];
}

const WIZARD_STEPS: WizardStep[] = [
  {
    title: "Create New Shortcut",
    action: "Get Started",
    instructions: [
      "Open the Shortcuts app",
      "Tap + in the top right",
      "Tap \"Add Action\"",
    ],
  },
  {
    title: "Get Your Steps",
    action: "Find Health Samples",
    instructions: [
      "Search \"Health\" and tap \"Find Health Samples\"",
      "Tap \"Type\" → select \"Steps\"",
      "Tap \"Add Filter\"",
      "Tap \"Start Date\"",
      "Select \"is in the last\"",
      "Enter \"1\" and select \"Days\"",
    ],
    config: [
      { label: "Type", value: "Steps" },
      { label: "Filter", value: "Start Date is in the last 1 Days" },
    ],
  },
  {
    title: "Calculate Total",
    action: "Calculate Statistics",
    instructions: [
      "Tap + to add action",
      "Search \"Calculate\" and tap \"Calculate Statistics\"",
      "Make sure it says \"Sum\" and \"Health Samples\"",
    ],
    config: [
      { label: "Operation", value: "Sum" },
    ],
    tip: "This adds up all your step samples into one number",
  },
  {
    title: "Send to Quest",
    action: "Get Contents of URL",
    instructions: [
      "Tap + to add action",
      "Search \"URL\" and tap \"Get Contents of URL\"",
      "Delete the URL and paste the webhook URL below",
      "Tap the arrow (▸) to show more options",
      "Method: tap and select \"POST\"",
      "Headers: tap \"Add new header\"",
      "   Key: X-Apple-Health-API-Key",
      "   Value: paste your API key below",
      "Request Body: tap and select \"JSON\"",
      "Tap \"Add new field\"",
      "   Key: steps",
      "   Type: Number",
      "   Value: tap → select \"Statistics\" variable",
    ],
    tip: "The server automatically uses yesterday's date!",
  },
  {
    title: "Add Notification",
    action: "Show Notification",
    instructions: [
      "Tap + to add action",
      "Search \"Notification\" and tap \"Show Notification\"",
      "Tap the text and type: Steps synced!",
    ],
  },
  {
    title: "Save & Test",
    action: "Finish",
    instructions: [
      "Tap the name at the top (\"New Shortcut\")",
      "Type: Sync Steps to Mordor",
      "Tap Done",
      "Tap the shortcut to run it!",
      "Allow Health access when prompted",
    ],
    tip: "You should see \"Steps synced!\" notification",
  },
  {
    title: "Automate Daily",
    action: "Set Up Automation",
    instructions: [
      "Tap \"Automation\" at the bottom",
      "Tap + to create automation",
      "Tap \"Time of Day\"",
      "Set your wake-up time",
      "Select \"Daily\" → Next",
      "Tap \"New Blank Automation\"",
      "Search \"Run\" → tap \"Run Shortcut\"",
      "Tap \"Shortcut\" → select \"Sync Steps to Mordor\"",
      "Tap \"Done\"",
      "Turn OFF \"Ask Before Running\" toggle",
    ],
    tip: "Your steps will sync automatically every morning!",
  },
];

export function ShortcutWizard({ apiKey, webhookUrl, onComplete }: ShortcutWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const step = WIZARD_STEPS[currentStep];
  const isLastStep = currentStep === WIZARD_STEPS.length - 1;
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback - select text
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-text-muted">
          <span>Step {currentStep + 1} of {WIZARD_STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-dark">
            {currentStep + 1}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{step.title}</h3>
            <p className="text-xs text-text-muted">{step.action}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-lg bg-dark border border-border p-3 space-y-2">
          <ol className="space-y-1.5 text-sm text-text-secondary">
            {step.instructions.map((instruction, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary font-medium shrink-0">{idx + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Configuration values */}
        {step.config && (
          <div className="rounded-lg bg-card border border-border p-3 space-y-2">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Settings</p>
            {step.config.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-text-muted">{item.label}:</span>
                <code className="text-primary bg-dark px-2 py-0.5 rounded text-xs">
                  {item.value}
                </code>
              </div>
            ))}
          </div>
        )}

        {/* Show API key and webhook URL for "Send to Quest" step */}
        {currentStep === 3 && (
          <div className="space-y-2">
            <div className="rounded-lg bg-card border border-border p-3 space-y-1">
              <p className="text-xs font-medium text-text-muted">Webhook URL</p>
              <div className="flex gap-2 items-center">
                <code className="flex-1 text-xs text-text-primary break-all bg-dark rounded px-2 py-1">
                  {webhookUrl}
                </code>
                <Button
                  variant={copiedField === "url" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handleCopy(webhookUrl, "url")}
                >
                  {copiedField === "url" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-card border border-border p-3 space-y-1">
              <p className="text-xs font-medium text-text-muted">Your API Key</p>
              <div className="flex gap-2 items-center">
                <code className="flex-1 text-xs text-text-primary break-all bg-dark rounded px-2 py-1">
                  {apiKey}
                </code>
                <Button
                  variant={copiedField === "key" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handleCopy(apiKey, "key")}
                >
                  {copiedField === "key" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tip */}
        {step.tip && (
          <div className="flex gap-2 rounded-lg bg-gold/10 border border-gold/30 p-2.5 text-sm">
            <TipIcon className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <p className="text-text-secondary">{step.tip}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2 pt-2">
        {currentStep > 0 && (
          <Button variant="secondary" onClick={handleBack} className="flex-1">
            Back
          </Button>
        )}
        <Button variant="primary" onClick={handleNext} className="flex-1">
          {isLastStep ? "Complete Setup" : "Next"}
        </Button>
      </div>

      {/* Quick jump */}
      <div className="flex justify-center gap-1 pt-1">
        {WIZARD_STEPS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentStep
                ? "w-4 bg-primary"
                : idx < currentStep
                  ? "w-1.5 bg-primary/50"
                  : "w-1.5 bg-border"
            }`}
            aria-label={`Go to step ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function TipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
  );
}
