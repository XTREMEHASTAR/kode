import React from 'react';
import { 
  Eye, 
  HelpCircle, 
  GitBranch, 
  ShieldCheck, 
  Layers, 
  Users, 
  BarChart2, 
  Zap, 
  CheckCircle2, 
  MessageSquare, 
  Bot,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface ExplainabilityPillarData {
  metricKey: string;
  metricLabel: string;
  scoreValue: number;
  whyRationale: string;
  evidenceReferences: Array<{ nodeId: string; nodeType: string; label: string }>;
  confidence: { scorePct: number; level: string; sourceAttribution: string };
  supportingFeatures: Array<{ featureName: string; weightContributionPct: number }>;
  personaAgreement: { agreementPct: number; cohortSummary: string };
  historicalComparison: { percentileRank: number; tier: string };
  counterfactual: { recommendedFix: string; predictedDelta: number };
}

export interface ExplainabilityReportData {
  id: string;
  jobId: string;
  overallScore: number;
  pillars: ExplainabilityPillarData[];
  reasonChains: Array<{
    stepIndex: number;
    cause: string;
    effect: string;
    confidence: number;
  }>;
  confidenceTree: Array<{
    source: string;
    weightPct: number;
    uncertaintyRange: string;
  }>;
  featureImportance: Array<{
    featureName: string;
    importanceScore: number;
  }>;
  personaReasoning: Array<{
    personaCohort: string;
    quote: string;
    agreementPct: number;
  }>;
  moderatorReasoning: Array<{
    agentName: string;
    finding: string;
    sentiment: string;
  }>;
  counterfactual: {
    variantName: string;
    suggestedFix: string;
    predictedScoreDelta: number;
  };
}

interface ExplainabilityViewProps {
  report?: ExplainabilityReportData;
}

export const ExplainabilityView: React.FC<ExplainabilityViewProps> = ({ report }) => {
  const defaultReport: ExplainabilityReportData = {
    id: 'exp_report_101',
    jobId: 'sim_job_sample_101',
    overallScore: 82.0,
    pillars: [
      {
        metricKey: 'overall_virality',
        metricLabel: 'Overall Virality Score',
        scoreValue: 82.0,
        whyRationale: 'Score of 82/100 driven by strong initial 0-3s curiosity gap (P94.2) but capped by pacing deceleration at 8–15s.',
        evidenceReferences: [
          { nodeId: 'node_1', nodeType: 'scene_segment', label: 'Scene 1: Hook & Opening Velocity (0–3s)' },
          { nodeId: 'node_2', nodeType: 'content_feature', label: 'CKG Feature: Curiosity Gap Topology' },
          { nodeId: 'node_3', nodeType: 'persona_reaction', label: '78% Tech & Creator Cohort Scroll-Stop' }
        ],
        confidence: { scorePct: 92, level: 'High', sourceAttribution: 'CalibrationEngine + PersonaSwarm' },
        supportingFeatures: [
          { featureName: 'Hook Curiosity Gap', weightContributionPct: 32 },
          { featureName: 'Visual Complexity', weightContributionPct: 24 }
        ],
        personaAgreement: { agreementPct: 78, cohortSummary: 'US 18–34 Tech & Creator Persona Clusters' },
        historicalComparison: { percentileRank: 84.5, tier: 'Top 10%' },
        counterfactual: { recommendedFix: 'Add dynamic text overlays in first 2.5 seconds', predictedDelta: 14.0 }
      }
    ],
    reasonChains: [
      { stepIndex: 1, cause: 'Static opening frame in 0.0s–1.2s without text overlay', effect: 'Curiosity gap score dropped to 58/100', confidence: 0.94 },
      { stepIndex: 2, cause: 'Curiosity gap score below 75/100 threshold', effect: '72% of Tech & Creator persona cohorts scrolled past before 3s', confidence: 0.90 },
      { stepIndex: 3, cause: 'High initial scroll-stop drop-off', effect: 'Overall Virality Score capped at 68/100', confidence: 0.92 }
    ],
    confidenceTree: [
      { source: 'Content Understanding Engine (Engine 1)', weightPct: 40, uncertaintyRange: '± 2.1%' },
      { source: 'Persona Simulation Swarms (Engine 2)', weightPct: 35, uncertaintyRange: '± 3.4%' },
      { source: 'Calibration & Empirical Feedback', weightPct: 25, uncertaintyRange: '± 1.8%' }
    ],
    featureImportance: [
      { featureName: 'Hook Velocity & Curiosity Gap (0–3s)', importanceScore: 32 },
      { featureName: 'Visual Complexity & Scene Pacing', importanceScore: 24 },
      { featureName: 'Acoustic Rhythm & BPM Balance', importanceScore: 18 },
      { featureName: 'Call-To-Action (CTA) Prompts', importanceScore: 14 },
      { featureName: 'Caption & Search SEO Density', importanceScore: 12 }
    ],
    personaReasoning: [
      { personaCohort: '18–24 Tech Creator', quote: 'The premise hooked me, but the first 2 seconds needed immediate text captions on silent playback.', agreementPct: 78 },
      { personaCohort: '25–34 Entrepreneur', quote: 'Clear value proposition. I saved the video for reference at 22 seconds.', agreementPct: 84 }
    ],
    moderatorReasoning: [
      { agentName: 'Hook Agent', finding: 'Strong opening curiosity gap. 68% of simulated viewers stop scrolling in <2s.', sentiment: 'positive' },
      { agentName: 'Retention Agent', finding: 'Pacing stays consistent through 8s, but requires visual scene cut variance.', sentiment: 'warning' }
    ],
    counterfactual: {
      variantName: 'Scenario A: Better Hook',
      suggestedFix: 'Add dynamic kinetic text overlays in first 2.5 seconds',
      predictedScoreDelta: 14.0
    }
  };

  const exp = report || defaultReport;
  const mainPillar = exp.pillars[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Transparent Explainability Engine
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 7 Mandatory Pillars
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Zero black-box predictions. Every conclusion is 100% explainable with supporting evidence & SHAP feature weights.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/60 text-right shrink-0">
          <div className="text-xs font-semibold text-slate-400">Attributed Confidence</div>
          <div className="text-lg font-bold text-emerald-400">{mainPillar.confidence.scorePct}% ({mainPillar.confidence.level})</div>
        </div>
      </div>

      {/* 7 Mandatory Pillars Breakdown */}
      <div className="mt-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          7-Pillar Mandatory Score Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 1. Why */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>1. Why? (Causal Rationale)</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {mainPillar.whyRationale}
            </p>
          </div>

          {/* 2. Evidence */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-2">
              <GitBranch className="w-4 h-4" />
              <span>2. Evidence Graph References</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {mainPillar.evidenceReferences.map((ev, idx) => (
                <li key={idx} className="flex items-center space-x-1.5 truncate">
                  <span className="text-sky-400 font-bold">•</span>
                  <span className="truncate">{ev.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Confidence */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>3. Confidence & Calibration</span>
            </div>
            <div className="text-xs text-slate-200">
              Score: <span className="font-bold text-emerald-400">{mainPillar.confidence.scorePct}% ({mainPillar.confidence.level})</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Source: {mainPillar.confidence.sourceAttribution}
            </div>
          </div>

          {/* 4. Supporting Features */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>4. Supporting CKG Features</span>
            </div>
            <div className="space-y-1 text-xs">
              {mainPillar.supportingFeatures.map((sf, idx) => (
                <div key={idx} className="flex justify-between text-slate-300">
                  <span>{sf.featureName}</span>
                  <span className="font-bold text-purple-300">+{sf.weightContributionPct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Persona Agreement */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              <span>5. Persona Cohort Agreement</span>
            </div>
            <div className="text-xs text-slate-200 font-medium">
              {mainPillar.personaAgreement.agreementPct}% Agreement Rate
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {mainPillar.personaAgreement.cohortSummary}
            </div>
          </div>

          {/* 6. Historical Comparison */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
              <BarChart2 className="w-4 h-4" />
              <span>6. Benchmark Comparison</span>
            </div>
            <div className="text-xs text-slate-200">
              Percentile Rank: <span className="font-bold text-indigo-300">P{mainPillar.historicalComparison.percentileRank}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Distribution Tier: <span className="font-bold text-indigo-400">{mainPillar.historicalComparison.tier}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Feature Importance & Reason Chains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
        {/* Feature Importance (SHAP Weights) */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Relative Feature Importance Weights (Sums to 100%)
          </h4>
          <div className="space-y-3">
            {exp.featureImportance.map((fi, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-200">
                  <span>{fi.featureName}</span>
                  <span className="font-mono font-bold text-purple-400">{fi.importanceScore}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: `${fi.importanceScore}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Reason Chain Lineage */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-amber-400" />
            Causal Reason Chain Lineage
          </h4>
          <div className="space-y-3">
            {exp.reasonChains.map((chain) => (
              <div key={chain.stepIndex} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 text-xs">
                <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                  <span>Step {chain.stepIndex} Causal Link</span>
                  <span className="text-[10px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {Math.round(chain.confidence * 100)}% Confidence
                  </span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Cause:</span> {chain.cause}
                </div>
                <div className="text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <ArrowRight className="w-3 h-3" />
                  <span>Effect: {chain.effect}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
