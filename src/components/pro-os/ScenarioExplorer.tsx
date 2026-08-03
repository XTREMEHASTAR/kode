import React, { useState } from 'react';
import { 
  Sliders, 
  Trophy, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  ArrowUpRight, 
  HelpCircle,
  Video,
  Layers,
  Zap
} from 'lucide-react';

export interface VariantData {
  id: string;
  variantName: string;
  overallScore: number;
  metrics: {
    scrollStop: number;
    watch3s: number;
    completion: number;
    estimatedViews: number;
  };
  retentionCurve: Array<{ second: number; percentage: number }>;
  deltaFromBaseline: {
    scoreDelta: number;
    scrollStopDelta: number;
    viewDelta: number;
    completionDelta: number;
  };
  whyOutperforms: string;
  isBestVersion: boolean;
}

interface ScenarioExplorerProps {
  sessionId?: string;
  variants?: VariantData[];
}

export const ScenarioExplorer: React.FC<ScenarioExplorerProps> = ({ sessionId = 'sess_default_101', variants }) => {
  const defaultVariants: VariantData[] = [
    {
      id: 'v_base',
      variantName: 'Baseline (Original Cut)',
      overallScore: 68.0,
      metrics: { scrollStop: 0.65, watch3s: 0.52, completion: 0.32, estimatedViews: 45000 },
      retentionCurve: [
        { second: 0, percentage: 100 },
        { second: 3, percentage: 65 },
        { second: 8, percentage: 52 },
        { second: 15, percentage: 42 },
        { second: 30, percentage: 32 }
      ],
      deltaFromBaseline: { scoreDelta: 0, scrollStopDelta: 0, viewDelta: 0, completionDelta: 0 },
      whyOutperforms: 'Original baseline video content.',
      isBestVersion: false
    },
    {
      id: 'v_hook',
      variantName: 'Scenario A: Better Hook',
      overallScore: 82.0,
      metrics: { scrollStop: 0.82, watch3s: 0.70, completion: 0.44, estimatedViews: 82000 },
      retentionCurve: [
        { second: 0, percentage: 100 },
        { second: 3, percentage: 82 },
        { second: 8, percentage: 70 },
        { second: 15, percentage: 60 },
        { second: 30, percentage: 44 }
      ],
      deltaFromBaseline: { scoreDelta: 14.0, scrollStopDelta: 0.17, viewDelta: 37000, completionDelta: 0.12 },
      whyOutperforms: 'Dynamic kinetic text overlays & curiosity question in first 2s boost 3s retention by +17% and total estimated views by +37,000.',
      isBestVersion: true
    },
    {
      id: 'v_thumb',
      variantName: 'Scenario B: Better Thumbnail',
      overallScore: 76.5,
      metrics: { scrollStop: 0.75, watch3s: 0.62, completion: 0.36, estimatedViews: 64000 },
      retentionCurve: [
        { second: 0, percentage: 100 },
        { second: 3, percentage: 75 },
        { second: 8, percentage: 62 },
        { second: 15, percentage: 50 },
        { second: 30, percentage: 36 }
      ],
      deltaFromBaseline: { scoreDelta: 8.5, scrollStopDelta: 0.10, viewDelta: 19000, completionDelta: 0.04 },
      whyOutperforms: 'High contrast facial emotion thumbnail increases initial organic scroll-stop CTR by +10%.',
      isBestVersion: false
    },
    {
      id: 'v_cta',
      variantName: 'Scenario C: Better CTA',
      overallScore: 74.0,
      metrics: { scrollStop: 0.66, watch3s: 0.54, completion: 0.41, estimatedViews: 58000 },
      retentionCurve: [
        { second: 0, percentage: 100 },
        { second: 3, percentage: 66 },
        { second: 8, percentage: 54 },
        { second: 15, percentage: 46 },
        { second: 30, percentage: 41 }
      ],
      deltaFromBaseline: { scoreDelta: 6.0, scrollStopDelta: 0.01, viewDelta: 13000, completionDelta: 0.09 },
      whyOutperforms: 'Explicit verbal comment prompt at t=28s boosts save conversion rate by +9%.',
      isBestVersion: false
    }
  ];

  const activeVariants = variants && variants.length > 0 ? variants : defaultVariants;
  const bestVariant = activeVariants.find(v => v.isBestVersion) || activeVariants[1] || activeVariants[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Scenario Counterfactual Engine
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                Unlimited Pre-Pub Comparisons
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Simulate and compare pre-publication variants side-by-side with optimization deltas.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add New Scenario</span>
        </button>
      </div>

      {/* Best Version Winner Callout Banner */}
      <div className="mt-6 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Optimal Version Winner</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                +{bestVariant.deltaFromBaseline.scoreDelta} PTS OVER BASELINE
              </span>
            </div>
            <div className="text-lg font-bold text-white mt-0.5">{bestVariant.variantName}</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{bestVariant.whyOutperforms}</p>
          </div>
        </div>

        <div className="text-right shrink-0 bg-slate-900/80 px-4 py-2 rounded-xl border border-amber-500/30">
          <div className="text-xs font-semibold text-slate-400">Virality Score</div>
          <div className="text-2xl font-black text-amber-400">{bestVariant.overallScore}/100</div>
        </div>
      </div>

      {/* Side-by-Side Variant Cards */}
      <div className="mt-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Side-By-Side Scenario Metrics & Deltas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeVariants.map((variant) => {
            const isWinner = variant.isBestVersion;
            const isBase = variant.deltaFromBaseline.scoreDelta === 0;

            return (
              <div
                key={variant.id}
                className={`rounded-xl p-4 border transition-all duration-200 relative flex flex-col justify-between ${
                  isWinner
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-xl shadow-amber-950/20'
                    : isBase
                    ? 'bg-slate-800/30 border-slate-800'
                    : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                {isWinner && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> BEST VERSION
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isBase ? 'Control' : 'Variant'}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1">{variant.variantName}</h4>

                  {/* Score Pill */}
                  <div className="mt-3 flex items-baseline justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs text-slate-400">Predicted Score</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-lg font-black text-white">{variant.overallScore}</span>
                      {!isBase && (
                        <span className={`text-xs font-bold ${variant.deltaFromBaseline.scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ({variant.deltaFromBaseline.scoreDelta >= 0 ? '+' : ''}{variant.deltaFromBaseline.scoreDelta})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-400">3s Hook Retention:</span>
                      <span className="font-mono font-bold text-slate-200">
                        {Math.round(variant.metrics.scrollStop * 100)}%
                        {!isBase && (
                          <span className="text-emerald-400 font-normal ml-1">
                            (+{Math.round(variant.deltaFromBaseline.scrollStopDelta * 100)}%)
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-400">Completion Rate:</span>
                      <span className="font-mono font-bold text-slate-200">
                        {Math.round(variant.metrics.completion * 100)}%
                        {!isBase && (
                          <span className="text-emerald-400 font-normal ml-1">
                            (+{Math.round(variant.deltaFromBaseline.completionDelta * 100)}%)
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-400">Estimated Views:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {variant.metrics.estimatedViews.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation Footnote */}
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic leading-snug">
                  {variant.whyOutperforms}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
