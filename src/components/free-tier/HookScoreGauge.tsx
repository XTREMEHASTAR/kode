import React from 'react';

interface HookScoreGaugeProps {
  score: number;
  status: string;
  supportingText: string;
  size?: 'sm' | 'lg';
}

export const HookScoreGauge: React.FC<HookScoreGaugeProps> = ({
  score,
  status,
  supportingText,
  size = 'lg'
}) => {
  // SVG Orbit Metrics
  const radius = size === 'lg' ? 62 : 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine score color ranges based on editorial specification
  let arcColor = '#173247'; // 75-100 Deep Navy
  let pointColor = '#F13A1E';

  if (score < 40) {
    arcColor = '#F13A1E'; // 0-39 Signal Vermilion
  } else if (score < 60) {
    arcColor = '#F36A24'; // 40-59 Burnt Orange
  } else if (score < 75) {
    arcColor = '#E5C88E'; // 60-74 Warm Ochre / Parchment
  }

  // Calculate orbiting point position on the circle
  const angleDeg = (score / 100) * 360 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  const pointX = 70 + radius * Math.cos(angleRad);
  const pointY = 70 + radius * Math.sin(angleRad);

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2 select-none">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="15" fill="transparent" stroke="#173247" strokeOpacity="0.15" strokeWidth="1.5" />
            <circle 
              cx="20" 
              cy="20" 
              r="15" 
              fill="transparent" 
              stroke={arcColor} 
              strokeWidth="2.5" 
              strokeDasharray={2 * Math.PI * 15}
              strokeDashoffset={2 * Math.PI * 15 - (score / 100) * (2 * Math.PI * 15)}
              strokeLinecap="round"
              transform="rotate(-90 20 20)"
            />
          </svg>
        </div>
        <span className="font-bold text-sm text-[#173247]">{score}</span>
      </div>
    );
  }

  return (
    <div className="aura-card p-6 flex flex-col items-center gap-4 bg-[#FCF9F3] border border-[#173247]/10 rounded-2xl shadow-sm">
      <h3 className="self-start text-xs font-extrabold uppercase tracking-widest text-slate-500">
        HOOK SCORE
      </h3>

      {/* Signature Geometric Score Visualization (Orbit + Arc + Orbiting Point) */}
      <div className="relative w-[140px] h-[140px] flex items-center justify-center my-2">
        <svg width="140" height="140" viewBox="0 0 140 140" className="overflow-visible">
          {/* Outer Thin Orbit Circle */}
          <circle 
            cx="70" 
            cy="70" 
            r={radius} 
            fill="transparent" 
            stroke="#173247" 
            strokeOpacity="0.15" 
            strokeWidth="1.5" 
          />
          {/* Inner Dashed Decorative Ring */}
          <circle 
            cx="70" 
            cy="70" 
            r={radius - 8} 
            fill="transparent" 
            stroke="#E5C88E" 
            strokeOpacity="0.4" 
            strokeWidth="1" 
            strokeDasharray="3 3"
          />
          {/* Vermilion/Orange Fill Arc */}
          <circle 
            cx="70" 
            cy="70" 
            r={radius} 
            fill="transparent" 
            stroke={arcColor} 
            strokeWidth="3.5" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
          {/* Orbiting Focal Point Marker */}
          <circle 
            cx={pointX} 
            cy={pointY} 
            r="4" 
            fill={pointColor}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Centered Score Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold text-[#173247] tracking-tight leading-none">
            {score}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Score Rating Status */}
      <div className="text-center flex flex-col items-center gap-1">
        <span 
          className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border"
          style={{ 
            color: arcColor, 
            borderColor: `${arcColor}33`,
            backgroundColor: `${arcColor}10` 
          }}
        >
          {status}
        </span>
        <p className="text-xs text-slate-600 leading-relaxed max-w-[240px] mt-2">
          {supportingText}
        </p>
      </div>
    </div>
  );
};
