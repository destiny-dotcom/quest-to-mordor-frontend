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
    title: "Add Find Health Samples",
    action: "Find Health Samples",
    instructions: [
      "Search for \"Find Health Samples\"",
      "Tap to add it to your shortcut",
      "Tap \"Type\" and select \"Steps\"",
      "Tap \"Start Date\" → Adjust Date → \"Start of Yesterday\"",
      "Tap \"End Date\" → Adjust Date → \"End of Yesterday\"",
    ],
    config: [
      { label: "Type", value: "Steps" },
      { label: "Start Date", value: "Start of Yesterday" },
      { label: "End Date", value: "End of Yesterday" },
    ],
  },
  {
    title: "Add Calculate Statistics",
    action: "Calculate Statistics",
    instructions: [
      "Tap the + button to add another action",
      "Search for \"Calculate Statistics\"",
      "Set Operation to \"Sum\"",
      "Input should automatically be \"Health Samples\"",
    ],
    config: [
      { label: "Operation", value: "Sum" },
      { label: "Input", value: "Health Samples" },
    ],
  },
  {
    title: "Add Date Actions",
    action: "Date & Format",
    instructions: [
      "Add a \"Date\" action",
      "Set it to \"1 day ago\" (this gets yesterday)",
      "Add a \"Format Date\" action",
      "Tap \"Date Format\" → Custom",
      "Enter exactly: yyyy-MM-dd",
    ],
    config: [
      { label: "Date", value: "1 day ago" },
      { label: "Format", value: "yyyy-MM-dd" },
    ],
    tip: "The format must be exact - lowercase yyyy-MM-dd",
  },
  {
    title: "Add Dictionary",
    action: "Dictionary",
    instructions: [
      "Add a \"Dictionary\" action",
      "Tap \"Add new item\"",
      "Set Key to: step_count",
      "Set Value to: select \"Statistics\" from variables",
      "Add another item",
      "Set Key to: recorded_date",
      "Set Value to: select \"Formatted Date\" from variables",
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
      "Add \"Set Dictionary Value\" action",
      "Tap \"Key\" and type: step",
      "Tap \"Value\" and select the Dictionary from above",
      "This creates: { \"step\": { step_count, recorded_date } }",
    ],
    config: [
      { label: "Key", value: "step" },
      { label: "Value", value: "Dictionary (from step 5)" },
    ],
  },
  {
    title: "Add Web Request",
    action: "Get Contents of URL",
    instructions: [
      "Add \"Get Contents of URL\" action",
      "Paste the webhook URL (shown below)",
      "Tap \"Method\" → POST",
      "Tap \"Headers\" → Add new header",
      "Key: X-Apple-Health-API-Key",
      "Value: Paste your API key (shown below)",
      "Add another header:",
      "Key: Content-Type",
      "Value: application/json",
      "Tap \"Request Body\" → JSON",
      "Select the Dictionary from step 6",
    ],
    tip: "Double-check your API key is pasted correctly!",
  },
  {
    title: "Add Notification",
    action: "Show Notification",
    instructions: [
      "Add \"Show Notification\" action",
      "Set Title to: Steps Synced!",
      "Set Body to: Synced to Quest to Mordor",
    ],
    config: [
      { label: "Title", value: "Steps Synced!" },
      { label: "Body", value: "Synced to Quest to Mordor" },
    ],
  },
  {
    title: "Name & Save",
    action: "Finish Setup",
    instructions: [
      "Tap the shortcut name at the top",
      "Rename to: Sync Steps to Mordor",
      "Tap \"Done\" to save",
      "Run the shortcut once to test it!",
    ],
    tip: "Grant Health access when prompted on first run",
  },
  {
    title: "Set Up Automation",
    action: "Daily Automation",
    instructions: [
      "Go to the Automation tab in Shortcuts",
      "Tap + to create new automation",
      "Select \"Time of Day\"",
      "Set time (e.g., 7:00 AM)",
      "Select \"Daily\"",
      "Tap Next → Run Shortcut",
      "Select \"Sync Steps to Mordor\"",
      "Turn OFF \"Ask Before Running\"",
      "Tap Done",
    ],
    tip: "Your steps will now sync automatically every day!",
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

        {/* Show API key and webhook URL for step 7 */}
        {currentStep === 6 && (
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
