import { Card, CardContent } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { Achievement } from "@/types";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({
  achievement,
}: AchievementCardProps) {
  const isUnlocked = achievement.unlocked;

  return (
    <Card
      className={
        isUnlocked ? "border-gold bg-gold/10" : "opacity-50 grayscale"
      }
    >
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ${
              isUnlocked
                ? "bg-gold/20 text-gold"
                : "bg-border text-text-muted"
            }`}
          >
            {isUnlocked ? (
              <svg
                className="h-7 w-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            ) : (
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary">
              {achievement.name}
            </h3>
            <p className="text-sm text-text-secondary">
              {achievement.description}
            </p>
            {isUnlocked && achievement.unlocked_at && (
              <p className="mt-1 text-xs text-gold">
                Unlocked {formatDate(achievement.unlocked_at)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
