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
    title: "Open Shortcuts App",
    action: "Get Started",
    instructions: [
      "Open the Shortcuts app on your iPhone",
      "Tap the + button in the top right corner",
      "Tap \"Add Action\" to start building",
    ],
    tip: "If you don't have Shortcuts installed, download it free from the App Store",
  },
  {
    title: "Get Yesterday's Date",
    action: "Date",
    instructions: [
      "Search for \"Date\" and add the Date action",
      "Tap the blue \"Date\" variable in the action",
      "Select \"Specified Date\"",
      "Tap the date picker, then tap \"Adjust Date\" (bottom of popover)",
      "Set to: Subtract 1 day from Current Date",
      "Tap Done - this variable now holds yesterday's date",
    ],
    config: [
      { label: "Action", value: "Date" },
      { label: "Value", value: "-1 day from Current Date" },
    ],
    tip: "This creates a variable with yesterday's date that we'll use next",
  },
  {
    title: "Find Health Samples",
    action: "Find Health Samples",
    instructions: [
      "Tap + to add another action",
      "Search for \"Find Health Samples\"",
      "Tap \"Type\" and select \"Steps\"",
      "Tap \"Add Filter\" (or tap the filter area)",
      "Select \"Start Date\"",
      "Change the condition to \"is on\"",
      "Tap the date value and select \"Adjusted Date\" variable from above",
    ],
    config: [
      { label: "Type", value: "Steps" },
      { label: "Filter", value: "Start Date is on [Adjusted Date]" },
    ],
    tip: "This finds all step samples recorded on yesterday's date",
  },
  {
    title: "Calculate Total Steps",
    action: "Calculate Statistics",
    instructions: [
      "Tap + to add another action",
      "Search for \"Calculate Statistics\"",
      "It should auto-connect to Health Samples",
      "Tap the operation and select \"Sum\"",
    ],
    config: [
      { label: "Operation", value: "Sum" },
      { label: "Input", value: "Health Samples" },
    ],
  },
  {
    title: "Format the Date",
    action: "Format Date",
    instructions: [
      "Tap + to add another action",
      "Search for \"Format Date\"",
      "Tap the date input and select \"Adjusted Date\" (from step 2)",
      "Tap \"Date Format\" and select \"Custom\"",
      "Enter exactly: yyyy-MM-dd",
    ],
    config: [
      { label: "Input", value: "Adjusted Date (from step 2)" },
      { label: "Format", value: "yyyy-MM-dd" },
    ],
    tip: "The format must be exact - lowercase yyyy-MM-dd with dashes",
  },
  {
    title: "Build Step Data",
    action: "Dictionary",
    instructions: [
      "Tap + and search for \"Dictionary\"",
      "Tap \"Add new item\"",
      "Key: step_count",
      "Value: tap and select \"Statistics\" (the sum from step 4)",
      "Tap \"Add new item\" again",
      "Key: recorded_date",
      "Value: tap and select \"Formatted Date\" (from step 5)",
    ],
    config: [
      { label: "Key 1", value: "step_count → Statistics" },
      { label: "Key 2", value: "recorded_date → Formatted Date" },
    ],
  },
  {
    title: "Wrap in Step Object",
    action: "Set Dictionary Value",
    instructions: [
      "Tap + and search for \"Set Dictionary Value\"",
      "Tap \"Key\" and type: step",
      "Tap \"Value\" and select the Dictionary from step 6",
      "Leave \"in\" as \"New Dictionary\"",
    ],
    config: [
      { label: "Key", value: "step" },
      { label: "Value", value: "Dictionary (from step 6)" },
    ],
    tip: "This creates the JSON format: { \"step\": { step_count, recorded_date } }",
  },
  {
    title: "Send to Server",
    action: "Get Contents of URL",
    instructions: [
      "Tap + and search for \"Get Contents of URL\"",
      "Paste the webhook URL (copy from below)",
      "Tap \"Show More\"",
      "Change Method to \"POST\"",
      "Tap \"Add new header\":",
      "  Key: X-Apple-Health-API-Key",
      "  Value: Paste your API key (copy from below)",
      "Tap \"Add new header\" again:",
      "  Key: Content-Type",
      "  Value: application/json",
      "Change \"Request Body\" to \"JSON\"",
      "Tap the body and select \"Dictionary\" from step 7",
    ],
    tip: "Make sure to copy both the URL and API key exactly!",
  },
  {
    title: "Add Notification",
    action: "Show Notification",
    instructions: [
      "Tap + and search for \"Show Notification\"",
      "Title: Steps Synced!",
      "Body: Tap and select \"Statistics\" to show step count",
    ],
    config: [
      { label: "Title", value: "Steps Synced!" },
      { label: "Body", value: "[Statistics] steps synced" },
    ],
  },
  {
    title: "Save & Test",
    action: "Finish Setup",
    instructions: [
      "Tap the shortcut name at the top (it says \"New Shortcut\")",
      "Rename to: Sync Steps to Mordor",
      "Tap Done to save",
      "Tap the Play button to test it!",
      "Grant Health access when prompted",
    ],
    tip: "If it works, you'll see a notification with your step count!",
  },
  {
    title: "Set Up Automation",
    action: "Daily Automation",
    instructions: [
      "Go to the Automation tab (bottom of screen)",
      "Tap + to create new automation",
      "Select \"Time of Day\"",
      "Set your preferred time (e.g., 8:00 AM)",
      "Select \"Daily\"",
      "Tap Next",
      "Tap \"New Blank Automation\"",
      "Search and add \"Run Shortcut\"",
      "Select \"Sync Steps to Mordor\"",
      "Tap Done",
      "IMPORTANT: Turn OFF \"Ask Before Running\"",
    ],
    tip: "Your steps will now sync automatically every morning!",
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

        {/* Show API key and webhook URL for "Send to Server" step */}
        {currentStep === 7 && (
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
