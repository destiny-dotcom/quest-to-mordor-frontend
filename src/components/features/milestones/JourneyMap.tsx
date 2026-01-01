"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/hooks";
import { Spinner } from "@/components/ui";
import { MapPath } from "./MapPath";
import { MapTerrain } from "./MapTerrain";
import { MapMilestoneMarker } from "./MapMilestoneMarker";
import { MilestonePopup } from "./MilestonePopup";
import { milestoneCoordinates, generatePathData } from "./mapData";
import type { Milestone, MilestoneReached } from "@/types";

const MAP_WIDTH = 375;
const MAP_HEIGHT = 2000;

export function JourneyMap() {
  const { progress, milestones, isLoading } = useProgress();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<{
    milestone: Milestone;
    reached?: MilestoneReached;
    isCurrent: boolean;
  } | null>(null);

  // Build lookup maps for milestone states
  const reachedIds = new Set<string>();
  const reachedDates = new Map<string, string>();

  if (progress && Array.isArray(progress.journey.milestones_reached)) {
    progress.journey.milestones_reached.forEach((r) => {
      const id = r.milestone?.id;
      const date = r.reached_at;
      if (id) {
        reachedIds.add(id);
        if (date) reachedDates.set(id, date);
      }
    });
  }

  const currentMilestoneId = progress?.journey.current_milestone?.id;
  const userTotalMiles = typeof progress?.user.total_miles === 'number'
    ? progress.user.total_miles
    : parseFloat(String(progress?.user.total_miles ?? 0));

  // Helper to check if a milestone is reached based on distance
  const isMilestoneReached = (milestone: Milestone): boolean => {
    // Check if explicitly in reached list
    if (reachedIds.has(milestone.id)) return true;
    // Starting point (0 miles) is always reached
    const distance = parseFloat(milestone.distance_from_start);
    if (distance === 0) return true;
    // Any milestone we've passed is reached
    if (!isNaN(distance) && distance <= userTotalMiles) return true;
    return false;
  };

  // Calculate progress percentage
  const progressPercent = progress?.journey.journey_progress_percent ?? 0;

  // Find current milestone's Y position for auto-scroll
  const currentMilestoneCoord = milestoneCoordinates.find(
    (c) => c.id === currentMilestoneId ||
    milestones?.milestones.find(m => m.id === currentMilestoneId)?.name.toLowerCase().replace(/[^a-z]/g, '-').includes(c.id.split('-')[0])
  );

  // Auto-scroll to current position on mount
  useEffect(() => {
    if (!isLoading && containerRef.current && progress) {
      // Calculate scroll position based on progress
      const scrollY = (progressPercent / 100) * (MAP_HEIGHT - 400);
      setTimeout(() => {
        containerRef.current?.scrollTo({
          top: Math.max(0, scrollY - 100),
          behavior: "smooth",
        });
      }, 500);
    }
  }, [isLoading, progress, progressPercent]);

  // Match API milestones to map coordinates
  const getMilestoneCoord = (milestone: Milestone) => {
    // Use order_index - each milestone maps to a specific coordinate
    if (milestone.order_index >= 0 && milestone.order_index < milestoneCoordinates.length) {
      return milestoneCoordinates[milestone.order_index];
    }
    return undefined;
  };

  if (isLoading || !milestones || !progress) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  const pathData = generatePathData(milestoneCoordinates);

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full overflow-auto"
        style={{ height: "calc(100vh - 180px)" }}
      >
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full"
          style={{ minHeight: MAP_HEIGHT }}
          preserveAspectRatio="xMidYMin slice"
        >
          {/* Parchment background gradient */}
          <defs>
            <linearGradient id="parchment" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8dcc4" />
              <stop offset="20%" stopColor="#d4c494" />
              <stop offset="50%" stopColor="#c9b888" />
              <stop offset="80%" stopColor="#d4c494" />
              <stop offset="100%" stopColor="#b8a878" />
            </linearGradient>

            {/* Parchment texture pattern */}
            <filter id="paper-texture">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
              <feDiffuseLighting in="noise" lightingColor="#d4c494" surfaceScale="1.5" result="light">
                <feDistantLight azimuth="45" elevation="60" />
              </feDiffuseLighting>
              <feBlend in="SourceGraphic" in2="light" mode="multiply" />
            </filter>

            {/* Gold gradient for completed path */}
            <linearGradient id="gold-path" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f4d03f" />
              <stop offset="50%" stopColor="#d4a017" />
              <stop offset="100%" stopColor="#b8860b" />
            </linearGradient>

            {/* Glow effect for current marker */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#parchment)" />

          {/* Decorative border */}
          <rect
            x="10"
            y="10"
            width={MAP_WIDTH - 20}
            height={MAP_HEIGHT - 20}
            fill="none"
            stroke="#8b7355"
            strokeWidth="2"
            rx="8"
          />
          <rect
            x="15"
            y="15"
            width={MAP_WIDTH - 30}
            height={MAP_HEIGHT - 30}
            fill="none"
            stroke="#a08060"
            strokeWidth="1"
            rx="6"
          />

          {/* Map title */}
          <text
            x={MAP_WIDTH / 2}
            y="45"
            textAnchor="middle"
            className="font-serif"
            fill="#5c4a32"
            fontSize="18"
            fontWeight="bold"
          >
            The Road to Mordor
          </text>
          <text
            x={MAP_WIDTH / 2}
            y="62"
            textAnchor="middle"
            fill="#7a6548"
            fontSize="10"
            fontStyle="italic"
          >
            A Journey of {Math.round(progress.journey.total_journey_miles)} Miles
          </text>

          {/* Terrain illustrations */}
          <MapTerrain />

          {/* Path layer */}
          <MapPath pathData={pathData} progressPercent={progressPercent} />

          {/* Milestone markers */}
          {milestones.milestones.map((milestone) => {
            const coord = getMilestoneCoord(milestone);
            if (!coord) return null;

            const isReached = isMilestoneReached(milestone);
            const isCurrent = milestone.id === currentMilestoneId;
            const reachedAt = reachedDates.get(milestone.id);

            return (
              <MapMilestoneMarker
                key={milestone.id}
                milestone={milestone}
                coord={coord}
                isReached={isReached}
                isCurrent={isCurrent}
                onClick={() => {
                  setSelectedMilestone({
                    milestone,
                    reached: isReached ? { milestone, reached_at: reachedAt || '' } : undefined,
                    isCurrent,
                  });
                }}
              />
            );
          })}

          {/* Compass rose */}
          <g transform="translate(320, 60)">
            {/* Outer decorative ring */}
            <circle cx="0" cy="0" r="22" fill="none" stroke="#8b7355" strokeWidth="1" />
            <circle cx="0" cy="0" r="20" fill="#c9b888" stroke="#5c4a32" strokeWidth="1.5" />
            {/* Inner circle */}
            <circle cx="0" cy="0" r="4" fill="#5c4a32" />
            {/* Cardinal direction lines */}
            <line x1="0" y1="-6" x2="0" y2="-15" stroke="#5c4a32" strokeWidth="2" />
            <line x1="0" y1="6" x2="0" y2="15" stroke="#7a6548" strokeWidth="1" />
            <line x1="-6" y1="0" x2="-15" y2="0" stroke="#7a6548" strokeWidth="1" />
            <line x1="6" y1="0" x2="15" y2="0" stroke="#7a6548" strokeWidth="1" />
            {/* Direction labels outside the circle */}
            <text x="0" y="-26" textAnchor="middle" fill="#5c4a32" fontSize="9" fontWeight="bold">N</text>
            <text x="0" y="32" textAnchor="middle" fill="#7a6548" fontSize="7">S</text>
            <text x="28" y="3" textAnchor="middle" fill="#7a6548" fontSize="7">E</text>
            <text x="-28" y="3" textAnchor="middle" fill="#7a6548" fontSize="7">W</text>
          </g>
        </svg>
      </div>

      {/* Milestone popup */}
      {selectedMilestone && (
        <MilestonePopup
          milestone={selectedMilestone.milestone}
          reached={selectedMilestone.reached}
          isCurrent={selectedMilestone.isCurrent}
          onClose={() => setSelectedMilestone(null)}
        />
      )}
    </>
  );
}
