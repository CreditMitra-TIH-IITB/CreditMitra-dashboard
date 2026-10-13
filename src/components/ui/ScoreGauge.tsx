import React from 'react';

interface ScoreGaugeProps {
  score: number;
  band: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, band }) => {
  // Score range 300 to 900 -> Map to angle 0 to 180 degrees
  const minScore = 300;
  const maxScore = 900;
  const clampedScore = Math.max(minScore, Math.min(maxScore, score));
  const percentage = (clampedScore - minScore) / (maxScore - minScore);
  const angle = percentage * 180;

  // Arc path parameters
  const radius = 80;
  const cx = 100;
  const cy = 95;

  const getBandColor = (b: string) => {
    switch (b.toLowerCase()) {
      case 'excellent':
        return '#059669'; // emerald-600
      case 'very good':
        return '#0d9488'; // teal-600
      case 'good':
        return '#d97706'; // amber-600
      case 'fair':
        return '#ea580c'; // orange-600
      case 'poor':
      default:
        return '#e11d48'; // rose-600
    }
  };

  const strokeColor = getBandColor(band);

  return (
    <div className="flex flex-col items-center justify-center relative p-3">
      <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
        {/* Background track arc in light slate */}
        <path
          d="M 20 95 A 80 80 0 0 1 180 95"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Dynamic progress arc */}
        <path
          d="M 20 95 A 80 80 0 0 1 180 95"
          fill="none"
          stroke={strokeColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="251.3" // Math.PI * 80
          strokeDashoffset={251.3 * (1 - percentage)}
          className="transition-all duration-1000 ease-out"
        />

        {/* Needle dot indicator at end of arc */}
        {(() => {
          const rad = (180 - angle) * (Math.PI / 180);
          const nx = cx + radius * Math.cos(rad);
          const ny = cy - radius * Math.sin(rad);
          return (
            <circle
              cx={nx}
              cy={ny}
              r="6"
              fill="#ffffff"
              stroke={strokeColor}
              strokeWidth="2.5"
              className="drop-shadow-sm"
            />
          );
        })()}
      </svg>

      {/* Score Text Overlay */}
      <div className="absolute bottom-2 flex flex-col items-center text-center">
        <span className="text-4xl font-serif font-bold text-slate-900 tracking-tight">{score}</span>
        <span
          className="text-[0.6875rem] font-semibold uppercase tracking-widest px-3 py-0.5 rounded-full mt-1 border shadow-2xs"
          style={{
            borderColor: `${strokeColor}40`,
            backgroundColor: `${strokeColor}12`,
            color: strokeColor,
          }}
        >
          {band}
        </span>
      </div>
    </div>
  );
};
