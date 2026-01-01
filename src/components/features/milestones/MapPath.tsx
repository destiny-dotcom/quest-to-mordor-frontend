"use client";

import { useEffect, useRef, useState } from "react";

interface MapPathProps {
  pathData: string;
  progressPercent: number;
}

export function MapPath({ pathData, progressPercent }: MapPathProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      // Trigger animation after path length is calculated
      setTimeout(() => setIsAnimating(true), 100);
    }
  }, [pathData]);

  const progressLength = (progressPercent / 100) * pathLength;
  const remainingLength = pathLength - progressLength;

  return (
    <g className="path-layer">
      {/* Shadow under the path */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(92, 74, 50, 0.15)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(2, 3)"
      />

      {/* Base path background - solid muted line */}
      <path
        d={pathData}
        fill="none"
        stroke="#b8a878"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />

      {/* Trail edge - darker outline for the traveled path */}
      <path
        ref={pathRef}
        d={pathData}
        fill="none"
        stroke="#5c4a32"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength ? `${progressLength} ${remainingLength}` : "0 10000"}
        style={{
          transition: isAnimating ? "stroke-dasharray 1.5s ease-out" : "none",
        }}
      />

      {/* Progress path - gold filled portion */}
      <path
        d={pathData}
        fill="none"
        stroke="url(#gold-path)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength ? `${progressLength} ${remainingLength}` : "0 10000"}
        style={{
          transition: isAnimating ? "stroke-dasharray 1.5s ease-out" : "none",
        }}
      />

      {/* Evenly spaced dots along the path */}
      <PathDots pathData={pathData} pathLength={pathLength} progressPercent={progressPercent} />
    </g>
  );
}

interface PathDotsProps {
  pathData: string;
  pathLength: number;
  progressPercent: number;
}

function PathDots({ pathData, pathLength, progressPercent }: PathDotsProps) {
  const [dots, setDots] = useState<Array<{ x: number; y: number; progress: number }>>([]);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current || pathLength === 0) return;

    const path = pathRef.current;
    // Fixed spacing between dots (in SVG units) for even distribution
    const dotSpacing = 50;
    const numDots = Math.floor(pathLength / dotSpacing);
    const newDots: Array<{ x: number; y: number; progress: number }> = [];

    for (let i = 0; i <= numDots; i++) {
      const distance = i * dotSpacing;
      const point = path.getPointAtLength(distance);
      const progress = (distance / pathLength) * 100;
      newDots.push({ x: point.x, y: point.y, progress });
    }

    // Add final dot at the end
    const finalPoint = path.getPointAtLength(pathLength);
    newDots.push({ x: finalPoint.x, y: finalPoint.y, progress: 100 });

    setDots(newDots);
  }, [pathData, pathLength]);

  return (
    <g className="path-dots">
      {/* Hidden path for calculations */}
      <path ref={pathRef} d={pathData} fill="none" stroke="none" />

      {/* Render dots - evenly spaced along the path */}
      {dots.map((dot, index) => {
        const isReached = dot.progress <= progressPercent;
        const isAtMilestone = index === 0 || index === dots.length - 1;

        return (
          <g key={index}>
            {/* Outer ring for reached dots */}
            {isReached && (
              <circle
                cx={dot.x}
                cy={dot.y}
                r={isAtMilestone ? 5 : 4}
                fill="none"
                stroke="#d4a017"
                strokeWidth="1"
                opacity="0.4"
              />
            )}
            {/* Main dot */}
            <circle
              cx={dot.x}
              cy={dot.y}
              r={isReached ? (isAtMilestone ? 3.5 : 2.5) : 2}
              fill={isReached ? "#d4a017" : "#9a8a6a"}
              opacity={isReached ? 0.9 : 0.45}
              style={{
                transition: "all 0.4s ease-out",
                transitionDelay: `${index * 25}ms`,
              }}
            />
          </g>
        );
      })}
    </g>
  );
}
