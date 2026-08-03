import React from 'react';
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Layers, 
  Users, 
  Smile, 
  Volume2, 
  Image, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight,
  BrainCircuit,
  Award
} from 'lucide-react';

export interface CreatorStyleFingerprintData {
  editingStyle: { pacingWpm: number; avgCutIntervalSec: number; visualComplexityScore: number };
  hookPatterns: { curiosityGapScore: number; kineticTextFrequency: number; questionOpeningRate: number };
  audienceAffinity: { topDemographic: string; primaryInterestTags: string[]; personaAffinityScore: number };
  topicEmbeddings: { primaryNiche: string; recurringTopics: string[] };
  speechCadence: { wordsPerMinute: number; pauseRatio: number; clarityScore: number };
  emotionProfile: { dominantSentiment: string; expressivenessScore: number };
  thumbnailStyle: { contrastRatio: number; facePresencePct: number; textSaturationScore: number };
  postingFrequency: { videosPerWeek: number; peakPostingHourUtc: number };
  historicalPerformance: { avgViews: number; avgCompletionRate: number; baselineViralityScore: number };
  strengths: string[];
  weaknesses: string[];
  growthTrends: { monthlyViewVelocityPct: number; engagementMomentumScore: number };
}

export interface CreatorTwinViewData {
  id: string;
  creatorId: string;
  twinName: string;
  handle: string;
  nicheCategory: string;
  styleFingerprint: CreatorStyleFingerprintData;
  overallMaturityScore: number;
  totalAnalyzedVideos: number;
  forecast?: {
    baselineViews: number;
    trajectories: {
      conservative90dViews: number;
      expected90dViews: number;
      viral90dViews: number;
      expectedSubscribersGained: number;
    };
    personalizedStrategy: Array<{
      title: string;
      rationale: string;
      expectedLiftPct: number;
    }>;
    contentPlanSuggestions: string[];
  };
}

interface CreatorTwinViewProps {
  twin?: CreatorTwinViewData;
}

export const CreatorTwinView: React.FC<CreatorTwinViewProps> = ({ twin }) => {
  const defaultTwin: CreatorTwinViewData = {
    id: 'twin_101',
    creatorId: 'creator_sample_101',
    twinName: "TechVision's AI Creator Twin",
    handle: '@techvision_official',
    nicheCategory: 'Tech & SaaS',
    styleFingerprint: {
      editingStyle: { pacingWpm: 165, avgCutIntervalSec: 2.2, visualComplexityScore: 82 },
      hookPatterns: { curiosityGapScore: 88, kineticTextFrequency: 0.90, questionOpeningRate: 0.75 },
      audienceAffinity: { topDemographic: 'US 18–34 Tech Professionals', primaryInterestTags: ['AI', 'SaaS', 'DevTools'], personaAffinityScore: 88 },
      topicEmbeddings: { primaryNiche: 'Tech', recurringTopics: ['AI Code Assistants', 'Cloud Architecture', 'Productivity'] },
      speechCadence: { wordsPerMinute: 162, pauseRatio: 0.10, clarityScore: 92 },
      emotionProfile: { dominantSentiment: 'Enthusiastic', expressivenessScore: 85 },
      thumbnailStyle: { contrastRatio: 0.88, facePresencePct: 92, textSaturationScore: 78 },
      postingFrequency: { videosPerWeek: 4, peakPostingHourUtc: 18 },
      historicalPerformance: { avgViews: 68000, avgCompletionRate: 0.42, baselineViralityScore: 78 },
      strengths: ['High initial curiosity gap (0-3s)', 'Clear vocal articulation', 'Strong audience retention in tech niche'],
      weaknesses: ['Pacing drop-off at 8-15s mark', 'Sub-optimal thumbnail contrast'],
      growthTrends: { monthlyViewVelocityPct: 22.4, engagementMomentumScore: 86 }
    },
    overallMaturityScore: 78.5,
    totalAnalyzedVideos: 14,
    forecast: {
      baselineViews: 68000,
      trajectories: {
        conservative90dViews: 245000,
        expected90dViews: 420000,
        viral90dViews: 850000,
        expectedSubscribersGained: 10500
      },
      personalizedStrategy: [
        { title: 'Optimize First 2s Hook Velocity', rationale: 'Adding kinetic text overlays in first 2.5 seconds raises 3s retention by +17% across your tech audience.', expectedLiftPct: 24.5 },
        { title: 'High Contrast Emotion Thumbnail Template', rationale: 'Increasing facial emotion contrast increases organic search CTR from 5.2% to 8.8%.', expectedLiftPct: 18.0 },
        { title: 'Inject Verbal Call-To-Action at t=28s', rationale: 'Explicit comment prompts at completion phase increase share saves by +14%.', expectedLiftPct: 12.5 }
      ],
      contentPlanSuggestions: [
        'Top 5 AI Tools Disrupting Product Design in 2026',
        'Why 90% of SaaS Startups Fail at Onboarding (And How to Fix It)',
        'Building an Autonomous AI Agent in 10 Minutes with TypeScript'
      ]
    }
  };

  const t = twin || defaultTwin;
  const fp = t.styleFingerprint;
  const fc = t.forecast;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-slate-100 font-sans">
      {/* Header Avatar Card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-purple-600/30">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">{t.twinName}</h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Persistent Memory Engine
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5 font-mono">
              {t.handle} • {t.nicheCategory} • {t.totalAnalyzedVideos} Videos Learned
            </p>
          </div>
        </div>

        <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-purple-500/30 text-right shrink-0">
          <div className="text-xs font-semibold text-slate-400">Twin Maturity Score</div>
          <div className="text-xl font-black text-purple-400">{t.overallMaturityScore}/100</div>
        </div>
      </div>

      {/* 12 Core Style Dimensions Grid */}
      <div className="mt-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          12 Core Creator Style Dimensions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Editing Style */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">1. Editing Style</div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span>Pacing WPM:</span><span className="font-mono font-bold">{fp.editingStyle.pacingWpm}</span></div>
              <div className="flex justify-between"><span>Avg Cut Interval:</span><span className="font-mono font-bold">{fp.editingStyle.avgCutIntervalSec}s</span></div>
              <div className="flex justify-between"><span>Visual Complexity:</span><span className="font-mono font-bold text-purple-300">{fp.editingStyle.visualComplexityScore}/100</span></div>
            </div>
          </div>

          {/* 2. Hook Patterns */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">2. Hook Patterns</div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span>Curiosity Gap:</span><span className="font-mono font-bold text-sky-300">{fp.hookPatterns.curiosityGapScore}/100</span></div>
              <div className="flex justify-between"><span>Kinetic Overlay:</span><span className="font-mono font-bold">{Math.round(fp.hookPatterns.kineticTextFrequency * 100)}%</span></div>
              <div className="flex justify-between"><span>Question Opening:</span><span className="font-mono font-bold">{Math.round(fp.hookPatterns.questionOpeningRate * 100)}%</span></div>
            </div>
          </div>

          {/* 3. Speech & Vocal */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">3. Speech Cadence</div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span>Speech Rate:</span><span className="font-mono font-bold">{fp.speechCadence.wordsPerMinute} WPM</span></div>
              <div className="flex justify-between"><span>Pause Ratio:</span><span className="font-mono font-bold">{Math.round(fp.speechCadence.pauseRatio * 100)}%</span></div>
              <div className="flex justify-between"><span>Vocal Clarity:</span><span className="font-mono font-bold text-emerald-300">{fp.speechCadence.clarityScore}/100</span></div>
            </div>
          </div>

          {/* 4. Historical Baseline */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">4. Baseline Performance</div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span>Avg Views:</span><span className="font-mono font-bold text-amber-400">{fp.historicalPerformance.avgViews.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Completion:</span><span className="font-mono font-bold">{Math.round(fp.historicalPerformance.avgCompletionRate * 100)}%</span></div>
              <div className="flex justify-between"><span>Monthly Growth:</span><span className="font-mono font-bold text-emerald-400">+{fp.growthTrends.monthlyViewVelocityPct}%</span></div>
            </div>
          </div>

        </div>
      </div>

      {/* 90-Day Growth Forecast Trajectory */}
      {fc && (
        <div className="mt-8 bg-gradient-to-r from-purple-950/30 via-slate-900 to-indigo-950/30 border border-purple-500/30 rounded-xl p-5">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            90-Day Growth Forecast Trajectory
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400">Conservative 90d</div>
              <div className="text-lg font-bold text-slate-200 mt-0.5">{fc.trajectories.conservative90dViews.toLocaleString()} Views</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-500/40">
              <div className="text-[11px] font-semibold text-purple-300">Expected 90d Trajectory</div>
              <div className="text-xl font-black text-purple-400 mt-0.5">{fc.trajectories.expected90dViews.toLocaleString()} Views</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-amber-500/40">
              <div className="text-[11px] font-semibold text-amber-300">Viral Upper Bound</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">{fc.trajectories.viral90dViews.toLocaleString()} Views</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/40">
              <div className="text-[11px] font-semibold text-emerald-300">Subscribers Gained</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">+{fc.trajectories.expectedSubscribersGained.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
