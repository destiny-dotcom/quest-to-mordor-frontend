"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import type { Milestone, MilestoneReached } from "@/types";

interface MilestonePopupProps {
  milestone: Milestone;
  reached?: MilestoneReached;
  isCurrent: boolean;
  onClose: () => void;
}

export function MilestonePopup({
  milestone,
  reached,
  isCurrent,
  onClose,
}: MilestonePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const statusText = reached
    ? "Reached"
    : isCurrent
    ? "Current Location"
    : "Not Yet Reached";

  const statusColor = reached
    ? "text-gold"
    : isCurrent
    ? "text-primary"
    : "text-text-secondary";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const distance = parseFloat(milestone.distance_from_start);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-200 ${
          isVisible ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl transform transition-transform duration-200 ease-out ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "70vh" }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-8 overflow-y-auto" style={{ maxHeight: "calc(70vh - 40px)" }}>
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                reached
                  ? "bg-gold/20 text-gold"
                  : isCurrent
                  ? "bg-primary/20 text-primary"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {reached && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {isCurrent && !reached && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {statusText}
            </span>
          </div>

          {/* Milestone name */}
          <h2 className="text-2xl font-bold text-text-primary mb-2">{milestone.name}</h2>

          {/* Distance */}
          <p className="text-sm text-text-secondary mb-4">
            {!isNaN(distance)
              ? `${distance.toLocaleString()} miles from Bag End`
              : milestone.distance_from_start}
          </p>

          {/* Description */}
          <p className="text-text-secondary mb-4 leading-relaxed">{milestone.description}</p>

          {/* Quote if available */}
          {milestone.quote && (
            <blockquote className="border-l-4 border-gold pl-4 py-2 mb-4 italic text-text-secondary">
              &ldquo;{milestone.quote}&rdquo;
            </blockquote>
          )}

          {/* Reached date */}
          {reached && reached.reached_at && (
            <div className="flex items-center gap-2 py-3 px-4 bg-gold/10 rounded-lg mb-4">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-text-primary">
                Reached on {formatDate(reached.reached_at)}
              </span>
            </div>
          )}

          {/* Close button */}
          <Button onClick={handleClose} variant="secondary" className="w-full mt-2">
            Close
          </Button>
        </div>
      </div>
    </>
  );
}
