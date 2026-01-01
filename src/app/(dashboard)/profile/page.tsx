"use client";

import { useRouter } from "next/navigation";
import { useAuthStore, useProgressStore } from "@/stores";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { formatNumber, formatMiles, formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { reset: resetProgress } = useProgressStore();

  const handleLogout = () => {
    logout();
    resetProgress();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-border px-4 py-6">
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-sm text-text-secondary">Your account settings</p>
      </header>

      <main className="mx-auto max-w-lg space-y-6 p-4">
        {/* User Info */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                {user.display_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  {user.display_name}
                </h2>
                <p className="text-sm text-text-secondary">{user.email}</p>
                <p className="mt-1 text-xs text-text-muted">
                  Joined {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Journey Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {formatNumber(user.total_steps)}
                </p>
                <p className="text-sm text-text-secondary">Total Steps</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gold">
                  {formatMiles(user.total_miles)}
                </p>
                <p className="text-sm text-text-secondary">Total Miles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              onClick={() => router.push("/history")}
              className="flex w-full items-center justify-between rounded-lg bg-card border border-border px-4 py-4 text-left hover:bg-border active:bg-primary/20 transition-colors min-h-[56px]"
            >
              <span className="text-text-primary font-medium">Step History</span>
              <svg
                className="h-5 w-5 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => router.push("/milestones")}
              className="flex w-full items-center justify-between rounded-lg bg-card border border-border px-4 py-4 text-left hover:bg-border active:bg-primary/20 transition-colors min-h-[56px]"
            >
              <span className="text-text-primary font-medium">View Milestones</span>
              <svg
                className="h-5 w-5 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => router.push("/achievements")}
              className="flex w-full items-center justify-between rounded-lg bg-card border border-border px-4 py-4 text-left hover:bg-border active:bg-primary/20 transition-colors min-h-[56px]"
            >
              <span className="text-text-primary font-medium">View Achievements</span>
              <svg
                className="h-5 w-5 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="danger"
          className="w-full"
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </main>
    </div>
  );
}
