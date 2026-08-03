import React, { useState } from 'react';
import { 
  GitCommit, 
  HelpCircle, 
  Clock, 
  Layers, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  AlertTriangle,
  FileSearch,
  Sparkles
} from 'lucide-react';

export interface EvidenceTraceData {
  recommendationId: string;
  recommendationTitle: string;
  suggestedFix: string;
  whyRationale: string;
  sceneTimestamp: {
    startSec: number;
    endSec: number;
    segmentName: string;
  };
  ckgContentFeature: {
    featureLabel: string;
    sourceEngine: string;
    objectiveValue: string;
  };
  affectedPersonas: {
    disagreementPct: number;
    demographicSummary: string;
    reasoning: string;
  };
  confidence: {
    scorePct: number;
    confidenceLevel: string;
    sourceAttribution: string;
  };
}

interface EvidenceExplorerProps {
  jobId: string;
  traces?: EvidenceTraceData[];
}

export const EvidenceExplorer: React.FC<EvidenceExplorerProps> = ({ jobId, traces }) => {
  const defaultTraces: EvidenceTraceData[] = [
    {
      recommendationId: 'rec_1',
      recommendationTitle: 'Recommendation 1: Dynamic Hook Pattern Interrupt',
      suggestedFix: 'Add dynamic kinetic text overlays & audio swell within the first 2.5 seconds to bridge the curiosity gap.',
      whyRationale: 'Traced to CKG Feature "Hook Pacing & Curiosity Gap" which caused a 35% retention drop in Scene 1 (0–3s).',
      sceneTimestamp: {
        startSec: 0.0,
        endSec: 3.0,
        segmentName: 'Scene 1: Hook & Opening Velocity (0–3s)'
      },
      ckgContentFeature: {
        featureLabel: 'CKG Feature: Static Visual Opening / Question Absent',
        sourceEngine: 'Content Understanding Engine (Engine 1)',
        objectiveValue: 'Curiosity Gap score: 58/100 (Below 75/100 Virality Threshold)'
      },
      affectedPersonas: {
        disagreementPct: 72,
        demographicSummary: 'US 18–24 Tech & Creator Persona Cohorts',
        reasoning: 'Initial 0-3s opening lacked immediate kinetic movement or counter-intuitive hook claim.'
      },
      confidence: {
        scorePct: 92,
        confidenceLevel: 'High',
        sourceAttribution: 'CalibrationEngine + PersonaSwarm'
      }
    },
    {
      recommendationId: 'rec_2',
      recommendationTitle: 'Recommendation 2: Explicit Call-To-Action Trigger',
      suggestedFix: 'End with an explicit save prompt: "Save this for your next video shoot!" to trigger algorithmic push.',
      whyRationale: 'Traced to CKG Feature "Call-To-Action (CTA) Trigger" which drops save conversion rate from 18% to 6%.',
      sceneTimestamp: {
        startSec: 15.0,
        endSec: 30.0,
        segmentName: 'Scene 4: Payoff & Call-To-Action (15–30s)'
      },
      ckgContentFeature: {
        featureLabel: 'CKG Feature: CTA Verbal & Visual Prompt Absence',
        sourceEngine: 'Content Understanding Engine (Engine 1)',
        objectiveValue: 'CTA Trigger vector: 0.12 (Low Algorithmic Boost)'
      },
      affectedPersonas: {
        disagreementPct: 54,
        demographicSummary: '25–34 Entrepreneur & SaaS Founder Cohorts',
        reasoning: 'Viewers watched to completion but lacked explicit prompt to save for future reference.'
      },
      confidence: {
        scorePct: 88,
        confidenceLevel: 'High',
        sourceAttribution: 'ContentEngine'
      }
    }
  ];

  const activeTraces = traces && traces.length > 0 ? traces : defaultTraces;
  const [selectedRecId, setSelectedRecId] = useState<string>(activeTraces[0].recommendationId);

  const currentTrace = activeTraces.find(t => t.recommendationId === selectedRecId) || activeTraces[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <GitCommit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Evidence Graph Explorer
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  100% Explainable
                </span>
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Every prediction & recommendation is traced to verifiable CKG content features & persona data.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs font-mono text-slate-300">
          <FileSearch className="w-4 h-4 text-indigo-400" />
          <span>Job ID: {jobId.slice(0, 8)}...</span>
        </div>
      </div>

      {/* Recommendation Selector Tabs */}
      <div className="mt-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Select Recommendation to Trace Evidence:
        </label>
        <div className="flex flex-wrap gap-2">
          {activeTraces.map((trace) => (
            <button
              key={trace.recommendationId}
              onClick={() => setSelectedRecId(trace.recommendationId)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-2 ${
                selectedRecId === trace.recommendationId
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/25'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{trace.recommendationTitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Recommendation Summary Banner */}
      <div className="mt-6 bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Suggested Recommendation Action</div>
            <div className="text-sm font-medium text-slate-100 mt-0.5">{currentTrace.suggestedFix}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/30 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">{currentTrace.confidence.scorePct}% Confidence</span>
        </div>
      </div>

      {/* 5 Core Evidence Pillars */}
      <div className="mt-8 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          5-Pillar Causal Evidence Trace
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Pillar 1: Why? */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">1. Why? (Causal Rationale)</span>
              </div>
            </div>
            <p className="text-sm text-slate-200 mt-3 font-normal leading-relaxed">
              {currentTrace.whyRationale}
            </p>
          </div>

          {/* Pillar 2: Which Scene? */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">2. Which Scene? (Timestamp)</span>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-mono bg-sky-500/10 text-sky-300 border border-sky-500/30 rounded-md">
                t = {currentTrace.sceneTimestamp.startSec}s – {currentTrace.sceneTimestamp.endSec}s
              </span>
            </div>
            <p className="text-sm text-slate-200 mt-3 font-medium">
              {currentTrace.sceneTimestamp.segmentName}
            </p>
          </div>

          {/* Pillar 3: Which Feature? */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">3. Which Feature? (CKG Node)</span>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-200 mt-3">
              {currentTrace.ckgContentFeature.featureLabel}
            </div>
            <div className="text-xs font-mono text-purple-300 mt-1 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20 inline-block">
              {currentTrace.ckgContentFeature.objectiveValue}
            </div>
          </div>

          {/* Pillar 4: Which Personas? */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">4. Which Personas? (Drop-off)</span>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-md">
                {currentTrace.affectedPersonas.disagreementPct}% Disagreement
              </span>
            </div>
            <p className="text-sm text-slate-200 mt-3 font-medium">
              {currentTrace.affectedPersonas.demographicSummary}
            </p>
            <p className="text-xs text-slate-400 mt-1 italic">
              "{currentTrace.affectedPersonas.reasoning}"
            </p>
          </div>

        </div>

        {/* Pillar 5: How Confident? */}
        <div className="bg-gradient-to-r from-slate-800/60 to-slate-800/20 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">5. How Confident? (Calibration & Uncertainty)</span>
              <div className="text-sm text-slate-300 mt-0.5">
                Attribution: <span className="font-semibold text-slate-100">{currentTrace.confidence.sourceAttribution}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400">Confidence Level:</span>
            <span className="px-3 py-1 text-sm font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg">
              {currentTrace.confidence.confidenceLevel} ({currentTrace.confidence.scorePct}%)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
