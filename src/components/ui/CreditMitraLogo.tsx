import React from 'react';

interface CreditMitraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export const CreditMitraLogo: React.FC<CreditMitraLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  iconOnly = false,
}) => {
  const iconDimensions = {
    sm: { width: 32, height: 32, box: 'w-8 h-8' },
    md: { width: 40, height: 40, box: 'w-10 h-10' },
    lg: { width: 52, height: 52, box: 'w-13 h-13' },
  }[size];

  const textSizes = {
    sm: { title: 'text-lg', tag: 'text-[0.5625rem] tracking-[0.2em]' },
    md: { title: 'text-2xl', tag: 'text-[0.625rem] tracking-[0.24em]' },
    lg: { title: 'text-3xl', tag: 'text-[0.75rem] tracking-[0.26em]' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Bespoke Geometric Logo Emblem */}
      <div className={`relative ${iconDimensions.box} shrink-0 group cursor-pointer`}>
        {/* Ambient Glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-slate-400/10 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

        <svg
          width={iconDimensions.width}
          height={iconDimensions.height}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_2px_8px_rgba(217,119,6,0.18)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Primary Gold/Amber Gradient */}
            <linearGradient id="cmGold" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Deep Slate / Titanium Gradient */}
            <linearGradient id="cmSlate" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Radiant Accent Highlight */}
            <linearGradient id="cmShine" x1="16" y1="8" x2="32" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
            </linearGradient>

            {/* Subtle Inner Glow */}
            <filter id="cmShadow" x="-2" y="-2" width="52" height="52" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Squircle Badge Base with Metallic Glass Rim */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="12"
            fill="#ffffff"
            stroke="url(#cmGold)"
            strokeWidth="1.5"
            strokeOpacity="0.35"
            filter="url(#cmShadow)"
          />
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="12"
            fill="url(#cmGold)"
            fillOpacity="0.04"
          />

          {/* Interlocking 'C' Arc (Left / Credit & Security) */}
          <path
            d="M21 13.5C15.2 13.5 11 17.8 11 24C11 30.2 15.2 34.5 21 34.5C23.6 34.5 25.8 33.6 27.4 32.1L24.8 28.8C23.8 29.7 22.5 30.3 21 30.3C17.7 30.3 15.2 27.6 15.2 24C15.2 20.4 17.7 17.7 21 17.7C22.5 17.7 23.8 18.3 24.8 19.2L27.4 15.9C25.8 14.4 23.6 13.5 21 13.5Z"
            fill="url(#cmSlate)"
          />

          {/* Interlocking 'M' Ribbon & Growth Ascent (Right / Mitra & Ally) */}
          <path
            d="M22.5 34.5L27 22.2L30.8 30.5L34.5 22.2L39 34.5H35L33 28.5L30.8 33.5L28.5 28.5L26.5 34.5H22.5Z"
            fill="url(#cmGold)"
          />

          {/* Golden Keystone Nexus Node (AI Intelligence Spark) */}
          <circle cx="21" cy="24" r="2.4" fill="url(#cmGold)" />
          <circle cx="21" cy="24" r="1.2" fill="#fffdfa" />

          {/* Subtle Top-Right Spark Accent */}
          <path
            d="M34.5 12L35.4 14.1L37.5 15L35.4 15.9L34.5 18L33.6 15.9L31.5 15L33.6 14.1L34.5 12Z"
            fill="#d97706"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Logotype Branding Text */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span
              className={`font-serif font-semibold tracking-tight text-slate-900 ${textSizes.title}`}
            >
              Credit
            </span>
            <span
              className={`font-serif italic font-medium bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent ${textSizes.title}`}
            >
              Mitra
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mb-0.5 inline-block shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
          </div>

          {showTagline && (
            <div
              className={`font-mono font-semibold uppercase text-slate-400 mt-1 flex items-center gap-1.5 ${textSizes.tag}`}
            >
              <span>Statement Intelligence</span>
              <span className="text-amber-500/70 font-normal">·</span>
              <span className="text-slate-400 font-medium">IITB</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
