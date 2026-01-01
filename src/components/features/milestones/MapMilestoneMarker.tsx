"use client";

import type { Milestone } from "@/types";
import type { MapCoordinate } from "./mapData";

interface MapMilestoneMarkerProps {
  milestone: Milestone;
  coord: MapCoordinate;
  isReached: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

export function MapMilestoneMarker({
  milestone,
  coord,
  isReached,
  isCurrent,
  onClick,
}: MapMilestoneMarkerProps) {
  const { x, y, labelPosition } = coord;

  // Marker sizing
  const outerRadius = isCurrent ? 14 : 10;
  const innerRadius = isCurrent ? 10 : 7;

  // Colors based on state
  const outerColor = isReached || isCurrent ? "#d4a017" : "#8b8b8b";
  const innerColor = isReached || isCurrent ? "#f4d03f" : "#b0b0b0";
  const labelColor = isReached || isCurrent ? "#5c4a32" : "#7a7a7a";

  // Label positioning
  const labelX = labelPosition === "right" ? x + outerRadius + 8 : x - outerRadius - 8;
  const textAnchor = labelPosition === "right" ? "start" : "end";

  // Pre-compute display text
  const displayName = truncateName(milestone.name, 18);
  const displayDistance = formatDistance(milestone.distance_from_start);

  return (
    <g
      className="milestone-marker cursor-pointer"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Touch target (invisible larger hit area) */}
      <circle
        cx={x}
        cy={y}
        r={22}
        fill="transparent"
        style={{ cursor: "pointer" }}
      />

      {/* Glow effect for current milestone */}
      {isCurrent && (
        <>
          <circle
            cx={x}
            cy={y}
            r={outerRadius + 8}
            fill="#d4a017"
            opacity="0.2"
            filter="url(#glow)"
          >
            <animate
              attributeName="r"
              values={`${outerRadius + 6};${outerRadius + 12};${outerRadius + 6}`}
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.1;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}

      {/* Outer ring */}
      <circle
        cx={x}
        cy={y}
        r={outerRadius}
        fill={outerColor}
        stroke="#5c4a32"
        strokeWidth={isCurrent ? 2 : 1}
      />

      {/* Inner circle */}
      <circle
        cx={x}
        cy={y}
        r={innerRadius}
        fill={innerColor}
      />

      {/* Icon based on state */}
      {isReached ? (
        // Checkmark for reached
        <path
          d={`M ${x - 4} ${y} L ${x - 1} ${y + 3} L ${x + 4} ${y - 3}`}
          stroke="#5c4a32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ) : isCurrent ? (
        // Walking figure for current
        <g transform={`translate(${x}, ${y})`}>
          <circle cx="0" cy="-3" r="2" fill="#5c4a32" />
          <line x1="0" y1="-1" x2="0" y2="4" stroke="#5c4a32" strokeWidth="1.5" />
          <line x1="-3" y1="1" x2="3" y2="1" stroke="#5c4a32" strokeWidth="1.5" />
          <line x1="0" y1="4" x2="-2" y2="7" stroke="#5c4a32" strokeWidth="1.5" />
          <line x1="0" y1="4" x2="2" y2="7" stroke="#5c4a32" strokeWidth="1.5" />
        </g>
      ) : (
        // Dot for unreached
        <circle cx={x} cy={y} r="2" fill="#666" />
      )}

      {/* Milestone name label with white outline for readability */}
      <text
        x={labelX}
        y={y + 1}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        fill={labelColor}
        fontSize="9"
        fontWeight={isCurrent ? "bold" : "normal"}
        stroke="white"
        strokeWidth="3"
        strokeLinejoin="round"
        paintOrder="stroke fill"
        className="pointer-events-none select-none"
      >
        {displayName}
      </text>

      {/* Distance label with white outline */}
      <text
        x={labelX}
        y={y + 12}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        fill="#7a6a5a"
        fontSize="7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinejoin="round"
        paintOrder="stroke fill"
        className="pointer-events-none select-none"
      >
        {displayDistance}
      </text>
    </g>
  );
}

function truncateName(name: string, maxLength: number): string {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 2) + "...";
}

function formatDistance(distance: string): string {
  const miles = parseFloat(distance);
  if (isNaN(miles)) return distance;
  return `${miles.toLocaleString()} mi`;
}
