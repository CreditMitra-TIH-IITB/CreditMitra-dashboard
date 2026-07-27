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
        return '#10b981'; // emerald-500
      case 'very good':
        return '#06b6d4'; // cyan-500
      case 'good':
        return '#f59e0b'; // amber-500
      case 'fair':
        return '#f97316'; // orange-500
      case 'poor':
      default:
        return '#ef4444'; // red-500
    }
  };

  const strokeColor = getBandColor(band);

  return (
    <div className="flex flex-col items-center justify-center relative p-4">
      <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
        {/* Background track arc */}
        <path
          d="M 20 95 A 80 80 0 0 1 180 95"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
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
          return <circle cx={nx} cy={ny} r="6" fill="#ffffff" className="shadow-lg animate-pulse" />;
        })()}
      </svg>

      {/* Score Text Overlay */}
      <div className="absolute bottom-2 flex flex-col items-center text-center">
        <span className="text-4xl font-serif font-bold text-white tracking-tight">{score}</span>
        <span
          className="text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full mt-1 border"
          style={{
            borderColor: `${strokeColor}50`,
            backgroundColor: `${strokeColor}15`,
            color: strokeColor,
          }}
        >
          {band}
        </span>
      </div>
    </div>
  );
};
