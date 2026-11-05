import React from 'react';

/**
 * High-fidelity vector SVG Clay Diya (Traditional Earthen Lamp)
 * with animated warm flame and soft golden glow.
 */
export const GlowingDiya: React.FC<{
  size?: number;
  className?: string;
  withGlow?: boolean;
}> = ({ size = 64, className = '', withGlow = true }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size * 0.7 }}
    >
      {/* Ambient Radial Golden Glow */}
      {withGlow && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-[160%] h-[160%] rounded-full bg-amber-500/20 blur-xl animate-diya-glow pointer-events-none"
        />
      )}

      <svg
        viewBox="0 0 100 70"
        className="w-full h-full overflow-visible drop-shadow-[0_4px_10px_rgba(180,83,9,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Flame Gradients */}
          <radialGradient id="flameInner" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFF176" />
            <stop offset="70%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#FF6D00" />
          </radialGradient>
          <radialGradient id="flameOuter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFA000" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FF3D00" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D50000" stopOpacity="0" />
          </radialGradient>

          {/* Clay Bowl Gradients */}
          <linearGradient id="clayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C86A3E" />
            <stop offset="40%" stopColor="#9C441E" />
            <stop offset="85%" stopColor="#6C2A0E" />
            <stop offset="100%" stopColor="#4A1A07" />
          </linearGradient>
          <linearGradient id="clayRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E08B5D" />
            <stop offset="50%" stopColor="#F5A97F" />
            <stop offset="100%" stopColor="#A84C23" />
          </linearGradient>
          <linearGradient id="oilPool" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="60%" stopColor="#FF8F00" />
            <stop offset="100%" stopColor="#7E3A00" />
          </linearGradient>

          {/* Shadow Filter */}
          <filter id="diyaShadow" x="-20%" y="-20%" width="140%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="5" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft Drop Shadow under Diya */}
        <ellipse cx="50" cy="62" rx="42" ry="7" fill="#261005" opacity="0.3" filter="blur(2px)" />

        {/* Traditional Clay Diya Body */}
        <g filter="url(#diyaShadow)">
          {/* Main Terracotta Base */}
          <path
            d="M8 38 C 10 56, 32 63, 50 63 C 68 63, 90 56, 92 38 C 93 34, 86 35, 78 35 C 62 35, 38 35, 22 35 C 14 35, 7 34, 8 38 Z"
            fill="url(#clayGradient)"
          />

          {/* Clay Bowl Interior / Oil Reservoir */}
          <ellipse cx="50" cy="35" rx="41" ry="8.5" fill="#5A230D" />
          <ellipse cx="50" cy="35.5" rx="37" ry="6.5" fill="url(#oilPool)" opacity="0.85" />

          {/* Clay Rim Highlight */}
          <path
            d="M9 35 C 18 40, 82 40, 91 35 C 82 31, 18 31, 9 35 Z"
            fill="none"
            stroke="url(#clayRim)"
            strokeWidth="2"
          />

          {/* Spout / Wick Beak */}
          <path
            d="M45 35 C 48 33, 52 33, 55 35 L 53 38 L 47 38 Z"
            fill="#3E1508"
          />
        </g>

        {/* Cotton Wick */}
        <path
          d="M 50 36 C 49.5 32, 50.5 28, 50 24"
          stroke="#26170F"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Animated Sacred Flame */}
        <g className="animate-flame origin-bottom">
          {/* Flame Outer Halo */}
          <circle cx="50" cy="18" r="16" fill="url(#flameOuter)" filter="blur(3px)" />

          {/* Main Outer Flame Teardrop */}
          <path
            d="M 50 4 C 43 14, 40 22, 44 28 C 47 32, 53 32, 56 28 C 60 22, 57 14, 50 4 Z"
            fill="url(#flameInner)"
          />

          {/* Vibrant Inner Core Flame */}
          <path
            d="M 50 10 C 46 16, 44 21, 46 25 C 48 28, 52 28, 54 25 C 56 21, 54 16, 50 10 Z"
            fill="#FFFFFF"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
};

/**
 * Traditional Marigold (Genda) Flower for festive styling
 */
export const MarigoldFlower: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 32, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center justify-center select-none pointer-events-none drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <defs>
          <radialGradient id="marigoldGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="35%" stopColor="#FFB300" />
            <stop offset="70%" stopColor="#FB8C00" />
            <stop offset="95%" stopColor="#E65100" />
            <stop offset="100%" stopColor="#BF360C" />
          </radialGradient>
        </defs>
        {/* Layered Ruffled Petals */}
        <g fill="url(#marigoldGrad)">
          {[0, 30, 60, 90, 120, 150].map((rot) => (
            <g key={rot} transform={`rotate(${rot} 50 50)`}>
              <ellipse cx="50" cy="22" rx="13" ry="17" opacity="0.9" />
              <ellipse cx="50" cy="78" rx="13" ry="17" opacity="0.9" />
              <ellipse cx="22" cy="50" rx="17" ry="13" opacity="0.9" />
              <ellipse cx="78" cy="50" rx="17" ry="13" opacity="0.9" />
            </g>
          ))}
          {[15, 45, 75, 105, 135, 165].map((rot) => (
            <g key={`inner-${rot}`} transform={`rotate(${rot} 50 50)`}>
              <ellipse cx="50" cy="30" rx="10" ry="13" opacity="0.95" />
              <ellipse cx="50" cy="70" rx="10" ry="13" opacity="0.95" />
              <ellipse cx="30" cy="50" rx="13" ry="10" opacity="0.95" />
              <ellipse cx="70" cy="50" rx="13" ry="10" opacity="0.95" />
            </g>
          ))}
          {/* Inner Golden Core */}
          <circle cx="50" cy="50" r="14" fill="#FF8F00" />
          <circle cx="50" cy="50" r="8" fill="#FFD54F" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Composite Diya & Marigold arrangement matching Image 4
 */
export const DiyaWithMarigold: React.FC<{
  size?: number;
  className?: string;
  mirrored?: boolean;
}> = ({ size = 90, className = '', mirrored = false }) => {
  return (
    <div
      className={`relative inline-flex items-center select-none pointer-events-none ${mirrored ? 'scale-x-[-1]' : ''} ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      {/* Background Marigold Flowers */}
      <div className="absolute -left-2 bottom-0 z-0">
        <MarigoldFlower size={size * 0.42} />
      </div>
      <div className="absolute left-6 -bottom-1 z-0">
        <MarigoldFlower size={size * 0.32} />
      </div>

      {/* Main Glowing Diya in Foreground */}
      <div className="relative z-10 ml-3">
        <GlowingDiya size={size * 0.72} />
      </div>
    </div>
  );
};

/**
 * Golden Traditional Mandala / Rangoli Sacred Geometry Motif
 */
export const DiwaliMandala: React.FC<{
  size?: number;
  className?: string;
  opacity?: number;
  color?: string;
}> = ({ size = 200, className = '', opacity = 0.22, color = '#D97706' }) => {
  return (
    <div
      className={`inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        stroke={color}
        strokeWidth="1.25"
      >
        {/* Center circles */}
        <circle cx="100" cy="100" r="10" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="22" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="34" />
        <circle cx="100" cy="100" r="50" />
        <circle cx="100" cy="100" r="68" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="85" />
        <circle cx="100" cy="100" r="95" strokeWidth="0.75" />

        {/* 8-fold radial lotus petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 100 100)`}>
            {/* Inner Petal */}
            <path
              d="M 100 66 C 92 80, 92 90, 100 100 C 108 90, 108 80, 100 66 Z"
              strokeWidth="1.2"
            />
            {/* Outer Petal */}
            <path
              d="M 100 15 C 84 45, 84 75, 100 100 C 116 75, 116 45, 100 15 Z"
              strokeWidth="1"
            />
            {/* Radiating teardrop tip */}
            <circle cx="100" cy="15" r="2.5" fill={color} />
            <circle cx="100" cy="50" r="1.5" fill={color} />
          </g>
        ))}

        {/* 16-fold delicate secondary points */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
          <g key={`sec-${angle}`} transform={`rotate(${angle} 100 100)`}>
            <path
              d="M 100 32 C 95 55, 95 75, 100 95 C 105 75, 105 55, 100 32 Z"
              strokeWidth="0.8"
            />
            <circle cx="100" cy="32" r="2" fill={color} />
          </g>
        ))}
      </svg>
    </div>
  );
};

