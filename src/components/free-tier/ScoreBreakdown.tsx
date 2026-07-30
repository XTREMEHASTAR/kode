import React from 'react';
import { ScoreBreakdownData } from '../../types/freeTier';

interface ScoreBreakdownProps {
  data: ScoreBreakdownData;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ data }) => {
  const safeData = data || {
    attention: 70,
    interest: 70,
    clarity: 70,
    relevance: 70,
    emotionalImpact: 70,
  };

  const items = [
    { label: 'Attention', value: safeData.attention ?? 70 },
    { label: 'Interest', value: safeData.interest ?? 70 },
    { label: 'Clarity', value: safeData.clarity ?? 70 },
    { label: 'Relevance', value: safeData.relevance ?? 70 },
    { label: 'Emotional Impact', value: safeData.emotionalImpact ?? 70 }
  ];

  return (
    <div className="aura-card p-6 bg-[#FCF9F3] border border-[#173247]/10 rounded-2xl shadow-sm h-full flex flex-col justify-between">
      <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">
        SCORE BREAKDOWN
      </h3>
      <div className="flex flex-col gap-4">
        {items.map((item, idx) => {
          // Fill: Navy by default, vermilion/orange selectively for weak metrics
          const isWeak = item.value < 50;
          const fillColor = isWeak ? '#F13A1E' : '#173247';

          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[#173247]">{item.label}</span>
                <span className="font-bold text-slate-600">{item.value} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EAE3D5] overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${item.value}%`, backgroundColor: fillColor }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
