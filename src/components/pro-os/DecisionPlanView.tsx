import React from 'react';
import { 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Calendar,
  Zap,
  Target,
  ShieldCheck
} from 'lucide-react';

export interface ActionItemData {
  actionKey: string;
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  expectedLiftPts: number;
  expectedViewGain: number;
  confidencePct: number;
  impact: 'High' | 'Medium' | 'Low';
  executionSteps: string[];
}

export interface DecisionPlanViewData {
  id: string;
  jobId: string;
  primaryDirective: 'PUBLISH_NOW' | 'OPTIMIZE_BEFORE_PUBLISH' | 'RESTRUCTURE_REQUIRED' | 'WAIT_FOR_TIMING_WINDOW';
  overallDecisionScore: number;
  actionItems: ActionItemData[];
  optimalPostingWindow: {
    recommendedDay: string;
    recommendedHourUtc: number;
    timeWindowLabel: string;
    reasoning: string;
  };
  totalExpectedScoreGain: number;
  totalExpectedViewGain: number;
}

interface DecisionPlanViewProps {
  plan?: DecisionPlanViewData;
}

export const DecisionPlanView: React.FC<DecisionPlanViewProps> = ({ plan }) => {
  const defaultPlan: DecisionPlanViewData = {
    id: 'dec_101',
    jobId: 'sim_job_sample_101',
    primaryDirective: 'OPTIMIZE_BEFORE_PUBLISH',
    overallDecisionScore: 68.0,
    actionItems: [
      {
        actionKey: 'change_hook',
        title: 'Add Dynamic Text Overlay & Curiosity Question in First 2.5s',
        priority: 'CRITICAL',
        expectedLiftPts: 14.0,
        expectedViewGain: 37000,
        confidencePct: 92,
        impact: 'High',
        executionSteps: [
          'Overlay bold kinetic text at 0.0s stating core premise',
          'Ask curiosity question ("Why do 90% of creators fail at this?")',
          'Trim first 1.2s of static intro silence'
        ]
      },
      {
        actionKey: 'replace_thumbnail',
        title: 'Increase Thumbnail Facial Contrast Ratio',
        priority: 'HIGH',
        expectedLiftPts: 8.5,
        expectedViewGain: 19000,
        confidencePct: 88,
        impact: 'High',
        executionSteps: [
          'Select frame with high-contrast facial emotion expression',
          'Add 2-word yellow/white high contrast text overlay'
        ]
      },
      {
        actionKey: 'change_cta',
        title: 'Inject Verbal & Text Comment Prompt at t=28s',
        priority: 'MEDIUM',
        expectedLiftPts: 6.0,
        expectedViewGain: 13000,
        confidencePct: 85,
        impact: 'Medium',
        executionSteps: [
          'Ask explicit engagement question at completion phase',
          'Add save/share trigger overlay'
        ]
      }
    ],
    optimalPostingWindow: {
      recommendedDay: 'Tuesday',
      recommendedHourUtc: 18,
      timeWindowLabel: 'Tuesday 18:00 UTC (1:00 PM EST)',
      reasoning: 'Peak active engagement window for US 18–34 Tech & Creator persona clusters.'
    },
    totalExpectedScoreGain: 28.5,
    totalExpectedViewGain: 69000
  };

  const d = plan || defaultPlan;

  const directiveColors = {
    PUBLISH_NOW: { bg: 'bg-emerald-950/40 border-emerald-500/50', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
    OPTIMIZE_BEFORE_PUBLISH: { bg: 'bg-amber-950/40 border-amber-500/50', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
    RESTRUCTURE_REQUIRED: { bg: 'bg-rose-950/40 border-rose-500/50', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300' },
    WAIT_FOR_TIMING_WINDOW: { bg: 'bg-sky-950/40 border-sky-500/50', text: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-300' }
  };

  const style = directiveColors[d.primaryDirective];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Decision Intelligence Engine
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> "What Should Creator Do Next?"
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Synthesizes Content Understanding & Audience Simulation into prioritized, actionable decisions.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/60 text-right shrink-0">
          <div className="text-xs font-semibold text-slate-400">Total Potential Lift</div>
          <div className="text-lg font-bold text-emerald-400">+{d.totalExpectedScoreGain} PTS (+{d.totalExpectedViewGain.toLocaleString()} Views)</div>
        </div>
      </div>

      {/* Primary Directive Hero Banner */}
      <div className={`mt-6 rounded-xl p-5 border ${style.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl`}>
        <div className="flex items-start space-x-3">
          <div className={`p-2.5 rounded-xl border ${style.badge} shrink-0`}>
            {d.primaryDirective === 'PUBLISH_NOW' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>Primary Decision Directive</span>
            </div>
            <div className="text-xl font-black text-white mt-0.5 tracking-tight">
              {d.primaryDirective.replace(/_/g, ' ')}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Current virality prediction is {d.overallDecisionScore}/100. Applying the high-leverage fixes below yields +{d.totalExpectedScoreGain} PTS.
            </p>
          </div>
        </div>
      </div>

      {/* Optimal Posting Window Banner */}
      <div className="mt-6 bg-slate-800/50 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-lg shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">Optimal Posting Time Window</div>
            <div className="text-sm font-bold text-white mt-0.5">{d.optimalPostingWindow.timeWindowLabel}</div>
            <div className="text-xs text-slate-400 mt-0.5">{d.optimalPostingWindow.reasoning}</div>
          </div>
        </div>
      </div>

      {/* Prioritized Action Checklist */}
      <div className="mt-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-400" />
          Prioritized Action Plan Checklist
        </h3>

        <div className="space-y-4">
          {d.actionItems.map((item, idx) => {
            const priorityBadge = item.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : item.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700';

            return (
              <div key={idx} className="bg-slate-800/40 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold border rounded-md uppercase ${priorityBadge}`}>
                      {item.priority}
                    </span>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      +{item.expectedLiftPts} PTS (+{item.expectedViewGain.toLocaleString()} Views)
                    </span>
                    <span className="text-xs text-slate-400">({item.confidencePct}% Confidence)</span>
                  </div>
                </div>

                {/* Execution Steps */}
                <div className="mt-3 pl-2 border-l-2 border-slate-700/60 space-y-1">
                  {item.executionSteps.map((step, sIdx) => (
                    <div key={sIdx} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
