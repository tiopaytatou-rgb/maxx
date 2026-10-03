import React from 'react';

interface MaxxLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const MaxxLogo: React.FC<MaxxLogoProps> = ({ size = 'md', animated = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const badgeSizes = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Futuristic Geometric Core Icon */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        {/* Outer glowing halo */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 opacity-70 blur-md ${
            animated ? 'animate-pulse' : ''
          }`}
        />

        {/* Outer border shape */}
        <div className="relative w-full h-full rounded-xl bg-[#030712] border border-cyan-400/60 p-1 flex items-center justify-center shadow-[inset_0_0_12px_rgba(6,182,212,0.3)]">
          {/* Futuristic Hexagonal Vector Graphic */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
          >
            {/* Background cyber grid lines */}
            <path
              d="M16 2L29 9.5V22.5L16 30L3 22.5V9.5L16 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeOpacity="0.4"
            />
            {/* Core M - Stylized Futuristic Neural Cross */}
            <path
              d="M9 22V10L16 17L23 10V22"
              stroke="url(#maxx-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Quantum Core Center Node */}
            <circle cx="16" cy="17" r="2.2" fill="#00f0ff" className={animated ? 'animate-ping' : ''} />
            <circle cx="16" cy="17" r="1.8" fill="#ffffff" />

            <defs>
              <linearGradient id="maxx-grad" x1="9" y1="10" x2="23" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00f0ff" />
                <stop offset="0.5" stopColor="#38bdf8" />
                <stop offset="1" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex items-center gap-1.5 font-bold tracking-wider">
        <span
          className={`${textSizes[size]} font-extrabold bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] tracking-tight`}
        >
          MAXX
        </span>
        <span
          className={`${badgeSizes[size]} font-black rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.6)] uppercase`}
        >
          AI
        </span>
      </div>
    </div>
  );
};
