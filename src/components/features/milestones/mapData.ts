// Map coordinate data for the journey from the Shire to Mount Doom
// SVG viewBox is 375 x 2000 (mobile-optimized)

export interface MapCoordinate {
  id: string;
  x: number;
  y: number;
  terrain: 'shire' | 'forest' | 'plains' | 'mountains' | 'mines' | 'elvish' | 'river' | 'marshes' | 'mordor';
  labelPosition: 'left' | 'right';
}

// Milestone coordinates mapped to SVG positions
// These align with the 18 milestones from Bag End to Mount Doom
export const milestoneCoordinates: MapCoordinate[] = [
  { id: 'bag-end', x: 120, y: 80, terrain: 'shire', labelPosition: 'right' },
  { id: 'buckland', x: 200, y: 170, terrain: 'shire', labelPosition: 'right' },
  { id: 'old-forest', x: 140, y: 280, terrain: 'forest', labelPosition: 'left' },
  { id: 'bree', x: 220, y: 380, terrain: 'plains', labelPosition: 'right' },
  { id: 'weathertop', x: 160, y: 500, terrain: 'plains', labelPosition: 'left' },
  { id: 'rivendell', x: 140, y: 620, terrain: 'elvish', labelPosition: 'right' },
  { id: 'misty-mountains', x: 187, y: 760, terrain: 'mountains', labelPosition: 'right' },
  { id: 'moria-west', x: 140, y: 880, terrain: 'mines', labelPosition: 'left' },
  { id: 'moria-east', x: 220, y: 980, terrain: 'mines', labelPosition: 'right' },
  { id: 'lothlorien', x: 160, y: 1100, terrain: 'elvish', labelPosition: 'left' },
  { id: 'amon-hen', x: 240, y: 1220, terrain: 'river', labelPosition: 'right' },
  { id: 'emyn-muil', x: 180, y: 1340, terrain: 'plains', labelPosition: 'left' },
  { id: 'dead-marshes', x: 220, y: 1440, terrain: 'marshes', labelPosition: 'right' },
  { id: 'black-gate', x: 160, y: 1540, terrain: 'mordor', labelPosition: 'left' },
  { id: 'ithilien', x: 240, y: 1620, terrain: 'plains', labelPosition: 'right' },
  { id: 'minas-morgul', x: 180, y: 1700, terrain: 'mordor', labelPosition: 'left' },
  { id: 'cirith-ungol', x: 220, y: 1780, terrain: 'mordor', labelPosition: 'right' },
  { id: 'plateau-gorgoroth', x: 140, y: 1850, terrain: 'mordor', labelPosition: 'left' },
  { id: 'mount-doom', x: 220, y: 1950, terrain: 'mordor', labelPosition: 'right' },
];

// Generate SVG path data for the winding road
export function generatePathData(coordinates: MapCoordinate[]): string {
  if (coordinates.length < 2) return '';

  const points = coordinates.map(c => ({ x: c.x, y: c.y }));

  // Start path
  let path = `M ${points[0].x} ${points[0].y}`;

  // Create smooth curves through all points
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    // Control points for bezier curve
    const midY = (prev.y + curr.y) / 2;
    const cp1x = prev.x;
    const cp1y = midY;
    const cp2x = curr.x;
    const cp2y = midY;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  return path;
}

// Terrain region definitions for background illustrations
export interface TerrainRegion {
  id: string;
  type: 'shire' | 'forest' | 'mountains' | 'elvish' | 'marshes' | 'mordor';
  yStart: number;
  yEnd: number;
}

export const terrainRegions: TerrainRegion[] = [
  { id: 'the-shire', type: 'shire', yStart: 0, yEnd: 320 },
  { id: 'old-forest-region', type: 'forest', yStart: 240, yEnd: 420 },
  { id: 'lone-lands', type: 'mountains', yStart: 420, yEnd: 700 },
  { id: 'misty-mountains-region', type: 'mountains', yStart: 700, yEnd: 1020 },
  { id: 'lothlorien-region', type: 'elvish', yStart: 1020, yEnd: 1260 },
  { id: 'anduin-region', type: 'forest', yStart: 1260, yEnd: 1380 },
  { id: 'dead-marshes-region', type: 'marshes', yStart: 1380, yEnd: 1560 },
  { id: 'mordor-region', type: 'mordor', yStart: 1560, yEnd: 2000 },
];
