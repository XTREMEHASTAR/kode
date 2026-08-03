import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  Sparkles,
  Layers,
  Flame
} from 'lucide-react';

export interface RadarPoint {
  dimension: string;
  dimensionLabel: string;
  assetScore: number;
  platformMedian: number;
  top5PercentElite: number;
  percentile: number;
  tier: 'Top 1%' | 'Top 5%' | 'Top 10%' | 'Median' | 'Bottom 25%';
}

export interface BenchmarkData {
  contentRefId: string;
  category: string;
  platform: string;
  country: string;
  overallOpportunityScore: number;
  radarChartData: RadarPoint[];
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
}

interface BenchmarkRadarViewProps {
  data?: BenchmarkData;
}

export const BenchmarkRadarView: React.FC<BenchmarkRadarViewProps> = ({ data }) => {
  const defaultData: BenchmarkData = {
    contentRefId: 'sample_asset_101',
    category: 'Tech & AI',
    platform: 'Instagram Reels',
    country: 'Global',
    overallOpportunityScore: 24.5,
    radarChartData: [
      { dimension: 'hook', dimensionLabel: 'Hook Velocity (0–3s)', assetScore: 88, platformMedian: 65, top5PercentElite: 90, percentile: 94.2, tier: 'Top 5%' },
      { dimension: 'retention', dimensionLabel: 'Audience Retention (30s)', assetScore: 76, platformMedian: 60, top5PercentElite: 88, percentile: 81.5, tier: 'Top 10%' },
      { dimension: 'editing', dimensionLabel: 'Pacing & Scene Cuts', assetScore: 82, platformMedian: 62, top5PercentElite: 89, percentile: 88.0, tier: 'Top 10%' },
      { dimension: 'audio', dimensionLabel: 'Acoustic Quality & BPM', assetScore: 74, platformMedian: 58, top5PercentElite: 86, percentile: 76.4, tier: 'Median' },
      { dimension: 'visualQuality', dimensionLabel: 'Visual Complexity & Motion', assetScore: 85, platformMedian: 66, top5PercentElite: 91, percentile: 89.2, tier: 'Top 10%' },
      { dimension: 'speech', dimensionLabel: 'Speech Clarity & WPM', assetScore: 80, platformMedian: 61, top5PercentElite: 87, percentile: 83.1, tier: 'Top 10%' },
      { dimension: 'emotion', dimensionLabel: 'Curiosity & Emotional Arc', assetScore: 78, platformMedian: 63, top5PercentElite: 88, percentile: 80.5, tier: 'Top 10%' },
      { dimension: 'thumbnail', dimensionLabel: 'Thumbnail CTR & Contrast', assetScore: 90, platformMedian: 64, top5PercentElite: 92, percentile: 95.8, tier: 'Top 5%' },
      { dimension: 'caption', dimensionLabel: 'Caption & SEO Density', assetScore: 72, platformMedian: 59, top5PercentElite: 85, percentile: 71.0, tier: 'Median' },
      { dimension: 'engagement', dimensionLabel: 'Interaction Ratios (Like/Save)', assetScore: 84, platformMedian: 62, top5PercentElite: 90, percentile: 89.9, tier: 'Top 10%' },
      { dimension: 'views', dimensionLabel: 'Estimated View Volume', assetScore: 79, platformMedian: 65, top5PercentElite: 93, percentile: 82.0, tier: 'Top 10%' }
    ],
    strengths: [
      'Hook Velocity is in the Top 5% elite tier (P94.2 retention in initial 3s).',
      'Thumbnail CTR & visual contrast ranks higher than 95% of platform benchmarks.',
      'High interaction-to-view engagement conversion ratio.'
    ],
    weaknesses: [
      'Caption SEO & hashtag keyword density is near median benchmark (P71.0).',
      'Audio energy balance decreases during mid-video transitions (8s–15s).'
    ],
    improvementSuggestions: [
      'Increase caption text depth and add 3 high-intent search keywords to boost algorithmic discovery.',
      'Boost background music volume by +2dB and increase cut rate frequency during Scene 3 (8s–15s).',
      'Add dynamic text overlays in the first 2.5 seconds to push Hook score into Top 1% tier.'
    ]
  };

  const benchmark = data || defaultData;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Top 1%': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Top 5%': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Top 10%': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Median': return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      default: return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Benchmark Intelligence Explorer
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 11 Dimensions
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Quantile distribution benchmarks vs Top 1%, Top 5%, Top 10%, Median & Category Averages.
            </p>
          </div>
        </div>

        {/* Opportunity Score Gauge */}
        <div className="flex items-center space-x-4 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/60 shrink-0">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Opportunity Score</div>
            <div className="text-xl font-black text-amber-400">{benchmark.overallOpportunityScore}%</div>
          </div>
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 11-Axis Benchmark Dimension Table */}
      <div className="mt-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          11-Dimension Quantile Performance Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Dimension</th>
                <th className="py-3 px-3 text-center">Asset Score</th>
                <th className="py-3 px-3 text-center">Platform Median</th>
                <th className="py-3 px-3 text-center">Top 5% Elite</th>
                <th className="py-3 px-3 text-center">Percentile Rank</th>
                <th className="py-3 px-3 text-right">Quantile Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {benchmark.radarChartData.map((pt) => (
                <tr key={pt.dimension} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">{pt.dimensionLabel}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-400">{pt.assetScore}/100</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">{pt.platformMedian}/100</td>
                  <td className="py-2.5 px-3 text-center text-amber-400 font-semibold">{pt.top5PercentElite}/100</td>
                  <td className="py-2.5 px-3 text-center font-bold text-indigo-300">P{pt.percentile}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-md font-semibold text-xs border ${getTierColor(pt.tier)}`}>
                      {pt.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-3">
            <CheckCircle className="w-4 h-4" />
            <span>Key Benchmark Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {benchmark.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
            <AlertCircle className="w-4 h-4" />
            <span>Optimization Opportunities</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {benchmark.weaknesses.map((wk, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Improvement Suggestions */}
      <div className="mt-6 bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
          <Lightbulb className="w-4 h-4" />
          <span>Prioritized Recommendations to Reach Top 1% Tier</span>
        </div>
        <div className="space-y-2">
          {benchmark.improvementSuggestions.map((sug, idx) => (
            <div key={idx} className="flex items-start space-x-3 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/40 text-xs text-slate-200">
              <div className="px-2 py-0.5 font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 shrink-0">
                #{idx + 1}
              </div>
              <div className="mt-0.5">{sug}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
