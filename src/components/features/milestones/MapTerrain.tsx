"use client";

// Illustrated fantasy map style with hand-drawn mountains, trees, and buildings

export function MapTerrain() {
  return (
    <g className="terrain-layer">
      <defs>
        {/* Mountain gradient for shading */}
        <linearGradient id="mountain-shade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8a8a8a" />
          <stop offset="50%" stopColor="#a0a0a0" />
          <stop offset="100%" stopColor="#707070" />
        </linearGradient>

        {/* Snow cap color */}
        <linearGradient id="snow-cap" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        {/* Tree colors */}
        <linearGradient id="tree-green" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a7a3a" />
          <stop offset="100%" stopColor="#2d5a20" />
        </linearGradient>

        <linearGradient id="tree-dark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2d5a27" />
          <stop offset="100%" stopColor="#1a4015" />
        </linearGradient>

        {/* Golden tree for Lothlorien */}
        <linearGradient id="tree-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4a84b" />
          <stop offset="100%" stopColor="#a07830" />
        </linearGradient>

        {/* Water */}
        <linearGradient id="water-blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6ba3c4" />
          <stop offset="100%" stopColor="#4a8ab0" />
        </linearGradient>

        {/* Marsh water */}
        <linearGradient id="marsh-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a8a6a" />
          <stop offset="100%" stopColor="#4a7a5a" />
        </linearGradient>

        {/* Volcanic rock */}
        <linearGradient id="volcanic-rock" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="70%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#4a4540" />
        </linearGradient>
      </defs>

      {/* The Shire - rolling green hills with scattered trees */}
      <ShireRegion />

      {/* Old Forest - dense dark trees */}
      <OldForestRegion />

      {/* Bree area - small town */}
      <BreeRegion />

      {/* Weathertop - rocky hill */}
      <WeathertopRegion />

      {/* Rivendell - valley with waterfalls */}
      <RivendellRegion />

      {/* Misty Mountains - major mountain range */}
      <MistyMountainsRegion />

      {/* Moria - dark mountain */}
      <MoriaRegion />

      {/* Lothlorien - golden trees */}
      <LothlorienRegion />

      {/* River Anduin */}
      <AnduinRiver />

      {/* Dead Marshes */}
      <DeadMarshesRegion />

      {/* Mordor */}
      <MordorRegion />

      {/* Region labels */}
      <RegionLabels />
    </g>
  );
}

// Reusable illustrated tree component
function Tree({ x, y, scale = 1, variant = "green" }: { x: number; y: number; scale?: number; variant?: "green" | "dark" | "gold" }) {
  const fill = variant === "gold" ? "url(#tree-gold)" : variant === "dark" ? "url(#tree-dark)" : "url(#tree-green)";
  const trunkColor = variant === "gold" ? "#6a5030" : "#5a4030";

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Trunk */}
      <rect x="-1.5" y="0" width="3" height="5" fill={trunkColor} />
      {/* Foliage - layered triangles */}
      <path d="M 0 -12 L -6 0 L 6 0 Z" fill={fill} />
      <path d="M 0 -8 L -5 -1 L 5 -1 Z" fill={fill} />
      <path d="M 0 -4 L -4 2 L 4 2 Z" fill={fill} />
    </g>
  );
}

// Reusable illustrated mountain peak
function MountainPeak({ x, y, width = 40, height = 50, hasSnow = true }: { x: number; y: number; width?: number; height?: number; hasSnow?: boolean }) {
  const halfW = width / 2;
  const snowHeight = height * 0.3;

  return (
    <g>
      {/* Mountain body */}
      <path
        d={`M ${x} ${y} L ${x - halfW} ${y + height} L ${x + halfW} ${y + height} Z`}
        fill="url(#mountain-shade)"
        stroke="#606060"
        strokeWidth="0.5"
      />
      {/* Left shadow */}
      <path
        d={`M ${x} ${y} L ${x - halfW * 0.3} ${y + height * 0.5} L ${x - halfW} ${y + height} Z`}
        fill="#707070"
        opacity="0.5"
      />
      {/* Snow cap */}
      {hasSnow && (
        <path
          d={`M ${x} ${y} L ${x - halfW * 0.35} ${y + snowHeight} L ${x + halfW * 0.35} ${y + snowHeight} Z`}
          fill="url(#snow-cap)"
        />
      )}
    </g>
  );
}

// Small hill shape
function Hill({ x, y, width = 30, height = 12 }: { x: number; y: number; width?: number; height?: number }) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={width / 2}
      ry={height}
      fill="#9ab87a"
      opacity="0.4"
    />
  );
}

// Small building/castle icon
function Castle({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Main building */}
      <rect x="-8" y="-6" width="16" height="10" fill="#8a7a6a" stroke="#5a4a3a" strokeWidth="0.5" />
      {/* Tower left */}
      <rect x="-10" y="-12" width="5" height="16" fill="#7a6a5a" stroke="#5a4a3a" strokeWidth="0.5" />
      {/* Tower right */}
      <rect x="5" y="-12" width="5" height="16" fill="#7a6a5a" stroke="#5a4a3a" strokeWidth="0.5" />
      {/* Tower tops */}
      <path d="M -10 -12 L -7.5 -16 L -5 -12 Z" fill="#5a4a3a" />
      <path d="M 5 -12 L 7.5 -16 L 10 -12 Z" fill="#5a4a3a" />
      {/* Center spire */}
      <path d="M -2 -6 L 0 -14 L 2 -6 Z" fill="#6a5a4a" />
    </g>
  );
}

// Simple house/village icon
function Village({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* House 1 */}
      <rect x="-6" y="-2" width="5" height="4" fill="#9a8a7a" stroke="#5a4a3a" strokeWidth="0.3" />
      <path d="M -6 -2 L -3.5 -5 L -1 -2 Z" fill="#7a5a4a" />
      {/* House 2 */}
      <rect x="1" y="-1" width="4" height="3" fill="#8a7a6a" stroke="#5a4a3a" strokeWidth="0.3" />
      <path d="M 1 -1 L 3 -4 L 5 -1 Z" fill="#6a4a3a" />
    </g>
  );
}

function ShireRegion() {
  return (
    <g className="shire">
      {/* Rolling hills */}
      <Hill x={80} y={120} width={60} height={15} />
      <Hill x={200} y={100} width={50} height={12} />
      <Hill x={300} y={130} width={55} height={14} />
      <Hill x={140} y={170} width={70} height={16} />
      <Hill x={260} y={180} width={45} height={11} />

      {/* Scattered trees */}
      <Tree x={50} y={135} scale={0.7} />
      <Tree x={65} y={125} scale={0.6} />
      <Tree x={310} y={145} scale={0.7} />
      <Tree x={325} y={155} scale={0.6} />
      <Tree x={100} y={190} scale={0.65} />
      <Tree x={115} y={185} scale={0.55} />
      <Tree x={230} y={110} scale={0.6} />
    </g>
  );
}

function OldForestRegion() {
  // Dense cluster of dark trees
  const treePositions = [
    { x: 80, y: 310 }, { x: 95, y: 320 }, { x: 110, y: 305 }, { x: 125, y: 318 },
    { x: 140, y: 308 }, { x: 155, y: 322 }, { x: 170, y: 312 }, { x: 185, y: 325 },
    { x: 200, y: 315 }, { x: 215, y: 305 }, { x: 90, y: 340 }, { x: 105, y: 350 },
    { x: 120, y: 345 }, { x: 135, y: 355 }, { x: 150, y: 342 }, { x: 165, y: 358 },
    { x: 180, y: 348 }, { x: 195, y: 360 }, { x: 210, y: 352 }, { x: 100, y: 370 },
    { x: 115, y: 378 }, { x: 130, y: 368 }, { x: 145, y: 380 }, { x: 160, y: 372 },
    { x: 175, y: 382 }, { x: 190, y: 375 }, { x: 70, y: 330 }, { x: 220, y: 340 },
  ];

  return (
    <g className="old-forest">
      {treePositions.map((pos, i) => (
        <Tree key={i} x={pos.x} y={pos.y} scale={0.8 + Math.random() * 0.3} variant="dark" />
      ))}
    </g>
  );
}

function BreeRegion() {
  return (
    <g className="bree">
      {/* Small village */}
      <Village x={230} y={450} scale={1.2} />
      {/* Few trees nearby */}
      <Tree x={260} y={445} scale={0.6} />
      <Tree x={270} y={455} scale={0.55} />
      <Tree x={200} y={460} scale={0.5} />
    </g>
  );
}

function WeathertopRegion() {
  return (
    <g className="weathertop">
      {/* Rocky hill represented as small mountain without snow */}
      <MountainPeak x={180} y={490} width={50} height={40} hasSnow={false} />
      {/* Ruined tower on top */}
      <rect x={176} y={488} width={8} height={12} fill="#6a6a6a" stroke="#4a4a4a" strokeWidth="0.5" />
      <path d="M 174 488 L 180 482 L 186 488 Z" fill="#5a5a5a" />
    </g>
  );
}

function RivendellRegion() {
  return (
    <g className="rivendell">
      {/* Valley trees */}
      <Tree x={240} y={640} scale={0.7} />
      <Tree x={255} y={650} scale={0.8} />
      <Tree x={270} y={638} scale={0.65} />
      <Tree x={285} y={655} scale={0.75} />
      <Tree x={230} y={660} scale={0.6} />
      <Tree x={295} y={645} scale={0.7} />

      {/* Elven buildings */}
      <Castle x={260} y={670} scale={0.8} />

      {/* Waterfall lines */}
      <path d="M 300 620 Q 295 650 300 680" stroke="url(#water-blue)" strokeWidth="3" fill="none" strokeDasharray="6 3" />
      <path d="M 305 625 Q 300 655 305 685" stroke="url(#water-blue)" strokeWidth="2" fill="none" strokeDasharray="4 2" opacity="0.6" />
    </g>
  );
}

function MistyMountainsRegion() {
  return (
    <g className="misty-mountains">
      {/* Row of mountain peaks */}
      <MountainPeak x={50} y={700} width={45} height={55} />
      <MountainPeak x={95} y={680} width={50} height={70} />
      <MountainPeak x={145} y={690} width={55} height={65} />
      <MountainPeak x={195} y={670} width={60} height={80} />
      <MountainPeak x={250} y={685} width={55} height={70} />
      <MountainPeak x={300} y={695} width={50} height={60} />
      <MountainPeak x={345} y={710} width={40} height={45} />

      {/* Background peaks */}
      <MountainPeak x={70} y={720} width={35} height={40} />
      <MountainPeak x={120} y={715} width={40} height={45} />
      <MountainPeak x={170} y={710} width={45} height={50} />
      <MountainPeak x={220} y={705} width={50} height={55} />
      <MountainPeak x={275} y={715} width={45} height={48} />
      <MountainPeak x={325} y={725} width={35} height={38} />

      {/* Small trees at base */}
      <Tree x={30} y={780} scale={0.5} />
      <Tree x={45} y={785} scale={0.45} />
      <Tree x={340} y={778} scale={0.5} />
      <Tree x={355} y={785} scale={0.45} />
    </g>
  );
}

function MoriaRegion() {
  return (
    <g className="moria">
      {/* Dark mountain with gate entrance */}
      <MountainPeak x={150} y={880} width={70} height={80} hasSnow={false} />

      {/* Darker overlay for ominous look */}
      <path
        d="M 150 880 L 115 960 L 185 960 Z"
        fill="#2a2a2a"
        opacity="0.4"
      />

      {/* Gate entrance */}
      <ellipse cx={150} cy={940} rx={10} ry={8} fill="#1a1a1a" />
      <path d="M 140 940 Q 150 930 160 940" stroke="#3a3a3a" strokeWidth="1" fill="none" />
    </g>
  );
}

function LothlorienRegion() {
  // Golden/silver trees of Lothlorien
  const treePositions = [
    { x: 100, y: 1080 }, { x: 115, y: 1090 }, { x: 130, y: 1075 }, { x: 145, y: 1088 },
    { x: 160, y: 1078 }, { x: 175, y: 1095 }, { x: 190, y: 1082 }, { x: 205, y: 1098 },
    { x: 220, y: 1085 }, { x: 110, y: 1110 }, { x: 125, y: 1120 }, { x: 140, y: 1108 },
    { x: 155, y: 1122 }, { x: 170, y: 1112 }, { x: 185, y: 1125 }, { x: 200, y: 1115 },
    { x: 130, y: 1140 }, { x: 145, y: 1148 }, { x: 160, y: 1138 }, { x: 175, y: 1150 },
  ];

  return (
    <g className="lothlorien">
      {/* Subtle golden glow */}
      <ellipse cx={160} cy={1110} rx={80} ry={55} fill="#d4a84b" opacity="0.1" />

      {treePositions.map((pos, i) => (
        <Tree key={i} x={pos.x} y={pos.y} scale={0.9 + Math.random() * 0.2} variant="gold" />
      ))}
    </g>
  );
}

function AnduinRiver() {
  return (
    <g className="anduin">
      {/* Main river path */}
      <path
        d="M 310 1050 Q 285 1150 275 1250 Q 260 1350 245 1450 Q 235 1500 230 1540"
        stroke="url(#water-blue)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      {/* Highlight */}
      <path
        d="M 310 1050 Q 285 1150 275 1250 Q 260 1350 245 1450 Q 235 1500 230 1540"
        stroke="#8ac0e0"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Amon Hen - wooded hill by river */}
      <Hill x={240} y={1230} width={40} height={15} />
      <Tree x={230} y={1220} scale={0.6} />
      <Tree x={245} y={1215} scale={0.7} />
      <Tree x={255} y={1225} scale={0.55} />
    </g>
  );
}

function DeadMarshesRegion() {
  return (
    <g className="dead-marshes">
      {/* Murky water pools */}
      <ellipse cx={130} cy={1440} rx={25} ry={12} fill="url(#marsh-water)" opacity="0.6" />
      <ellipse cx={190} cy={1455} rx={30} ry={14} fill="url(#marsh-water)" opacity="0.5" />
      <ellipse cx={150} cy={1475} rx={22} ry={10} fill="url(#marsh-water)" opacity="0.55" />
      <ellipse cx={220} cy={1445} rx={20} ry={9} fill="url(#marsh-water)" opacity="0.5" />
      <ellipse cx={100} cy={1460} rx={18} ry={8} fill="url(#marsh-water)" opacity="0.45" />

      {/* Dead/sparse vegetation - small stumps */}
      <rect x={115} y={1448} width={2} height={5} fill="#4a4a3a" />
      <rect x={175} y={1438} width={2} height={4} fill="#4a4a3a" />
      <rect x={205} y={1468} width={2} height={5} fill="#4a4a3a" />
      <rect x={140} y={1458} width={2} height={4} fill="#4a4a3a" />

      {/* Mist effect */}
      <ellipse cx={160} cy={1455} rx={70} ry={30} fill="#8a9a8a" opacity="0.15" />
    </g>
  );
}

function MordorRegion() {
  return (
    <g className="mordor">
      {/* Dark volcanic terrain base */}
      <rect x={20} y={1540} width={335} height={450} fill="#3a3530" opacity="0.6" />

      {/* Mountain walls - Ephel Duath */}
      <MountainPeak x={40} y={1550} width={35} height={45} hasSnow={false} />
      <MountainPeak x={80} y={1540} width={40} height={55} hasSnow={false} />
      <MountainPeak x={125} y={1545} width={45} height={50} hasSnow={false} />
      <MountainPeak x={250} y={1545} width={45} height={50} hasSnow={false} />
      <MountainPeak x={295} y={1540} width={40} height={55} hasSnow={false} />
      <MountainPeak x={340} y={1550} width={35} height={45} hasSnow={false} />

      {/* Black Gate */}
      <rect x={155} y={1555} width={60} height={20} fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="1" />
      <rect x={150} y={1545} width={10} height={35} fill="#3a3a3a" />
      <rect x={210} y={1545} width={10} height={35} fill="#3a3a3a" />
      <path d="M 150 1545 L 155 1535 L 160 1545 Z" fill="#2a2a2a" />
      <path d="M 210 1545 L 215 1535 L 220 1545 Z" fill="#2a2a2a" />

      {/* Minas Morgul - evil tower */}
      <g transform="translate(190, 1700)">
        <rect x="-8" y="-15" width="16" height="20" fill="#4a4a5a" stroke="#3a3a4a" strokeWidth="0.5" />
        <path d="M -10 -15 L 0 -30 L 10 -15 Z" fill="#5a5a6a" />
        {/* Eerie glow */}
        <ellipse cx="0" cy="-5" rx="15" ry="12" fill="#7a7aa0" opacity="0.2" />
      </g>

      {/* Mount Doom */}
      <MountDoom />
    </g>
  );
}

function MountDoom() {
  return (
    <g className="mount-doom">
      {/* Volcanic mountain */}
      <path
        d="M 187 1840 L 130 1970 L 244 1970 Z"
        fill="url(#volcanic-rock)"
        stroke="#2a2520"
        strokeWidth="1"
      />

      {/* Darker left face */}
      <path
        d="M 187 1840 L 155 1920 L 130 1970 Z"
        fill="#252520"
        opacity="0.5"
      />

      {/* Crater with lava glow */}
      <ellipse cx={187} cy={1850} rx={15} ry={8} fill="#1a1a1a" />
      <ellipse cx={187} cy={1848} rx={10} ry={5} fill="#8a2010" />
      <ellipse cx={187} cy={1846} rx={6} ry={3} fill="#c03020" />
      <ellipse cx={187} cy={1845} rx={3} ry={1.5} fill="#e05030" />

      {/* Smoke plume */}
      <ellipse cx={187} cy={1825} rx={20} ry={12} fill="#4a4a4a" opacity="0.4" />
      <ellipse cx={190} cy={1810} rx={15} ry={10} fill="#5a5a5a" opacity="0.3" />
      <ellipse cx={192} cy={1798} rx={10} ry={8} fill="#6a6a6a" opacity="0.2" />

      {/* Lava streams on slope */}
      <path d="M 180 1870 Q 172 1920 168 1970" stroke="#a03020" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M 195 1875 Q 205 1925 210 1970" stroke="#902818" strokeWidth="1.5" fill="none" opacity="0.5" />
    </g>
  );
}

function RegionLabels() {
  const labels = [
    { text: "The Shire", x: 30, y: 90, size: 11 },
    { text: "Old Forest", x: 30, y: 295, size: 10 },
    { text: "Bree", x: 250, y: 430, size: 9 },
    { text: "Weathertop", x: 95, y: 560, size: 9 },
    { text: "Rivendell", x: 295, y: 620, size: 10 },
    { text: "Misty Mountains", x: 20, y: 810, size: 10 },
    { text: "Moria", x: 50, y: 930, size: 10 },
    { text: "Lothlórien", x: 60, y: 1065, size: 10 },
    { text: "R. Anduin", x: 285, y: 1280, size: 9 },
    { text: "Dead Marshes", x: 50, y: 1420, size: 10 },
    { text: "Mordor", x: 40, y: 1620, size: 12 },
    { text: "Mt. Doom", x: 130, y: 1880, size: 10 },
  ];

  return (
    <g className="region-labels">
      {labels.map((label, i) => (
        <text
          key={i}
          x={label.x}
          y={label.y}
          fill="#5a4a3a"
          fontSize={label.size}
          fontFamily="serif"
          fontStyle="italic"
          fontWeight="600"
        >
          {label.text}
        </text>
      ))}
    </g>
  );
}
