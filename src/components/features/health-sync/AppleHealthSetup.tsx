"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { useUIStore } from "@/stores";
import {
  getAppleHealthStatus,
  generateAppleHealthApiKey,
  revokeAppleHealthApiKey,
} from "@/lib/api";
import type { AppleHealthSyncStatus } from "@/types";
import { formatDate } from "@/lib/utils";

// The iCloud shortcut URL - update this once the shortcut is uploaded to iCloud
// To create the shortcut, follow the guide at: docs/apple-health-shortcut-setup.md
const SHORTCUT_URL = "";

// Backend webhook URL for the shortcut
const WEBHOOK_URL = "https://quest-to-mordor-backend-production.up.railway.app/api/webhooks/apple-health";

type SetupState = "loading" | "not-setup" | "key-generated" | "enabled" | "error";

export function AppleHealthSetup() {
  const { addToast } = useUIStore();
  const [state, setState] = useState<SetupState>("loading");
  const [status, setStatus] = useState<AppleHealthSyncStatus | null>(null);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch current status on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await getAppleHealthStatus();
      setStatus(data);

      if (data.hasApiKey && data.enabled) {
        setState("enabled");
      } else if (data.hasApiKey) {
        setState("enabled"); // Has key but disabled - show as enabled state with option to re-enable
      } else {
        setState("not-setup");
      }
    } catch {
      // API might not exist yet - show not setup state
      setState("not-setup");
    }
  };

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    try {
      const response = await generateAppleHealthApiKey();
      setNewApiKey(response.apiKey);
      setState("key-generated");
      addToast({
        type: "success",
        message: "API key generated! Copy it now - it won't be shown again.",
      });
    } catch {
      addToast({
        type: "error",
        message: "Failed to generate API key. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevokeKey = async () => {
    if (!confirm("Are you sure? This will invalidate your current API key and stop syncing.")) {
      return;
    }

    setIsRevoking(true);
    try {
      await revokeAppleHealthApiKey();
      setNewApiKey(null);
      setState("not-setup");
      setStatus(null);
      addToast({
        type: "info",
        message: "API key revoked. You can generate a new one anytime.",
      });
    } catch {
      addToast({
        type: "error",
        message: "Failed to revoke API key. Please try again.",
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const handleCopyKey = async () => {
    if (!newApiKey) return;

    try {
      await navigator.clipboard.writeText(newApiKey);
      setCopied(true);
      addToast({ type: "success", message: "API key copied to clipboard!" });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      addToast({ type: "error", message: "Failed to copy. Please select and copy manually." });
    }
  };

  const handleDone = () => {
    setNewApiKey(null);
    fetchStatus();
  };

  if (state === "loading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppleHealthIcon />
            Apple Health Sync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state === "key-generated" && newApiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppleHealthIcon />
            Apple Health Sync
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-warning/10 border border-warning/30 p-3">
            <p className="text-sm font-medium text-warning">
              Copy your API key now! It won&apos;t be shown again.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Your API Key</label>
            <div className="flex gap-2">
              <code className="flex-1 rounded-lg bg-dark border border-border px-3 py-2 text-sm font-mono text-text-primary break-all">
                {newApiKey}
              </code>
              <Button
                variant={copied ? "primary" : "secondary"}
                size="sm"
                onClick={handleCopyKey}
                className="shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-semibold text-text-primary">Next Steps:</h4>
            <ol className="space-y-2 text-sm text-text-secondary">
              <li className="flex gap-2">
                <span className="font-bold text-primary">1.</span>
                <span>Copy the API key above</span>
              </li>
              {SHORTCUT_URL ? (
                <li className="flex gap-2">
                  <span className="font-bold text-primary">2.</span>
                  <a
                    href={SHORTCUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    Download the Apple Shortcut
                  </a>
                </li>
              ) : (
                <li className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <span className="font-bold text-primary">2.</span>
                    <span>Create an Apple Shortcut that POSTs to:</span>
                  </div>
                  <code className="ml-5 text-xs bg-dark rounded px-2 py-1 break-all">
                    {WEBHOOK_URL}
                  </code>
                </li>
              )}
              <li className="flex gap-2">
                <span className="font-bold text-primary">3.</span>
                <span>Add header: <code className="text-xs bg-dark rounded px-1">X-Apple-Health-API-Key</code> with your key</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">4.</span>
                <span>Set up daily automation in Shortcuts app</span>
              </li>
            </ol>
          </div>

          <Button variant="primary" className="w-full" onClick={handleDone}>
            I&apos;ve Copied My Key
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (state === "enabled" && status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppleHealthIcon />
            Apple Health Sync
            <span className="ml-auto flex items-center gap-1 text-sm font-normal text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Active
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-muted">Last Sync</p>
              <p className="font-medium text-text-primary">
                {status.lastSyncAt ? formatDate(status.lastSyncAt) : "Never"}
              </p>
            </div>
            <div>
              <p className="text-text-muted">Key Created</p>
              <p className="font-medium text-text-primary">
                {status.apiKeyCreatedAt ? formatDate(status.apiKeyCreatedAt) : "Unknown"}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {SHORTCUT_URL ? (
              <a
                href={SHORTCUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-card border border-border px-4 py-3 text-sm font-medium text-text-primary hover:bg-border transition-colors"
              >
                <ShortcutIcon />
                Open Shortcut
              </a>
            ) : (
              <div className="rounded-lg bg-card border border-border px-4 py-3">
                <p className="text-xs text-text-muted mb-1">Webhook URL:</p>
                <code className="text-xs text-text-secondary break-all">
                  {WEBHOOK_URL}
                </code>
              </div>
            )}

            <Button
              variant="ghost"
              className="w-full text-error hover:bg-error/10"
              onClick={handleRevokeKey}
              isLoading={isRevoking}
            >
              Revoke API Key
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Not setup state
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AppleHealthIcon />
          Apple Health Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-text-secondary">
          Automatically sync your daily steps from Apple Health using an Apple Shortcut.
        </p>

        <div className="space-y-2 text-sm text-text-muted">
          <div className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 text-primary shrink-0" />
            <span>Syncs yesterday&apos;s steps automatically each day</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 text-primary shrink-0" />
            <span>No app installation required</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 text-primary shrink-0" />
            <span>Works with Apple Watch step data</span>
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={handleGenerateKey}
          isLoading={isGenerating}
        >
          Set Up Apple Health Sync
        </Button>
      </CardContent>
    </Card>
  );
}

function AppleHealthIcon() {
  return (
    <svg className="h-5 w-5 text-[#FF2D55]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 2.5c-1.1 0-2.1.3-3 .9-.9-.6-1.9-.9-3-.9C7.6 2.5 5 5.1 5 8.5c0 5 6.2 10.6 7 11.2.3.2.6.3 1 .3s.7-.1 1-.3c.8-.6 7-6.2 7-11.2 0-3.4-2.6-6-5.5-6zm-.5 14.8c-.4.3-.8.5-1 .6V17c0-1.1-.9-2-2-2s-2 .9-2 2v.9c-.2-.1-.6-.3-1-.6-1.1-.9-5.5-5.1-5.5-8.8C4.5 5.4 6.9 3 10 3c.9 0 1.7.2 2.4.7.2.1.4.2.6.2s.4-.1.6-.2c.7-.5 1.5-.7 2.4-.7 3.1 0 5.5 2.4 5.5 5.5 0 3.7-4.4 7.9-5.5 8.8z"/>
    </svg>
  );
}

function ShortcutIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 8v8m-4-4h8" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}
