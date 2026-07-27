import React from 'react';
import type { LifestyleProfile } from '../../types/transaction';

interface RadarChartProps {
  lifestyle: LifestyleProfile;
}

export const RadarChart: React.FC<RadarChartProps> = ({ lifestyle }) => {
  const axes = [
    { label: 'Essential Stability', value: lifestyle.l1_essential_stability || 0 },
    { label: 'Aspirational Spend', value: lifestyle.l2_aspirational || 0 },
    { label: 'Digital Maturity', value: lifestyle.l3_digital_maturity || 0 },
    { label: 'Commitment Index', value: lifestyle.l4_commitment || 0 },
    { label: 'Leverage Index', value: lifestyle.l5_leverage || 0 },
    { label: 'Risk Appetite', value: lifestyle.l6_risk_appetite || 0 },
  ];

  const size = 260;
  const center = size / 2;
  const radius = 85;
  const totalAxes = axes.length;

  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon coordinates for lifestyle values
  const polygonPoints = axes.map((axis, i) => {
    const { x, y } = getCoordinates(i, axis.value);
    return `${x},${y}`;
  }).join(' ');

  // Grid concentric polygons (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="flex flex-col items-center justify-center p-2 relative">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Concentric Grids */}
        {gridLevels.map((level, levelIdx) => {
          const points = axes.map((_, i) => {
            const { x, y } = getCoordinates(i, 100 * level);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={levelIdx}
              points={points}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Lines */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Data Polygon Fill & Outline */}
        <polygon
          points={polygonPoints}
          fill="rgba(245, 158, 11, 0.25)"
          stroke="#f59e0b"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-in-out hover:fill-amber-500/40"
        />

        {/* Data Points */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, axis.value);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#fbbf24"
              stroke="#0f172a"
              strokeWidth="2"
            />
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const labelCoords = getCoordinates(i, 122);
          return (
            <text
              key={i}
              x={labelCoords.x}
              y={labelCoords.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-400 text-[10px] font-medium tracking-tight"
            >
              {axis.label} ({axis.value})
            </text>
          );
        })}
      </svg>
    </div>
  );
};
